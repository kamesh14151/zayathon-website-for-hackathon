import { motion } from "framer-motion";
import SectionPageLayout from "@/components/SectionPageLayout";
import BrandWordmark from "@/components/BrandWordmark";

const EventsPage = () => {
  return (
    <SectionPageLayout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title text-left mb-6"
          >
            Event Programs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-lg text-muted-foreground leading-relaxed mb-10"
          >
            Explore all official <BrandWordmark /> activities, from opening ceremony and mentoring rounds
            to final presentations and the award ceremony.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Opening Ceremony", time: "Day 1 · 09:00 AM" },
              { title: "Mentor Connect", time: "Day 1 · 01:00 PM" },
              { title: "Prototype Review", time: "Day 2 · 10:00 AM" },
              { title: "Final Demo + Awards", time: "Day 2 · 04:00 PM" },
            ].map((program) => (
              <div key={program.title} className="glow-card p-7">
                <h3 className="font-display text-2xl text-foreground mb-2">{program.title}</h3>
                <p className="text-muted-foreground">{program.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionPageLayout>
  );
};

export default EventsPage;
