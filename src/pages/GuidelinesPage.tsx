import { motion } from "framer-motion";
import SectionPageLayout from "@/components/SectionPageLayout";

const rules = [
  "Team size must be between 2 and 4 members.",
  "All projects should be built during the hackathon timeframe.",
  "Use of public open-source libraries is allowed with proper attribution.",
  "Submission must include source code and a short demo/video.",
  "Plagiarism or copied submissions lead to disqualification.",
  "Decision of judges is final for rankings and awards.",
];

const GuidelinesPage = () => {
  return (
    <SectionPageLayout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title text-left mb-6"
          >
            Participation Guidelines
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-lg text-muted-foreground mb-10"
          >
            Please review these rules before registering. Following these guidelines ensures a fair,
            smooth, and high-impact hackathon experience for everyone.
          </motion.p>

          <ol className="space-y-4 list-decimal pl-5">
            {rules.map((rule, index) => (
              <motion.li
                key={rule}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="glow-card p-5 text-foreground"
              >
                {rule}
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </SectionPageLayout>
  );
};

export default GuidelinesPage;
