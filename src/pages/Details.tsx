import Navbar from "@/components/Navbar";
import About from "@/components/About";
import ProblemStatements from "@/components/ProblemStatements";
import Prizes from "@/components/Prizes";
import Timeline from "@/components/Timeline";
import Sponsors from "@/components/Sponsors";
import Team from "@/components/Team";
import Footer from "@/components/Footer";

const Details = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <About />
        <ProblemStatements />
        <Prizes />
        <Timeline />
        <Sponsors />
        <Team />
      </div>
      <Footer />
    </div>
  );
};

export default Details;