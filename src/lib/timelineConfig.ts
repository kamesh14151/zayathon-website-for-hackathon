import { supabase } from "@/integrations/supabase/client";

export type TimelineEventStatus = "completed" | "upcoming";

export interface EditableTimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  status: TimelineEventStatus;
  color: string;
}

export const TIMELINE_STORAGE_KEY = "zayathon-timeline-events";
export const DEFAULT_COUNTDOWN_TARGET = "2026-02-15T09:00:00";

export const DEFAULT_TIMELINE_EVENTS: EditableTimelineEvent[] = [
  {
    id: "registration-opens",
    date: "Feb 2, 2026",
    time: "10:00 AM",
    title: "Registration Opens",
    description: "Start registering your team and prepare for the ultimate coding challenge.",
    status: "completed",
    color: "hsl(210 83% 67%)",
  },
  {
    id: "team-selection-announced",
    date: "Feb 3, 2026",
    time: "5:00 PM",
    title: "Team Selection Announced",
    description: "Selected teams will be announced. Check your email for confirmation.",
    status: "completed",
    color: "hsl(17 47% 58%)",
  },
  {
    id: "problem-statements-released",
    date: "Feb 5, 2026",
    time: "2:00 PM",
    title: "Problem Statements Released",
    description: "Choose from 20+ industry-relevant problem statements.",
    status: "upcoming",
    color: "hsl(48 11% 88%)",
  },
  {
    id: "hackathon-days",
    date: "Feb 15, 2026",
    time: "6:00 AM - 4:00 PM",
    title: "Hackathon Days",
    description: "10 hours of non-stop coding, mentoring sessions, and workshops.",
    status: "upcoming",
    color: "hsl(38 43% 83%)",
  },
  {
    id: "final-judging-awards",
    date: "Feb 16, 2026",
    time: "4:00 PM",
    title: "Final Judging & Awards",
    description: "Present your projects and win amazing prizes!",
    status: "upcoming",
    color: "hsl(17 47% 58%)",
  },
];

interface TimelineEventRow {
  id: string;
  order_index: number;
  date_text: string;
  time_text: string;
  title: string;
  description: string;
  status: TimelineEventStatus;
  color: string;
}

const isValidTimelineStatus = (value: unknown): value is TimelineEventStatus => {
  return value === "completed" || value === "upcoming";
};

const isValidTimelineEvent = (value: unknown): value is EditableTimelineEvent => {
  if (!value || typeof value !== "object") return false;
  const event = value as EditableTimelineEvent;
  return (
    typeof event.id === "string" &&
    typeof event.date === "string" &&
    typeof event.time === "string" &&
    typeof event.title === "string" &&
    typeof event.description === "string" &&
    typeof event.color === "string" &&
    isValidTimelineStatus(event.status)
  );
};

const mapRowToEvent = (row: TimelineEventRow): EditableTimelineEvent => ({
  id: row.id,
  date: row.date_text,
  time: row.time_text,
  title: row.title,
  description: row.description,
  status: row.status,
  color: row.color,
});

const mapEventToRow = (event: EditableTimelineEvent, index: number): TimelineEventRow => ({
  id: event.id,
  order_index: index,
  date_text: event.date,
  time_text: event.time,
  title: event.title,
  description: event.description,
  status: event.status,
  color: event.color,
});

const getTimelineEventsFromLocal = (): EditableTimelineEvent[] => {
  if (typeof window === "undefined") return DEFAULT_TIMELINE_EVENTS;

  const raw = localStorage.getItem(TIMELINE_STORAGE_KEY);
  if (!raw) return DEFAULT_TIMELINE_EVENTS;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_TIMELINE_EVENTS;

    const valid = parsed.filter(isValidTimelineEvent);
    return valid.length > 0 ? valid : DEFAULT_TIMELINE_EVENTS;
  } catch {
    return DEFAULT_TIMELINE_EVENTS;
  }
};

export const getTimelineEvents = async (): Promise<EditableTimelineEvent[]> => {
  try {
    const { data, error } = await supabase
      .from("timeline_events")
      .select("id, order_index, date_text, time_text, title, description, status, color")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      const localEvents = getTimelineEventsFromLocal();
      return localEvents;
    }

    const events = (data as TimelineEventRow[])
      .map(mapRowToEvent)
      .filter(isValidTimelineEvent);

    if (typeof window !== "undefined") {
      localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(events));
    }

    return events.length > 0 ? events : DEFAULT_TIMELINE_EVENTS;
  } catch {
    return getTimelineEventsFromLocal();
  }
};

export const saveTimelineEvents = async (events: EditableTimelineEvent[]) => {
  const sanitizedEvents = events.filter(isValidTimelineEvent);

  if (typeof window !== "undefined") {
    localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(sanitizedEvents));
  }

  try {
    const rows = sanitizedEvents.map((event, index) => mapEventToRow(event, index + 1));
    const { error } = await supabase.from("timeline_events").upsert(rows, { onConflict: "id" });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to save timeline" };
  }
};

const extractStartTime = (timeText: string) => {
  if (!timeText) return "09:00 AM";
  const rangeSplit = timeText.split("-")[0]?.trim();
  const match = rangeSplit.match(/\d{1,2}:\d{2}\s?(AM|PM)/i);
  if (match) return match[0].toUpperCase();
  return "09:00 AM";
};

export const getCountdownTargetDate = async (): Promise<string> => {
  try {
    const events = await getTimelineEvents();
    const hackathonEvent = events.find((event) => event.id === "hackathon-days");
    if (!hackathonEvent) return DEFAULT_COUNTDOWN_TARGET;

    const parsedDate = new Date(`${hackathonEvent.date} ${extractStartTime(hackathonEvent.time)}`);
    if (Number.isNaN(parsedDate.getTime())) return DEFAULT_COUNTDOWN_TARGET;

    return parsedDate.toISOString();
  } catch {
    return DEFAULT_COUNTDOWN_TARGET;
  }
};
