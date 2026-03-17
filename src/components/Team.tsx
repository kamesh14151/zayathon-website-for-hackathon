import { motion } from "framer-motion";
import { Linkedin, Twitter, Github } from "lucide-react";
import organizer1 from "../assets/organizer-1.jpg";
import organizer2 from "../assets/organizer-2.jpeg";
import organizer3 from "../assets/organizer-3.jpeg";
import organizer4 from "../assets/organizer-4.jpg";

const team = [
  {
    name: "Rahul Kumar Yadav",
    role: "Lead Organizer",
    image: organizer1,
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "Aditya Chaurasiya",
    role: "Technical Head",
    image: organizer2,
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "AKASH Adhikari",
    role: "Operations Lead",
    image: organizer3,
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "Shivshankar Kumar Jaisawal",
    role: "Marketing Head",
    image: organizer4,
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
];

const Team = () => {
  return (
    <section id="team" className="py-32 relative bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <h2 className="section-title">
            Our <span className="text-gradient">Team</span>
          </h2>
          <p className="section-subtitle">
            Meet the passionate individuals behind Zayathon who work tirelessly to make this event a success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.12, duration: 0.6, ease: [0.2, 0.0, 0, 1] }}
              whileHover={{ y: -2 }}
              className="glow-card p-8 text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border border-border/50 group-hover:border-accent/50 transition-colors duration-500"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              <h3 className="font-display text-xl font-normal text-foreground mb-1 group-hover:text-primary transition-colors">
                {member.name}
              </h3>
              <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase mb-6 font-medium">
                {member.role}
              </p>

              <div className="flex justify-center gap-3">
                {[
                  { icon: Linkedin, href: member.social.linkedin },
                  { icon: Twitter, href: member.social.twitter },
                  { icon: Github, href: member.social.github },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-all duration-200"
                    style={{ background: "hsl(var(--background))" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "hsl(var(--primary))"; e.currentTarget.style.color = "hsl(var(--primary))"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.color = ""; }}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
