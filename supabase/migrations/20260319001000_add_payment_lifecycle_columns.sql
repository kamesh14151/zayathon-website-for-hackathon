ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_status_updated_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS payment_session_created_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS checkout_url TEXT,
  ADD COLUMN IF NOT EXISTS dodo_payment_id TEXT;

CREATE INDEX IF NOT EXISTS idx_registrations_dodo_payment_id
  ON public.registrations (dodo_payment_id);

CREATE INDEX IF NOT EXISTS idx_registrations_payment_status
  ON public.registrations (payment_status);

COMMENT ON COLUMN public.registrations.payment_status IS 'Lifecycle state: pending, checkout_initialized, payment_success, payment_failed, payment_pending';
COMMENT ON COLUMN public.registrations.payment_status_updated_at IS 'Last timestamp when payment_status changed.';
COMMENT ON COLUMN public.registrations.payment_session_created_at IS 'Timestamp when checkout was initialized.';
COMMENT ON COLUMN public.registrations.reminder_sent_at IS 'Timestamp when pending payment reminder email was sent.';
COMMENT ON COLUMN public.registrations.checkout_url IS 'Dodo checkout URL generated during checkout initialization.';
COMMENT ON COLUMN public.registrations.dodo_payment_id IS 'Dodo payment identifier used for webhook correlation.';
