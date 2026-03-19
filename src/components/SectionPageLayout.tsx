import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SectionPageLayoutProps {
  children: ReactNode;
}

const SectionPageLayout = ({ children }: SectionPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default SectionPageLayout;
