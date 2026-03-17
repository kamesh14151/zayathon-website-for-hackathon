import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeFeatures from "@/components/HomeFeatures";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HomeFeatures />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
