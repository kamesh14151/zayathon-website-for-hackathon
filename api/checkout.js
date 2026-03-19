const sendPaymentReceiptEmail = async ({ toEmail, recipientName, checkoutUrl, paymentId }) => {
  const resendApiKey = String(process.env.RESEND_API_KEY || '').trim();
  const fromEmail = String(process.env.RESEND_FROM_EMAIL || 'Zayathon <onboarding@resend.dev>').trim();

  if (!resendApiKey || !toEmail) return;

  const siteUrl = String(process.env.VITE_APP_URL || 'https://zayathon.in').trim();
  const safeName = recipientName ? String(recipientName).trim() : 'Participant';

  const html = `
    <div style="background:#f6f4ef;padding:28px 16px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1d1d1d;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5ded0;border-radius:18px;overflow:hidden;">
        <div style="padding:22px 24px;background:#111014;color:#fff;">
          <h1 style="margin:0;font-size:24px;letter-spacing:0.2px;">ZAYATHON 2026</h1>
          <p style="margin:8px 0 0 0;color:#d4d2d9;font-size:14px;">Payment Receipt & Event Details</p>
        </div>

        <div style="padding:22px 24px;">
          <p style="margin:0 0 14px 0;font-size:16px;">Hi ${safeName},</p>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#444c5a;">
            Your payment session was created successfully. Use the button below to continue your Zayathon checkout.
          </p>

          <a href="${checkoutUrl}" style="display:inline-block;background:#e28664;color:#fff;text-decoration:none;font-weight:600;border-radius:10px;padding:11px 16px;font-size:14px;">
            Continue Payment
          </a>

          <div style="margin-top:18px;padding:14px 15px;border-radius:12px;background:#faf8f2;border:1px solid #e9e3d7;">
            <p style="margin:0 0 8px 0;font-size:13px;color:#6a7381;text-transform:uppercase;letter-spacing:0.08em;">Receipt</p>
            <p style="margin:0 0 6px 0;font-size:14px;"><strong>Event:</strong> Zayathon 2026</p>
            <p style="margin:0 0 6px 0;font-size:14px;"><strong>Team Fee:</strong> INR 200</p>
            <p style="margin:0;font-size:14px;"><strong>Payment ID:</strong> ${paymentId || 'Pending generation'}</p>
          </div>

          <div style="margin-top:16px;padding:14px 15px;border-radius:12px;background:#f7f5ef;border:1px solid #e5ded0;">
            <p style="margin:0 0 8px 0;font-size:13px;color:#6a7381;text-transform:uppercase;letter-spacing:0.08em;">Venue</p>
            <p style="margin:0 0 6px 0;font-size:14px;"><strong>Sona College of Technology</strong></p>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#444c5a;">Junction Main Road, Salem, Tamil Nadu 636005, India</p>
          </div>

          <div style="margin-top:16px;padding:14px 15px;border-radius:12px;background:#f7f5ef;border:1px solid #e5ded0;">
            <p style="margin:0 0 8px 0;font-size:13px;color:#6a7381;text-transform:uppercase;letter-spacing:0.08em;">Event Snapshot</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#444c5a;">Dates: Feb 15-16, 2026 | Format: On-site / Hybrid | Team Size: 2-4 members</p>
          </div>
        </div>

        <div style="padding:14px 24px;border-top:1px solid #eee7db;background:#fcfbf8;font-size:12px;color:#7f8898;">
          Need help? Contact zayacodehub@gmail.com<br />
          <a href="${siteUrl}" style="color:#3f5068;text-decoration:none;">${siteUrl}</a>
        </div>
      </div>
    </div>
  `;

  const payload = {
    from: fromEmail,
    to: [toEmail],
    subject: 'Zayathon 2026 Payment Receipt & Venue Details',
    html,
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend error: ${errorText || response.statusText}`);
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

    const { customer, billing: billingInput } = req.body || {};

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

        // Fire-and-forget style: checkout should still succeed even if email delivery fails.
        try {
          await sendPaymentReceiptEmail({
            toEmail: customer?.email,
            recipientName: customer?.name,
            checkoutUrl,
            paymentId: dodoData.payment_id || dodoData?.data?.payment_id,
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