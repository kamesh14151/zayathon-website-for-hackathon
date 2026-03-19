import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const BRAND_PRIMARY = '#111014';
const PANEL_BORDER = '#e4e7ee';
const PANEL_BG = '#f8fafc';
const TEAM_FEE_INR = 200;
const BRAND_NAME = 'AJ STUDIOZ';

const getSiteUrl = () => String(process.env.VITE_APP_URL || 'https://zayathon.in').trim();
const getResendApiKey = () => String(process.env.RESEND_API_KEY || '').trim();
const getFromEmail = () => String(process.env.RESEND_FROM_EMAIL || 'Zayathon <onboarding@resend.dev>').trim();

const toBase64 = (bytes) => Buffer.from(bytes).toString('base64');

const fetchLogoBytes = async () => {
  const siteUrl = getSiteUrl().replace(/\/$/, '');
  const logoUrl = `${siteUrl}/favicon.png`;

  try {
    const response = await fetch(logoUrl);
    if (!response.ok) return null;
    const arr = await response.arrayBuffer();
    return new Uint8Array(arr);
  } catch {
    return null;
  }
};

const buildReceiptPdfBase64 = async ({ recipientName, paymentId }) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Header band
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: rgb(0.07, 0.07, 0.09),
  });

  // Try embedding logo if available
  const logoBytes = await fetchLogoBytes();
  if (logoBytes) {
    try {
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.24);
      page.drawImage(logoImage, {
        x: 42,
        y: height - 92,
        width: logoDims.width,
        height: logoDims.height,
      });
    } catch {
      // Ignore logo embedding issues and continue with text-only branding.
    }
  }

  page.drawText(BRAND_NAME, {
    x: 120,
    y: height - 62,
    size: 18,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('ZAYATHON 2026 - PAYMENT RECEIPT', {
    x: 120,
    y: height - 86,
    size: 11,
    font,
    color: rgb(0.86, 0.86, 0.9),
  });

  // Card
  page.drawRectangle({
    x: 40,
    y: height - 420,
    width: width - 80,
    height: 260,
    borderWidth: 1,
    borderColor: rgb(0.89, 0.91, 0.95),
    color: rgb(0.98, 0.99, 1),
  });

  const safeRecipient = recipientName ? String(recipientName).trim() : 'Participant';
  const safePaymentId = paymentId || 'Not available';
  const now = new Date();

  page.drawText('Payment Confirmation', {
    x: 62,
    y: height - 188,
    size: 16,
    font: fontBold,
    color: rgb(0.12, 0.14, 0.17),
  });

  const lines = [
    ['Issued To', safeRecipient],
    ['Event', 'Zayathon 2026'],
    ['Amount', `INR ${TEAM_FEE_INR}`],
    ['Payment ID', String(safePaymentId)],
    ['Status', 'Successful'],
    ['Issued On', now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })],
  ];

  let y = height - 224;
  lines.forEach(([label, value]) => {
    page.drawText(`${label}:`, {
      x: 62,
      y,
      size: 11,
      font: fontBold,
      color: rgb(0.23, 0.27, 0.32),
    });

    page.drawText(String(value), {
      x: 170,
      y,
      size: 11,
      font,
      color: rgb(0.2, 0.24, 0.28),
    });

    y -= 28;
  });

  page.drawText('Thank you for registering with Zayathon.', {
    x: 62,
    y: height - 392,
    size: 10,
    font,
    color: rgb(0.37, 0.43, 0.48),
  });

  page.drawText('Need help? Contact: zayacodehub@gmail.com', {
    x: 40,
    y: 42,
    size: 9,
    font,
    color: rgb(0.43, 0.48, 0.55),
  });

  const pdfBytes = await pdfDoc.save();
  return toBase64(pdfBytes);
};

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
    <div style="background:#f3f5f9;padding:28px 16px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1d1d1d;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid ${PANEL_BORDER};border-radius:18px;overflow:hidden;box-shadow:0 8px 24px rgba(17,16,20,0.06);">
        <div style="padding:22px 24px;background:linear-gradient(135deg,#111014 0%,#1f2430 100%);color:#fff;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <img src="${siteUrl.replace(/\/$/, '')}/favicon.png" alt="${BRAND_NAME} logo" style="width:22px;height:22px;border-radius:6px;" />
            <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#cfd5df;">${BRAND_NAME}</p>
          </div>
          <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#cfd5df;">Zayathon Payment Desk</p>
          <h1 style="margin:0;font-size:24px;letter-spacing:0.2px;">${title}</h1>
          <p style="margin:8px 0 0 0;color:#d4d2d9;font-size:14px;">${subtitle}</p>
        </div>

        <div style="padding:22px 24px;">
          <p style="margin:0 0 14px 0;font-size:16px;">${greeting}</p>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;color:#394150;">
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

        <div style="padding:14px 24px;border-top:1px solid #edf1f6;background:#fbfcfe;font-size:12px;color:#7f8898;">
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

  if (kind === 'payment_success') {
    try {
      const receiptBase64 = await buildReceiptPdfBase64({
        recipientName,
        paymentId,
      });

      payload.attachments = [
        {
          filename: `Zayathon-Receipt-${paymentId || Date.now()}.pdf`,
          content: receiptBase64,
        },
      ];
    } catch (pdfError) {
      console.error('Failed to create PDF receipt attachment:', pdfError);
    }
  }

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
