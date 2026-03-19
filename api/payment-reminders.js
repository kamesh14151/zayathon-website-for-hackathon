import { getSupabaseAdmin } from './_lib/supabase-admin.js';
import { sendPaymentLifecycleEmail } from './_lib/payment-emails.js';

const MINUTES_BEFORE_REMINDER = Number.parseInt(
  String(process.env.PAYMENT_REMINDER_MINUTES || '45'),
  10
);

const getCutoffIso = () => {
  const minutes = Number.isNaN(MINUTES_BEFORE_REMINDER) ? 45 : MINUTES_BEFORE_REMINDER;
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
};

const isAllowedToRun = (req) => {
  const expected = String(process.env.PAYMENT_REMINDER_SECRET || '').trim();
  if (!expected) return true;

  const headerSecret = String(req.headers['x-reminder-secret'] || '').trim();
  const authHeader = String(req.headers.authorization || '').trim();
  const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : '';

  return headerSecret === expected || bearerToken === expected;
};

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAllowedToRun(req)) {
    return res.status(401).json({ error: 'Unauthorized reminder trigger' });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase service role is not configured' });
  }

  try {
    const cutoff = getCutoffIso();

    const { data: pendingRows, error: queryError } = await supabaseAdmin
      .from('registrations')
      .select('id, contact_email, checkout_url, dodo_payment_id, payment_status, payment_session_created_at, reminder_sent_at')
      .in('payment_status', ['checkout_initialized', 'payment_pending'])
      .lt('payment_session_created_at', cutoff)
      .is('reminder_sent_at', null)
      .limit(100);

    if (queryError) {
      console.error('Failed loading pending reminder rows:', queryError);
      return res.status(500).json({ error: 'Failed loading pending rows' });
    }

    const rows = pendingRows || [];
    let sent = 0;

    for (const row of rows) {
      if (!row.contact_email) continue;

      try {
        await sendPaymentLifecycleEmail({
          kind: 'payment_pending_reminder',
          toEmail: row.contact_email,
          checkoutUrl: row.checkout_url || undefined,
          paymentId: row.dodo_payment_id || undefined,
        });

        const { error: markError } = await supabaseAdmin
          .from('registrations')
          .update({
            reminder_sent_at: new Date().toISOString(),
          })
          .eq('id', row.id);

        if (!markError) {
          sent += 1;
        }
      } catch (emailError) {
        console.error(`Failed sending reminder for registration ${row.id}:`, emailError);
      }
    }

    return res.status(200).json({ ok: true, checked: rows.length, sent });
  } catch (error) {
    console.error('Payment reminder job failed:', error);
    return res.status(500).json({ error: 'Reminder job failed' });
  }
}
