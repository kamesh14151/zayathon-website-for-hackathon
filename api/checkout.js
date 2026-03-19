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

        return res.status(200).json(dodoData);
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