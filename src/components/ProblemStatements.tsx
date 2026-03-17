import { motion } from "framer-motion";
import { FileText, Lightbulb, Target } from "lucide-react";

const problemStatements = [
  "Open Innovation",
];

const ProblemStatements = () => {
  return (
    <section id="problem-statements" className="py-32 relative bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <h2 className="section-title">
            Open <span className="text-gradient">Innovation</span>
          </h2>
          <p className="section-subtitle">
            Bring your own ideas and build solutions for any problem you're passionate about.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problemStatements.map((statement, index) => (
            <motion.div
              key={statement}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: [0.2, 0.0, 0, 1] }}
              whileHover={{ y: -2 }}
              className="glow-card p-8 group cursor-pointer"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "hsl(var(--primary) / 0.1)" }}>
                  <Target className="w-6 h-6" style={{ color: "hsl(var(--primary))" }} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-normal mb-2 text-foreground transition-colors group-hover:text-primary">
                    {statement}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Tackle real-world challenges in this domain and build innovative solutions.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs tracking-widest uppercase text-muted-foreground">Explore Domain</span>
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  className="text-muted-foreground group-hover:text-primary transition-colors text-lg leading-none"
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="text-center mt-20 pt-16 border-t border-border"
        >
          <p className="text-muted-foreground text-lg mb-6">Ready to tackle a challenge?</p>
          <motion.a
            href="/register"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="neon-button inline-block"
          >
            Register Your Team
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemStatements;