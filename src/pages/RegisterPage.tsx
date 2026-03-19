import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users, Trophy, MapPin, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Registration from "@/components/Registration";
import Footer from "@/components/Footer";
import BrandWordmark from "@/components/BrandWordmark";

const highlights = [
  { icon: Calendar, label: "Event Date", value: "February 15–16, 2026" },
  { icon: Clock, label: "Duration", value: "48 Hours" },
  { icon: Users, label: "Team Size", value: "2–4 Members" },
  { icon: Trophy, label: "Prize Pool", value: "₹**** Lakhs" },
  { icon: MapPin, label: "Mode", value: "On-site / Hybrid" },
];

const perks = [
  "Free meals & refreshments throughout",
  "Mentorship from industry professionals",
  "Swag kits for all registered teams",
  "Internship & placement opportunities",
  "Certificates for all participants",
  "Networking with 200+ student innovators",
];

const RegisterPage = () => {
  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <Navbar />

      {/* Hero band */}
      <div
        className="pt-16 bg-background border-b border-border/40"
      >
        <div className="container mx-auto px-4 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left — event info */}
              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5 px-3 py-1.5 rounded-full"
                  style={{
                    background: "hsl(17 47% 58% / 0.12)",
                    color: "hsl(17 47% 42%)",
                    border: "1px solid hsl(17 47% 58% / 0.25)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(17 47% 58%)" }} />
                  Registrations Open
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="font-display font-normal text-foreground mb-4"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}
                >
                  Join <BrandWordmark /><br />2026
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="text-base mb-8 max-w-lg"
                  style={{ color: "hsl(var(--muted-foreground))", lineHeight: 1.7 }}
                >
                  India's premier student hackathon. 48 hours. Real problems. Real prizes.
                  Open to all students from 1st to 3rd year — form your team and build something incredible.
                </motion.p>

                {/* Event details grid */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
                >
                  {highlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl p-3.5"
                      style={{
                        background: "hsl(0 0% 100% / 0.7)",
                        border: "1px solid hsl(var(--border))",
                        boxShadow: "0 1px 4px hsl(0 0% 0% / 0.04)",
                      }}
                    >
                      <item.icon className="w-4 h-4 mb-1.5" style={{ color: "hsl(17 47% 58%)" }} />
                      <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{item.label}</p>
                      <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </motion.div>

                {/* Perks list */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="space-y-2"
                >
                  {perks.map((perk) => (
                    <div key={perk} className="flex items-center gap-2.5 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(17 47% 58%)" }} />
                      {perk}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — teaser copy */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="hidden lg:block rounded-3xl overflow-hidden relative"
                style={{
                  background: "linear-gradient(135deg, hsl(17 47% 58%) 0%, hsl(28 44% 66%) 100%)",
                  minHeight: "340px",
                  padding: "3rem",
                }}
              >
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <p className="text-white/70 text-xs tracking-widest uppercase mb-3">Registration fee</p>
                    <p className="font-display text-5xl font-normal text-white mb-1" style={{ letterSpacing: "-0.03em" }}>
                      ₹****
                    </p>
                    <p className="text-white/70 text-sm">per team · all inclusive</p>
                  </div>
                  <div>
                    <p className="text-white/80 text-sm mb-4 leading-relaxed">
                      Fill in the form, confirm your team, and pay the registration fee to secure your spot.
                      Spots are limited — don't miss out.
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="w-7 h-7 rounded-full border-2 border-white/30"
                            style={{ background: `hsl(${17 + i * 8} 47% ${50 + i * 4}%)` }} />
                        ))}
                      </div>
                      <p className="text-white/80 text-xs">200+ teams already registered</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Registration form section */}
      <main>
        <Registration />
      </main>

      <Footer />
    </div>
  );
};

export default RegisterPage;
