import { getSupabaseAdmin } from './_lib/supabase-admin.js';
import { sendPaymentLifecycleEmail } from './_lib/payment-emails.js';

const STATUS_SUCCESS = new Set(['paid', 'succeeded', 'success', 'completed', 'captured']);
const STATUS_FAILURE = new Set(['failed', 'failure', 'cancelled', 'canceled', 'expired', 'abandoned']);

const normalize = (value) => String(value || '').trim().toLowerCase();

const resolveEventType = (payload) => (
  payload?.type ||
  payload?.event ||
  payload?.event_type ||
  payload?.name ||
  payload?.kind ||
  ''
);

const resolveEventObject = (payload) => (
  payload?.data || payload?.payload || payload?.object || payload || {}
);

const resolvePaymentId = (eventObj) => (
  eventObj?.payment_id ||
  eventObj?.id ||
  eventObj?.payment?.payment_id ||
  eventObj?.payment?.id ||
  eventObj?.data?.payment_id ||
  eventObj?.data?.id ||
  null
);

const resolveStatus = (eventType, eventObj) => {
  const direct = normalize(
    eventObj?.status ||
    eventObj?.payment_status ||
    eventObj?.payment?.status ||
    eventObj?.data?.status ||
    eventObj?.data?.payment_status
  );

  if (direct) return direct;

  const normalizedEvent = normalize(eventType);
  if (normalizedEvent.includes('success') || normalizedEvent.includes('paid')) return 'paid';
  if (normalizedEvent.includes('fail') || normalizedEvent.includes('cancel') || normalizedEvent.includes('expire')) return 'failed';

  return '';
};

const resolveFailureReason = (eventObj) => (
  eventObj?.failure_reason ||
  eventObj?.failure_message ||
  eventObj?.error ||
  eventObj?.message ||
  eventObj?.data?.failure_reason ||
  eventObj?.data?.error ||
  ''
);

const resolveCustomer = (eventObj, fallbackEmail, fallbackName) => ({
  email: (
    eventObj?.customer?.email ||
    eventObj?.customer_email ||
    eventObj?.data?.customer?.email ||
    fallbackEmail ||
    ''
  ),
  name: (
    eventObj?.customer?.name ||
    eventObj?.customer_name ||
    eventObj?.data?.customer?.name ||
    fallbackName ||
    'Participant'
  ),
});

const resolveRegistrationIdFromMetadata = (eventObj) => (
  eventObj?.metadata?.registration_id ||
  eventObj?.payment?.metadata?.registration_id ||
  eventObj?.data?.metadata?.registration_id ||
  eventObj?.data?.payment?.metadata?.registration_id ||
  null
);

const findRegistration = async ({ supabaseAdmin, registrationId, paymentId, customerEmail }) => {
  if (registrationId) {
    const byId = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .maybeSingle();

    if (byId.data) return byId.data;
  }

  if (paymentId) {
    const byPayment = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('dodo_payment_id', String(paymentId))
      .maybeSingle();

    if (byPayment.data) return byPayment.data;
  }

  if (customerEmail) {
    const byEmail = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('contact_email', customerEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (byEmail.data) return byEmail.data;
  }

  return null;
};

const mapRegistrationStatus = (providerStatus) => {
  if (STATUS_SUCCESS.has(providerStatus)) return 'payment_success';
  if (STATUS_FAILURE.has(providerStatus)) return 'payment_failed';
  return 'payment_pending';
};

const mapEmailKind = (registrationStatus) => {
  if (registrationStatus === 'payment_success') return 'payment_success';
  if (registrationStatus === 'payment_failed') return 'payment_failed';
  return null;
};

const isWebhookAuthorized = (req) => {
  const expectedSecret = String(process.env.DODO_WEBHOOK_SECRET || '').trim();
  if (!expectedSecret) return true;

  const headerSecret = String(req.headers['x-dodo-webhook-secret'] || '').trim();
  const authHeader = String(req.headers.authorization || '').trim();
  const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : '';

  return headerSecret === expectedSecret || bearerToken === expectedSecret;
};

const createWebhookLog = async ({
  supabaseAdmin,
  eventType,
  paymentId,
  registrationId,
  providerStatus,
  payload,
}) => {
  const { data, error } = await supabaseAdmin
    .from('payment_webhook_events')
    .insert([{
      provider: 'dodo',
      event_type: eventType || null,
      payment_id: paymentId ? String(paymentId) : null,
      registration_id: registrationId || null,
      provider_status: providerStatus || null,
      payload,
      processed: false,
    }])
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('Failed to log incoming webhook event:', error);
    return null;
  }

  return data?.id || null;
};

const markWebhookLog = async ({ supabaseAdmin, logId, processed, processingError }) => {
  if (!logId) return;

  const { error } = await supabaseAdmin
    .from('payment_webhook_events')
    .update({
      processed,
      processing_error: processingError || null,
      processed_at: new Date().toISOString(),
    })
    .eq('id', logId);

  if (error) {
    console.error('Failed to update webhook log status:', error);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isWebhookAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized webhook' });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase service role is not configured' });
  }

  try {
    const payload = req.body || {};
    const eventType = resolveEventType(payload);
    const eventObj = resolveEventObject(payload);

    const paymentId = resolvePaymentId(eventObj);
    const providerStatus = resolveStatus(eventType, eventObj);
    const registrationStatus = mapRegistrationStatus(providerStatus);
    const emailKind = mapEmailKind(registrationStatus);
    const failureReason = resolveFailureReason(eventObj);
    const checkoutUrl = eventObj?.checkout_url || eventObj?.checkoutUrl || eventObj?.payment_link?.url || '';

    const metadataRegistrationId = resolveRegistrationIdFromMetadata(eventObj);
    const customer = resolveCustomer(eventObj);

    const logId = await createWebhookLog({
      supabaseAdmin,
      eventType,
      paymentId,
      registrationId: metadataRegistrationId,
      providerStatus,
      payload,
    });

    const registration = await findRegistration({
      supabaseAdmin,
      registrationId: metadataRegistrationId,
      paymentId,
      customerEmail: customer.email,
    });

    if (!registration) {
      await markWebhookLog({
        supabaseAdmin,
        logId,
        processed: true,
        processingError: 'registration_not_found',
      });
      return res.status(200).json({ ok: true, ignored: true, reason: 'registration_not_found' });
    }

    const nextState = {
      payment_status: registrationStatus,
      payment_status_updated_at: new Date().toISOString(),
    };

    if (paymentId) {
      nextState.dodo_payment_id = String(paymentId);
    }

    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update(nextState)
      .eq('id', registration.id);

    if (updateError) {
      console.error('Failed updating registration payment state from webhook:', updateError);
      await markWebhookLog({
        supabaseAdmin,
        logId,
        processed: false,
        processingError: updateError.message || 'failed_to_update_registration_payment_state',
      });
      return res.status(500).json({ error: 'Failed to update payment state' });
    }

    if (emailKind && registration.payment_status !== registrationStatus) {
      try {
        await sendPaymentLifecycleEmail({
          kind: emailKind,
          toEmail: registration.contact_email,
          recipientName: customer.name,
          checkoutUrl: registration.checkout_url || checkoutUrl,
          paymentId,
          failureReason,
        });
      } catch (emailError) {
        console.error('Failed to send webhook lifecycle email:', emailError);
      }
    }

    await markWebhookLog({
      supabaseAdmin,
      logId,
      processed: true,
      processingError: null,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Dodo webhook processing failed:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
