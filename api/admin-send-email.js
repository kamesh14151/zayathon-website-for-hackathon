const escapeHtml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const formatParagraphs = (text) => {
  const safe = escapeHtml(text || 'This is an update from the admin team.');
  return safe
    .split(/\n+/)
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 12px 0;font-size:15px;line-height:1.7;color:#394150;">${line}</p>`)
    .join('');
};

const buildEmailTemplate = ({ heading, subheading, message, ctaText, ctaUrl }) => {
  const safeHeading = escapeHtml(heading || 'Admin Update');
  const safeSubheading = escapeHtml(subheading || 'Zayathon 2026');
  const ctaBlock = ctaText && ctaUrl
    ? `<a href="${escapeHtml(ctaUrl)}" style="display:inline-block;padding:12px 18px;border-radius:10px;background:#111014;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">${escapeHtml(ctaText)}</a>`
    : '';

  return `
    <div style="background:#f3f5f9;padding:26px 14px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1d1d1d;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e4e7ee;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(17,16,20,0.06);">
        <div style="padding:22px 24px;background:linear-gradient(135deg,#111014 0%,#1f2430 100%);color:#ffffff;">
          <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#cfd5df;">Zayathon Admin</p>
          <h1 style="margin:0;font-size:24px;line-height:1.25;">${safeHeading}</h1>
          <p style="margin:8px 0 0 0;font-size:14px;color:#cfd5df;">${safeSubheading}</p>
        </div>

        <div style="padding:22px 24px;">
          ${formatParagraphs(message)}
          ${ctaBlock ? `<div style="margin-top:16px;">${ctaBlock}</div>` : ''}

          <div style="margin-top:18px;padding:14px;border-radius:12px;background:#f8fafc;border:1px solid #e8edf4;">
            <p style="margin:0;font-size:13px;color:#5f6b7a;">Need help? Reply to this email or contact the Zayathon admin team.</p>
          </div>
        </div>

        <div style="padding:14px 24px;border-top:1px solid #edf1f6;background:#fbfcfe;">
          <p style="margin:0;font-size:12px;color:#7b8794;">ZAYATHON 2026 · Admin Communication</p>
        </div>
      </div>
    </div>
  `;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const resendApiKey = String(process.env.RESEND_API_KEY || '').trim();
    const fromEmail = String(process.env.RESEND_FROM_EMAIL || 'Zayathon <onboarding@resend.dev>').trim();

    if (!resendApiKey) {
      return res.status(500).json({ error: 'RESEND_API_KEY is not configured' });
    }

    const { to, subject, message, heading, subheading, ctaText, ctaUrl } = req.body || {};

    if (!to || typeof to !== 'string') {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    const safeSubject = String(subject || 'Zayathon Admin Update').trim();
    const safeMessage = String(message || 'This is an update from the admin team.').trim();

    const html = buildEmailTemplate({
      heading,
      subheading,
      message: safeMessage,
      ctaText,
      ctaUrl,
    });

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
