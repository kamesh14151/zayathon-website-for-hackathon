const BRAND_PRIMARY = '#e28664';
const PANEL_BORDER = '#e5ded0';
const PANEL_BG = '#f7f5ef';

const getSiteUrl = () => String(process.env.VITE_APP_URL || 'https://zayathon.in').trim();
const getResendApiKey = () => String(process.env.RESEND_API_KEY || '').trim();
const getFromEmail = () => String(process.env.RESEND_FROM_EMAIL || 'Zayathon <onboarding@resend.dev>').trim();

const buildTemplate = ({ title, subtitle, greeting, body, ctaText, ctaUrl, receiptRows = [] }) => {
  const siteUrl = getSiteUrl();

  const receiptHtml = receiptRows.length
    ? `
      <div style="margin-top:18px;padding:14px 15px;border-radius:12px;background:#faf8f2;border:1px solid #e9e3d7;">
        <p style="margin:0 0 8px 0;font-size:13px;color:#6a7381;text-transform:uppercase;letter-spacing:0.08em;">Payment Details</p>
        ${receiptRows.map((row) => `<p style="margin:0 0 6px 0;font-size:14px;"><strong>${row.label}:</strong> ${row.value}</p>`).join('')}
      </div>
    `
    : '';

  const ctaHtml = ctaUrl && ctaText
    ? `
      <a href="${ctaUrl}" style="display:inline-block;background:${BRAND_PRIMARY};color:#fff;text-decoration:none;font-weight:600;border-radius:10px;padding:11px 16px;font-size:14px;">
        ${ctaText}
      </a>
    `
    : '';

  return `
    <div style="background:#f6f4ef;padding:28px 16px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1d1d1d;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid ${PANEL_BORDER};border-radius:18px;overflow:hidden;">
        <div style="padding:22px 24px;background:#111014;color:#fff;">
          <h1 style="margin:0;font-size:24px;letter-spacing:0.2px;">${title}</h1>
          <p style="margin:8px 0 0 0;color:#d4d2d9;font-size:14px;">${subtitle}</p>
        </div>

        <div style="padding:22px 24px;">
          <p style="margin:0 0 14px 0;font-size:16px;">${greeting}</p>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#444c5a;">
            ${body}
          </p>

          ${ctaHtml}
          ${receiptHtml}

          <div style="margin-top:16px;padding:14px 15px;border-radius:12px;background:${PANEL_BG};border:1px solid ${PANEL_BORDER};">
            <p style="margin:0 0 8px 0;font-size:13px;color:#6a7381;text-transform:uppercase;letter-spacing:0.08em;">Venue</p>
            <p style="margin:0 0 6px 0;font-size:14px;"><strong>Sona College of Technology</strong></p>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#444c5a;">Junction Main Road, Salem, Tamil Nadu 636005, India</p>
          </div>
        </div>

        <div style="padding:14px 24px;border-top:1px solid #eee7db;background:#fcfbf8;font-size:12px;color:#7f8898;">
          Need help? Contact zayacodehub@gmail.com<br />
          <a href="${siteUrl}" style="color:#3f5068;text-decoration:none;">${siteUrl}</a>
        </div>
      </div>
    </div>
  `;
};

const buildEmailContent = ({ kind, recipientName, checkoutUrl, paymentId, failureReason }) => {
  const safeName = recipientName ? String(recipientName).trim() : 'Participant';

  if (kind === 'payment_success') {
    return {
      subject: 'Payment Successful - Zayathon 2026',
      html: buildTemplate({
        title: 'ZAYATHON 2026',
        subtitle: 'Registration Payment Confirmed',
        greeting: `Hi ${safeName},`,
        body: 'Your payment was received successfully. Your team registration is now confirmed, and you are all set for Zayathon 2026.',
        ctaText: 'View Event Website',
        ctaUrl: getSiteUrl(),
        receiptRows: [
          { label: 'Event', value: 'Zayathon 2026' },
          { label: 'Team Fee', value: 'INR 200' },
          { label: 'Payment ID', value: paymentId || 'Not available' },
          { label: 'Status', value: 'Successful' },
        ],
      }),
    };
  }

  if (kind === 'payment_failed') {
    return {
      subject: 'Payment Not Completed - Zayathon 2026',
      html: buildTemplate({
        title: 'ZAYATHON 2026',
        subtitle: 'Payment Attempt Not Successful',
        greeting: `Hi ${safeName},`,
        body: failureReason
          ? `Your recent payment attempt could not be completed (${failureReason}). You can retry safely using the payment link below.`
          : 'Your recent payment attempt could not be completed. You can retry safely using the payment link below.',
        ctaText: checkoutUrl ? 'Retry Payment' : undefined,
        ctaUrl: checkoutUrl,
        receiptRows: [
          { label: 'Event', value: 'Zayathon 2026' },
          { label: 'Team Fee', value: 'INR 200' },
          { label: 'Payment ID', value: paymentId || 'Not available' },
          { label: 'Status', value: 'Failed / Cancelled' },
        ],
      }),
    };
  }

  if (kind === 'payment_pending_reminder') {
    return {
      subject: 'Reminder: Complete Your Zayathon Payment',
      html: buildTemplate({
        title: 'ZAYATHON 2026',
        subtitle: 'Payment Reminder',
        greeting: `Hi ${safeName},`,
        body: 'We noticed that you started checkout but payment is still pending. Complete the payment to confirm your team slot.',
        ctaText: checkoutUrl ? 'Continue Payment' : undefined,
        ctaUrl: checkoutUrl,
        receiptRows: [
          { label: 'Event', value: 'Zayathon 2026' },
          { label: 'Team Fee', value: 'INR 200' },
          { label: 'Payment ID', value: paymentId || 'Pending generation' },
          { label: 'Status', value: 'Pending' },
        ],
      }),
    };
  }

  return {
    subject: 'Zayathon 2026 Payment Receipt & Venue Details',
    html: buildTemplate({
      title: 'ZAYATHON 2026',
      subtitle: 'Payment Session Created',
      greeting: `Hi ${safeName},`,
      body: 'Your payment session was created successfully. Use the button below to continue your Zayathon checkout.',
      ctaText: checkoutUrl ? 'Continue Payment' : undefined,
      ctaUrl: checkoutUrl,
      receiptRows: [
        { label: 'Event', value: 'Zayathon 2026' },
        { label: 'Team Fee', value: 'INR 200' },
        { label: 'Payment ID', value: paymentId || 'Pending generation' },
      ],
    }),
  };
};

export const sendPaymentLifecycleEmail = async ({
  kind,
  toEmail,
  recipientName,
  checkoutUrl,
  paymentId,
  failureReason,
}) => {
  const resendApiKey = getResendApiKey();
  if (!resendApiKey || !toEmail) return;

  const { subject, html } = buildEmailContent({
    kind,
    recipientName,
    checkoutUrl,
    paymentId,
    failureReason,
  });

  const payload = {
    from: getFromEmail(),
    to: [toEmail],
    subject,
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
