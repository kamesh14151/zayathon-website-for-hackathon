import { motion } from "framer-motion";
import { Code, Users, Trophy, Rocket } from "lucide-react";
import BrandWordmark from "@/components/BrandWordmark";

const features = [
  {
    icon: Code,
    title: "48 Hours of Coding",
    description: "Non-stop innovation and problem-solving with cutting-edge technologies.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Form teams of up to 4 members and work together to build amazing projects.",
  },
  {
    icon: Trophy,
    title: "Amazing Prizes",
    description: "Win exciting prizes including cash rewards, gadgets, and internship opportunities.",
  },
  {
    icon: Rocket,
    title: "Real-World Problems",
    description: "Solve actual industry challenges provided by our corporate partners.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-32 relative bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <h2 className="section-title">
            About <BrandWordmark />
          </h2>
          <p className="section-subtitle">
            Join the most anticipated hackathon of the year. Open to all students from 1st to 3rd year.
            Showcase your skills, learn from experts, and build the future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.12, duration: 0.6, ease: [0.2, 0.0, 0, 1] }}
              whileHover={{ y: -2 }}
              className="p-8 md:p-10 rounded-2xl border bg-card text-card-foreground group transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-8">
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center bg-background border border-border/50"
                >
                  <feature.icon className="w-5 h-5 text-foreground" />
                </motion.div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                  Feature {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="h-px mb-8 bg-border/60" />

              <h3 className="font-body text-2xl md:text-[1.75rem] font-medium text-foreground mb-3 leading-tight tracking-tight group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="font-display text-[1.05rem] leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-24 pt-16 border-t border-border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Participants" },
              { value: "100+", label: "Teams" },
              { value: "₹*****", label: "Prize Pool" },
              { value: "10+", label: "Domains" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="text-center group cursor-pointer"
              >
                <div className="font-display text-5xl md:text-6xl font-normal text-foreground mb-3 transition-colors group-hover:text-primary">
                  {stat.value}
                </div>
                <div className="text-muted-foreground uppercase tracking-widest text-xs font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
