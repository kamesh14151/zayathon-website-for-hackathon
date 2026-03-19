import { motion } from "framer-motion";
import SectionPageLayout from "@/components/SectionPageLayout";
import BrandWordmark from "@/components/BrandWordmark";

const CommunityPage = () => {
  return (
    <SectionPageLayout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title text-left mb-6"
          >
            <BrandWordmark /> Community
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-lg text-muted-foreground leading-relaxed mb-10"
          >
            Connect with mentors, participants, and organizers. Share ideas, find teammates,
            and stay updated with announcements before and during the hackathon.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "Join discussion groups",
              "Find teammates by skill",
              "Get mentor office-hour updates",
            ].map((item) => (
              <div key={item} className="glow-card p-6 text-foreground font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </SectionPageLayout>
  );
};

export default CommunityPage;
