import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-background"
    >
      {/* Subtle minimalist radial at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-border/50 bg-secondary/30 text-muted-foreground shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Feb 2026 · Registrations Open
            </span>
          </motion.div>

          {/* Headline — Minimalist tracking-tight */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display font-semibold text-foreground mb-6"
            style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", letterSpacing: "-0.05em", lineHeight: 0.95 }}
          >
            ZAYATHON
          </motion.h1>

          {/* Sub-headline */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-body font-light">
              Build real solutions, gain industry exposure, and compete for exciting prizes. Join hundreds of builders, creators, and innovators.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-24"
          >
            <Link to="/register">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium transition-all shadow-sm hover:shadow-md"
              >
                Register Your Team
              </motion.span>
            </Link>
            <Link to="/details">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-foreground border border-border/60 hover:bg-secondary/50 font-medium transition-all shadow-sm"
              >
                Explore Details
              </motion.span>
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="pt-10 flex flex-wrap justify-center gap-12 md:gap-24"
          >
            {[
              { label: "Teams", value: "200+" },
              { label: "Prize Pool", value: "₹****" },
              { label: "Hours", value: "48" },
              { label: "Mentors", value: "20+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center cursor-default group"
              >
                <div className="font-display text-4xl md:text-5xl font-medium text-foreground tracking-tighter mb-2 group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.8 }}
          >
            <p className="mb-5 text-xs tracking-[0.18em] uppercase text-muted-foreground font-medium">
              Event starts in
            </p>
            <CountdownTimer targetDate="2026-02-15T09:00:00" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
