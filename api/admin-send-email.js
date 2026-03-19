export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const resendApiKey = String(process.env.RESEND_API_KEY || '').trim();
    const fromEmail = String(process.env.RESEND_FROM_EMAIL || 'Zayathon <onboarding@resend.dev>').trim();

    if (!resendApiKey) {
      return res.status(500).json({ error: 'RESEND_API_KEY is not configured' });
    }

    const { to, subject, message } = req.body || {};

    if (!to || typeof to !== 'string') {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    const safeSubject = String(subject || 'Zayathon Admin Update').trim();
    const safeMessage = String(message || 'This is an update from the admin team.').trim();

    const html = `
      <div style="background:#f6f4ef;padding:24px 14px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1d1d1d;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5ded0;border-radius:14px;overflow:hidden;">
          <div style="padding:18px 20px;background:#111014;color:#ffffff;">
            <h1 style="margin:0;font-size:22px;">ZAYATHON 2026</h1>
            <p style="margin:6px 0 0 0;color:#d4d2d9;font-size:13px;">Admin Update</p>
          </div>
          <div style="padding:18px 20px;">
            <p style="margin:0 0 10px 0;font-size:15px;line-height:1.6;color:#444c5a;">${safeMessage}</p>
          </div>
        </div>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: safeSubject,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({ error: errorText || 'Email provider rejected request' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Admin email send failed:', error);
    return res.status(500).json({ error: 'Failed to send admin email' });
  }
}
