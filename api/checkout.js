export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.DODO_PAYMENTS_API_KEY) {
      return res.status(500).json({ error: 'DODO_PAYMENTS_API_KEY is not set' });
    }

    const { customer } = req.body;
    
    // Instead of using lookupKey, we directly set to ₹200 team fee logic here
    // Create the payment checkout logic pointing to Dodo's REST API or similar SDK endpoint
    const dodoPayload = {
      product_cart: [{ 
        product_id: process.env.DODO_PRODUCT_ID_BASIC || 'zayathon_team_fee', 
        quantity: 1 
      }],
      ...(customer ? { customer } : {}),
      ...(process.env.VITE_APP_URL ? { return_url: process.env.VITE_APP_URL } : { return_url: 'https://zayathon.in' })
    };

    const configuredBaseUrl = String(process.env.DODO_PAYMENTS_BASE_URL || '').trim();

    // Dodo test and live API keys both use the primary API domain.
    // Only use a custom base URL when explicitly provided.
    const endpointCandidates = configuredBaseUrl
      ? [
          `${configuredBaseUrl.replace(/\/$/, '')}/payments`,
          'https://api.dodopayments.com/payments',
        ]
      : ['https://api.dodopayments.com/payments'];

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