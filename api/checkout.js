import { sendPaymentLifecycleEmail } from './_lib/payment-emails.js';
import { getSupabaseAdmin } from './_lib/supabase-admin.js';

const resolvePaymentId = (dodoData) => (
  dodoData?.payment_id ||
  dodoData?.id ||
  dodoData?.payment?.id ||
  dodoData?.payment?.payment_id ||
  dodoData?.data?.payment_id ||
  dodoData?.data?.id ||
  dodoData?.data?.payment?.id ||
  dodoData?.data?.payment?.payment_id ||
  null
);

const updateRegistrationCheckoutState = async ({ registrationId, checkoutUrl, paymentId }) => {
  if (!registrationId) return;
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) return;

  const payload = {
    payment_status: 'checkout_initialized',
    payment_session_created_at: new Date().toISOString(),
    checkout_url: checkoutUrl,
  };

  if (paymentId) {
    payload.dodo_payment_id = String(paymentId);
  }

  const { error } = await supabaseAdmin
    .from('registrations')
    .update(payload)
    .eq('id', registrationId);

  if (error) {
    console.error('Failed to persist checkout state:', error);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.DODO_PAYMENTS_API_KEY) {
      return res.status(500).json({ error: 'DODO_PAYMENTS_API_KEY is not set' });
    }

    const { customer, billing: billingInput, registrationId } = req.body || {};

    const parsedZipcode = Number.parseInt(String(billingInput?.zipcode || '636005'), 10);

    const billing = {
      city: String(billingInput?.city || 'Salem').trim(),
      country: String(billingInput?.country || 'IN').trim().toUpperCase(),
      state: String(billingInput?.state || 'Tamil Nadu').trim(),
      street: String(billingInput?.street || 'Sona College of Technology').trim(),
      zipcode: Number.isNaN(parsedZipcode) ? 636005 : parsedZipcode,
    };
    
    // Instead of using lookupKey, we directly set to ₹200 team fee logic here
    // Create the payment checkout logic pointing to Dodo's REST API or similar SDK endpoint
    const dodoPayload = {
      billing,
      payment_link: true,
      product_cart: [{ 
        product_id: process.env.DODO_PRODUCT_ID_BASIC || 'zayathon_team_fee', 
        quantity: 1 
      }],
      metadata: {
        registration_id: registrationId ? String(registrationId) : undefined,
      },
      ...(customer ? { customer } : {}),
      ...(process.env.VITE_APP_URL ? { return_url: process.env.VITE_APP_URL } : { return_url: 'https://zayathon.in' })
    };

    const configuredBaseUrl = String(process.env.DODO_PAYMENTS_BASE_URL || '').trim();
    const envMode = String(process.env.DODO_PAYMENTS_ENVIRONMENT || 'test_mode').trim();

    // Dodo environment hosts from docs.
    const defaultBaseUrl = envMode === 'live_mode'
      ? 'https://live.dodopayments.com'
      : 'https://test.dodopayments.com';

    // Keep old host as final fallback for compatibility.
    const endpointCandidates = configuredBaseUrl
      ? [
          `${configuredBaseUrl.replace(/\/$/, '')}/payments`,
          `${defaultBaseUrl}/payments`,
          'https://api.dodopayments.com/payments',
        ]
      : [
          `${defaultBaseUrl}/payments`,
          'https://api.dodopayments.com/payments',
        ];

    let lastError;

    for (const endpoint of endpointCandidates) {
      try {
        const dodoResponse = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`
          },
          body: JSON.stringify(dodoPayload)
        });

        const rawText = await dodoResponse.text();
        let dodoData = {};
        try {
          dodoData = rawText ? JSON.parse(rawText) : {};
        } catch {
          dodoData = { message: rawText || 'Unexpected Dodo API response' };
        }

        if (!dodoResponse.ok) {
          return res
            .status(dodoResponse.status)
            .json({ error: dodoData.message || dodoData.error || 'Failed to create checkout' });
        }

        const checkoutUrl =
          dodoData.checkout_url ||
          dodoData.checkoutUrl ||
          dodoData.url ||
          dodoData.payment_link ||
          dodoData?.payment_link?.payment_link ||
          dodoData?.payment_link?.url ||
          dodoData?.payment_link?.checkout_url ||
          dodoData.payment_url ||
          dodoData.hosted_url ||
          dodoData?.data?.checkout_url ||
          dodoData?.data?.checkoutUrl ||
          dodoData?.data?.url ||
          dodoData?.data?.payment_link ||
          dodoData?.data?.payment_link?.payment_link ||
          dodoData?.data?.payment_link?.url ||
          dodoData?.data?.payment_link?.checkout_url ||
          dodoData?.data?.payment_url ||
          dodoData?.data?.hosted_url;

        if (!checkoutUrl || typeof checkoutUrl !== 'string') {
          console.error('Dodo response did not include a usable checkout URL:', dodoData);
          return res.status(502).json({
            error: 'Dodo response missing checkout URL',
            details: {
              topLevelKeys: Object.keys(dodoData || {}),
              dataKeys: dodoData?.data && typeof dodoData.data === 'object' ? Object.keys(dodoData.data) : [],
            },
          });
        }

        const paymentId = resolvePaymentId(dodoData);

        await updateRegistrationCheckoutState({
          registrationId,
          checkoutUrl,
          paymentId,
        });

        // Checkout should still succeed even if email delivery fails.
        try {
          await sendPaymentLifecycleEmail({
            kind: 'checkout_initialized',
            toEmail: customer?.email,
            recipientName: customer?.name,
            checkoutUrl,
            paymentId,
          });
        } catch (emailError) {
          console.error('Failed to send receipt email via Resend:', emailError);
        }

        return res.status(200).json({ ...dodoData, checkout_url: checkoutUrl });
      } catch (error) {
        console.error(`Checkout request failed for ${endpoint}:`, error);
        lastError = error;
      }
    }

    throw lastError || new Error('Failed to reach Dodo API endpoint');
  } catch (error) {
    console.error('Error creating Dodo checkout session:', error);
    return res.status(500).json({ error: 'Failed to create Dodo checkout session' });
  }
}