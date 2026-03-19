import { motion } from "framer-motion";
import BrandWordmark from "@/components/BrandWordmark";

const sponsors = {
  platinum: [
    { name: "TechCorp", logo: "T" },
    { name: "InnovateTech", logo: "I" },
  ],
  gold: [
    { name: "DevStudio", logo: "D" },
    { name: "CloudBase", logo: "C" },
    { name: "AILabs", logo: "A" },
  ],
  silver: [
    { name: "StartupHub", logo: "S" },
    { name: "CodeSchool", logo: "C" },
    { name: "DataDrive", logo: "D" },
    { name: "WebFlow", logo: "W" },
  ],
};

const SponsorCard = ({
  sponsor,
  tier,
  index,
}: {
  sponsor: { name: string; logo: string };
  tier: string;
  index: number;
}) => {
  const sizePx = { platinum: "w-44 h-28", gold: "w-36 h-24", silver: "w-28 h-20" };
  const textSize = { platinum: "text-4xl", gold: "text-3xl", silver: "text-2xl" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.04 }}
      className={`glow-card ${sizePx[tier as keyof typeof sizePx]} flex flex-col items-center justify-center gap-2 cursor-pointer group`}
    >
      <span className={`font-display font-normal text-foreground group-hover:text-primary transition-colors ${textSize[tier as keyof typeof textSize]}`}>
        {sponsor.logo}
      </span>
      <span className="text-xs tracking-widest uppercase text-muted-foreground font-medium">
        {sponsor.name}
      </span>
    </motion.div>
  );
};

const Sponsors = () => {
  const handleSponsorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const email = "director@zayathon.in";
    const subject = "Sponsorship Inquiry for Zayathon 2026";
    const body = "Hi Zayathon Team,\n\nI am interested in learning more about sponsorship opportunities for Zayathon 2026.\n\n";
    
    // Check if user is on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, use mailto (works reliably)
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      // On desktop, open Gmail compose in new tab (more reliable than mailto)
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank');
    }
  };

  return (
    <section id="sponsors" className="py-32 relative bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <h2 className="section-title">
            Our <span className="text-gradient">Sponsors</span>
          </h2>
          <p className="section-subtitle">
            We're proud to partner with industry leaders who make <BrandWordmark /> possible.
          </p>
        </motion.div>

        {/* Platinum Sponsors */}
        <div className="mb-16 pb-16 border-b border-border">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center font-body text-xs text-muted-foreground mb-8 tracking-[0.2em] uppercase font-semibold"
          >
            Platinum Partners
          </motion.p>
          <div className="flex flex-wrap justify-center gap-8">
            {sponsors.platinum.map((sponsor, index) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} tier="platinum" index={index} />
            ))}
          </div>
        </div>

        {/* Gold Sponsors */}
        <div className="mb-16 pb-16 border-b border-border">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center font-body text-xs text-muted-foreground mb-8 tracking-[0.2em] uppercase font-semibold"
          >
            Gold Partners
          </motion.p>
          <div className="flex flex-wrap justify-center gap-6">
            {sponsors.gold.map((sponsor, index) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} tier="gold" index={index} />
            ))}
          </div>
        </div>

        {/* Silver Sponsors */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center font-body text-xs text-muted-foreground mb-8 tracking-[0.2em] uppercase font-semibold"
          >
            Silver Partners
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            {sponsors.silver.map((sponsor, index) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} tier="silver" index={index} />
            ))}
          </div>
        </div>

        {/* Become a Sponsor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-20 pt-16 border-t border-border"
        >
          <p className="text-muted-foreground text-lg mb-6">
            Interested in sponsoring <BrandWordmark />?
          </p>
          <motion.a
            href="mailto:director@zayathon.in"
            onClick={handleSponsorClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="neon-button-secondary inline-block cursor-pointer"
          >
            Become a Sponsor →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Sponsors;
