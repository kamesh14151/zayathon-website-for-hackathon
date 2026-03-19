CREATE TABLE IF NOT EXISTS public.timeline_events (
  id TEXT PRIMARY KEY,
  order_index INTEGER NOT NULL UNIQUE,
  date_text TEXT NOT NULL,
  time_text TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'upcoming')),
  color TEXT NOT NULL DEFAULT 'hsl(17 47% 58%)',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read timeline events" ON public.timeline_events;
CREATE POLICY "Allow public read timeline events"
  ON public.timeline_events
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert timeline events" ON public.timeline_events;
CREATE POLICY "Allow public insert timeline events"
  ON public.timeline_events
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update timeline events" ON public.timeline_events;
CREATE POLICY "Allow public update timeline events"
  ON public.timeline_events
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete timeline events" ON public.timeline_events;
CREATE POLICY "Allow public delete timeline events"
  ON public.timeline_events
  FOR DELETE
  USING (true);

DROP TRIGGER IF EXISTS handle_updated_at_timeline_events ON public.timeline_events;
CREATE TRIGGER handle_updated_at_timeline_events
  BEFORE UPDATE ON public.timeline_events
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

INSERT INTO public.timeline_events (id, order_index, date_text, time_text, title, description, status, color)
VALUES
  ('registration-opens', 1, 'Feb 2, 2026', '10:00 AM', 'Registration Opens', 'Start registering your team and prepare for the ultimate coding challenge.', 'completed', 'hsl(210 83% 67%)'),
  ('team-selection-announced', 2, 'Feb 3, 2026', '5:00 PM', 'Team Selection Announced', 'Selected teams will be announced. Check your email for confirmation.', 'completed', 'hsl(17 47% 58%)'),
  ('problem-statements-released', 3, 'Feb 5, 2026', '2:00 PM', 'Problem Statements Released', 'Choose from 20+ industry-relevant problem statements.', 'upcoming', 'hsl(48 11% 88%)'),
  ('hackathon-days', 4, 'Feb 15, 2026', '6:00 AM - 4:00 PM', 'Hackathon Days', '10 hours of non-stop coding, mentoring sessions, and workshops.', 'upcoming', 'hsl(38 43% 83%)'),
  ('final-judging-awards', 5, 'Feb 16, 2026', '4:00 PM', 'Final Judging & Awards', 'Present your projects and win amazing prizes!', 'upcoming', 'hsl(17 47% 58%)')
ON CONFLICT (id) DO UPDATE
SET
  order_index = EXCLUDED.order_index,
  date_text = EXCLUDED.date_text,
  time_text = EXCLUDED.time_text,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  color = EXCLUDED.color;
