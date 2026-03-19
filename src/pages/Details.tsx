import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const detailsGroups = [
  {
    title: "Products",
    items: [
      { label: "Register", to: "/register" },
      { label: "Payment Portal", to: "/payment" },
      { label: "Prize Pool", to: "/prizes" },
      { label: "Timeline", to: "/timeline" },
      { label: "Sponsors", to: "/sponsors" },
    ],
  },
  {
    title: "Hackathon",
    items: [
      { label: "About Zayathon", to: "/about" },
      { label: "Problem Statements", to: "/problem-statements" },
      { label: "Organizing Team", to: "/team" },
      { label: "Participation Guide", to: "/guidelines" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Community", to: "/community" },
      { label: "Events", to: "/events" },
      { label: "FAQs", to: "/faq" },
      { label: "Guidelines", to: "/guidelines" },
    ],
  },
];

const Details = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-12">
            <h1 className="font-display text-5xl md:text-6xl tracking-tight text-foreground mb-4">
              Explore Zayathon
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Zayathon is a student-first hackathon focused on solving real-world problems with practical,
              high-impact solutions. This page gives you a quick overview and direct access to every dedicated section.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <article className="glow-card p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">Event Window</p>
              <h2 className="font-display text-2xl text-foreground">Feb 15-16, 2026</h2>
            </article>
            <article className="glow-card p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">Format</p>
              <h2 className="font-display text-2xl text-foreground">On-site / Hybrid</h2>
            </article>
            <article className="glow-card p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">Team Size</p>
              <h2 className="font-display text-2xl text-foreground">2-4 Members</h2>
            </article>
          </div>

          <div className="glow-card p-6 md:p-7 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">Event Venue</p>
                <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">Sona College of Technology</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Junction Main Road, Salem, Tamil Nadu, India. The venue includes seminar halls,
                  collaboration spaces, and core event infrastructure for team coding and final demos.
                </p>
                <p className="text-sm text-foreground/80">
                  Campus support: Wi-Fi, power backup, mentor desks, and presentation rooms.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-border bg-card h-[240px]">
                <iframe
                  title="Sona College of Technology Map"
                  src="https://www.google.com/maps?q=Sona%20College%20of%20Technology%20Salem&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {detailsGroups.map((group) => (
              <article key={group.title} className="glow-card p-7">
                <h2 className="font-display text-2xl text-foreground mb-5">{group.title}</h2>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="text-foreground/75 hover:text-foreground transition-colors text-[15px]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Details;