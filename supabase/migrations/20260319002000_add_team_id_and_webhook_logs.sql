CREATE SEQUENCE IF NOT EXISTS public.registrations_team_id_seq START WITH 1001 INCREMENT BY 1;

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS team_id TEXT;

UPDATE public.registrations
SET team_id = 'TEAM-' || LPAD(nextval('public.registrations_team_id_seq')::text, 5, '0')
WHERE team_id IS NULL;

ALTER TABLE public.registrations
  ALTER COLUMN team_id SET DEFAULT ('TEAM-' || LPAD(nextval('public.registrations_team_id_seq')::text, 5, '0'));

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_team_id_unique
  ON public.registrations (team_id);

COMMENT ON COLUMN public.registrations.team_id IS 'Human-friendly team identifier (example: TEAM-01001).';

CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'dodo',
  event_type TEXT,
  payment_id TEXT,
  registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
  provider_status TEXT,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  processing_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_payment_id
  ON public.payment_webhook_events (payment_id);

CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_registration_id
  ON public.payment_webhook_events (registration_id);

CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_created_at
  ON public.payment_webhook_events (created_at DESC);

ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payment webhook events" ON public.payment_webhook_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE user_id = auth.uid()
    )
  );
