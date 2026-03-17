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

    // Use standard Fetch API since @dodopayments SDK depends on Node/Next specifically
    const dodoResponse = await fetch(
      process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode' 
        ? 'https://api.dodopayments.com/payments' 
        : 'https://test-api.dodopayments.com/payments', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`
        },
        body: JSON.stringify(dodoPayload)
      }
    );

    const dodoData = await dodoResponse.json();

    if (!dodoResponse.ok) {
      return res.status(dodoResponse.status).json({ error: dodoData.message || 'Failed to create checkout' });
    }

    return res.status(200).json(dodoData);
  } catch (error) {
    console.error('Error creating Dodo checkout session:', error);
    return res.status(500).json({ error: 'Failed to create Dodo checkout session' });
  }
}