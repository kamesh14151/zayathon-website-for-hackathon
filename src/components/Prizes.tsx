import { motion } from "framer-motion";
import { Trophy, Medal, Award, Star } from "lucide-react";

const prizes = [
  {
    position: "1st",
    title: "Grand Champion",
    amount: "₹****",
    icon: Trophy,
    color: "from-foreground to-primary",
    benefits: ["Cash Prize", "Internship Opportunity", "Goodies & Swags", "Certificate"],
    featured: true,
  },
  {
    position: "2nd",
    title: "First Runner Up",
    amount: "₹****",
    icon: Medal,
    color: "from-muted-foreground to-foreground",
    benefits: ["Cash Prize", "Goodies & Swags", "Certificate"],
    featured: false,
  },
  {
    position: "3rd",
    title: "Second Runner Up",
    amount: "₹****",
    icon: Award,
    color: "from-foreground to-muted-foreground",
    benefits: ["Cash Prize", "Goodies & Swags", "Certificate"],
    featured: false,
  },
];

const specialPrizes = [
  { title: "Best UI/UX", amount: "₹****" },
  { title: "Best Innovation", amount: "₹****" },
  { title: "Best Use of AI", amount: "₹****" },
  { title: "People's Choice", amount: "₹****" },
];

const Prizes = () => {
  return (
    <section id="prizes" className="py-32 relative overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <h2 className="section-title">
            Prize <span className="text-muted-foreground">Pool</span>
          </h2>
          <p className="section-subtitle">
            Compete for amazing prizes worth over ₹**** Lakhs! Winners get cash prizes,
            internship opportunities, and exclusive goodies.
          </p>
        </motion.div>

        {/* Main Prizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {prizes.map((prize, index) => (
            <motion.div
              key={prize.position}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.7, ease: [0.2, 0.0, 0, 1] }}
              whileHover={{ y: -2, scale: 1.01 }}
              className={`glow-card p-10 text-center group relative ${prize.featured ? 'border-primary/20 border md:scale-[1.02] shadow-sm' : ''}`}
            >
              {prize.featured && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 bg-primary text-primary-foreground text-[10px] uppercase font-bold rounded-full tracking-widest shadow-sm"
                >
                  FEATURED
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${prize.featured ? 'bg-primary shadow-md' : 'bg-secondary/50 border border-border group-hover:bg-secondary'}`}
              >
                <prize.icon className="w-10 h-10" style={{ color: prize.featured ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))" }} />
              </motion.div>

              <div className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 font-semibold">
                {prize.position} Place
              </div>
              <h3 className="font-display text-2xl font-semibold mb-4 text-foreground transition-colors group-hover:text-primary/80">
                {prize.title}
              </h3>
              <div className="font-display text-4xl md:text-5xl font-medium text-foreground tracking-tight mb-8">
                {prize.amount}
              </div>

              <div className="space-y-3.5">
                {prize.benefits.map((benefit) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-2.5 text-muted-foreground text-sm font-medium"
                  >
                    <Star className="w-3.5 h-3.5" style={{ color: "hsl(var(--foreground))" }} />
                    {benefit}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special Prizes */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-24 pt-16 border-t border-border"
        >
          <h3 className="font-display text-3xl font-medium text-center mb-12 text-foreground tracking-tight">
            Special <span className="text-muted-foreground">Categories</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {specialPrizes.map((prize, index) => (
              <motion.div
                key={prize.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.2, 0.0, 0, 1] }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="glow-card p-8 text-center group bg-secondary/20"
              >
                <h4 className="font-display text-lg font-medium text-muted-foreground mb-4 group-hover:text-foreground transition-colors">
                  {prize.title}
                </h4>
                <div className="font-display text-2xl font-semibold text-foreground tracking-tight">
                  {prize.amount}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Prizes;
