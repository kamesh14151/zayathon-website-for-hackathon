-- Allow public delete for registrations (current admin flow uses anon client)
-- NOTE: This is permissive. For production hardening, replace with admin-only policy.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'registrations'
      AND policyname = 'Allow public delete for registrations'
  ) THEN
    CREATE POLICY "Allow public delete for registrations" ON public.registrations
      FOR DELETE USING (true);
  END IF;
END $$;

COMMENT ON POLICY "Allow public delete for registrations" ON public.registrations
IS 'Allows public delete for registrations. Replace with stricter admin-only checks in production.';
