import { motion } from "framer-motion";
import { Calendar, Users, Code, FileCheck, Trophy, CheckCircle2, Clock } from "lucide-react";

const timelineEvents = [
  {
    date: "Feb 2, 2026",
    time: "10:00 AM",
    title: "Registration Opens",
    description: "Start registering your team and prepare for the ultimate coding challenge.",
    icon: Calendar,
    status: "completed",
    color: "hsl(210 83% 67%)",
  },
  {
    date: "Feb 3, 2026",
    time: "5:00 PM",
    title: "Team Selection Announced",
    description: "Selected teams will be announced. Check your email for confirmation.",
    icon: Users,
    status: "completed",
    color: "hsl(17 47% 58%)",
  },
  {
    date: "Feb 5, 2026",
    time: "2:00 PM",
    title: "Problem Statements Released",
    description: "Choose from 20+ industry-relevant problem statements.",
    icon: FileCheck,
    status: "upcoming",
    color: "hsl(48 11% 88%)",
  },
  {
    date: "Feb 15, 2026",
    time: "6:00 AM - 4:00 PM",
    title: "Hackathon Days",
    description: "10 hours of non-stop coding, mentoring sessions, and workshops.",
    icon: Code,
    status: "upcoming",
    color: "hsl(38 43% 83%)",
  },
  {
    date: "Feb 16, 2026",
    time: "4:00 PM",
    title: "Final Judging & Awards",
    description: "Present your projects and win amazing prizes!",
    icon: Trophy,
    status: "upcoming",
    color: "hsl(17 47% 58%)",
  },
];

const Timeline = () => {
  return (
    <section id="timeline" className="py-24 relative bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="section-title">
            Event <span className="text-gradient">Timeline</span>
          </h2>
          <p className="section-subtitle">
            Mark your calendars! Here's everything you need to know about the schedule.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:transform md:-translate-x-1/2" />
          
          {/* Progress Indicator */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.2, 0.0, 0, 1] }}
            className="absolute left-4 md:left-1/2 top-0 w-px bg-accent md:transform md:-translate-x-1/2 origin-top"
          />

          {timelineEvents.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.2, 0.0, 0, 1] }}
              className={`relative flex items-stretch mb-16 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline Dot */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute left-4 md:left-1/2 top-6 md:top-8 transform -translate-x-1/2 z-20"
              >
                <div
                  className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer shadow-sm"
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: event.status === "completed" ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))" }} />
                </div>
              </motion.div>

              {/* Content Card */}
              <div
                className={`ml-16 md:ml-0 md:w-5/12 flex flex-col ${
                  index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                }`}
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="glow-card p-8 h-full group relative overflow-hidden bg-card"
                >
                  {/* Date and Time Badge */}
                  <div className="mb-4">
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.12 + 0.1 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border"
                      style={{
                        backgroundColor: `${event.color}15`,
                        borderColor: event.color,
                        color: event.color,
                      }}
                    >
                      <Calendar className="w-3 h-3" />
                      {event.date}
                    </motion.span>
                  </div>

                  {/* Time Info */}
                  <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" style={{ color: event.color }} />
                    <span>{event.time}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl font-normal text-foreground mb-3 group-hover:text-accent transition-colors">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {event.description}
                  </p>

                  {/* Status Indicator */}
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span
                      className="text-xs font-semibold tracking-wide px-2 py-1 rounded-full uppercase"
                      style={{
                        backgroundColor: event.status === "completed" ? "hsl(var(--accent) / 0.12)" : "hsl(var(--ring) / 0.12)",
                        color: event.status === "completed" ? "hsl(var(--accent))" : "hsl(var(--ring))",
                      }}
                    >
                      {event.status === "completed" ? "✓ Completed" : "◯ Upcoming"}
                    </span>
                    <div className="text-xs font-body text-muted-foreground">Step {index + 1}/5</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Timeline End Accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute left-4 md:left-1/2 bottom-0 transform -translate-x-1/2 -translate-y-12"
          >
            <div className="w-4 h-4 rounded-full bg-accent border-4 border-background" />
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">Ready to join the event?</p>
          <motion.a
            href="/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="neon-button"
          >
            Register Your Team Now
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;
