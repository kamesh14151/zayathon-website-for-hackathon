import { motion } from "framer-motion";
import { Lightbulb, Code2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Lightbulb,
    title: "Open Innovation",
    description: "Bring your own radical ideas. We provide the platform, you provide the vision. Build solutions without constraints across any domain.",
    link: "/details#problem-statements",
    linkText: "View guidelines"
  },
  {
    icon: Code2,
    title: "Intelligent Collaboration",
    description: "Form teams of up to 4 passionate builders. Collaborate seamlessly, leverage partner APIs, and construct the next big thing in 48 hours.",
    link: "/details#team",
    linkText: "Meet the organizers"
  },
  {
    icon: Rocket,
    title: "Launch & Scale",
    description: "Compete for a massive prize pool, gain direct industry exposure, and get your prototype in front of top-tier judges and mentors.",
    link: "/details#prizes",
    linkText: "Explore prizes"
  }
];

const HomeFeatures = () => {
  return (
    <section className="py-24 bg-background relative border-t border-border/40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: [0.2, 0.0, 0, 1] }}
              whileHover={{ y: -4 }}
              className="glow-card p-10 flex flex-col group"
            >
              <div className="mb-8">
                <feature.icon className="w-8 h-8 text-foreground/80 mb-6 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                <h3 className="font-display text-2xl font-normal text-foreground mb-4 tracking-tight leading-snug">
                  {feature.title}
                </h3>
                <p className="font-body text-[1.05rem] text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="mt-auto pt-8 border-t border-border/60">
                <Link 
                  to={feature.link}
                  className="inline-flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors py-1 group/link"
                >
                  {feature.linkText}
                  <span className="ml-2 transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Large Highlight Card */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ delay: 0.2, duration: 0.7, ease: [0.2, 0.0, 0, 1] }}
           className="max-w-6xl mx-auto glow-card overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-12 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border/40">
              <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">The Experience</span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-[1.05] tracking-tighter">
                Push the boundaries of what's possible.
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-body">
                Join a community of forward-thinking developers, designers, and creators. For 48 hours, you'll have the space and resources to turn your most ambitious ideas into reality.
              </p>
              <div>
                <Link to="/register">
                  <motion.span 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium transition-colors shadow-sm"
                  >
                    Register Your Team
                  </motion.span>
                </Link>
              </div>
            </div>
            <div className="bg-secondary/50 p-12 md:p-16 flex flex-col justify-center relative overflow-hidden">
               {/* Minimalist decorative elements */}
               <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/20 pointer-events-none" />
               <div className="relative z-10 space-y-10">
                 {[
                   { label: "Date", value: "February 15-16, 2026" },
                   { label: "Format", value: "In-Person Hackathon" },
                   { label: "Eligibility", value: "Open to 1st - 3rd Year Students" }
                 ].map((item, i) => (
                   <div key={i} className="border-l-[3px] border-primary/20 pl-6 transition-colors hover:border-primary">
                     <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{item.label}</div>
                     <div className="font-display text-2xl font-medium text-foreground tracking-tight">{item.value}</div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeFeatures;