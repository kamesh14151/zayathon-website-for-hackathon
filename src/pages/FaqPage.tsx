import { motion } from "framer-motion";
import SectionPageLayout from "@/components/SectionPageLayout";

const faqs = [
  {
    question: "Who can participate in Zayathon?",
    answer: "Students from 1st to 3rd year can participate in teams of 2 to 4 members.",
  },
  {
    question: "Is this online or on-site?",
    answer: "Zayathon supports on-site and hybrid participation based on selected team slots.",
  },
  {
    question: "What is the registration fee?",
    answer: "The registration fee is INR 200 per team unless updated in the official notice.",
  },
  {
    question: "Do all participants get certificates?",
    answer: "Yes, all valid participants receive participation certificates after the event.",
  },
];

const FaqPage = () => {
  return (
    <SectionPageLayout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title text-left mb-8"
          >
            Frequently Asked Questions
          </motion.h1>

          <div className="space-y-5">
            {faqs.map((item, index) => (
              <motion.article
                key={item.question}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="glow-card p-7"
              >
                <h2 className="font-display text-2xl text-foreground mb-2">{item.question}</h2>
                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </SectionPageLayout>
  );
};

export default FaqPage;
