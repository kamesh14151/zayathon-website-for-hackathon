import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BrandWordmark from "@/components/BrandWordmark";
import StyledAjQr from "@/components/StyledAjQr";

const Footer = () => {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const qrWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOutsidePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!qrWrapperRef.current) return;
      const target = event.target as Node;
      if (!qrWrapperRef.current.contains(target)) {
        setIsQrOpen(false);
      }
    };

    document.addEventListener("mousedown", onOutsidePointerDown);
    document.addEventListener("touchstart", onOutsidePointerDown);
    return () => {
      document.removeEventListener("mousedown", onOutsidePointerDown);
      document.removeEventListener("touchstart", onOutsidePointerDown);
    };
  }, []);

  return (
    <footer className="relative bg-[#0d0d0f] text-white pt-16 pb-10 mt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.04 }}
            >
              <Link to="/" className="inline-flex items-center" aria-label="ZAYATHON Home">
                <BrandWordmark thonColor="light" className="text-2xl md:text-[30px] font-black tracking-[0.08em] leading-none" />
              </Link>
            </motion.div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Products</h4>
            <ul className="space-y-3 text-white/75">
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/prizes" className="hover:text-white transition-colors">Prize Pool</Link></li>
              <li><Link to="/timeline" className="hover:text-white transition-colors">Timeline</Link></li>
              <li><Link to="/sponsors" className="hover:text-white transition-colors">Sponsors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Hackathon</h4>
            <ul className="space-y-3 text-white/75">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About <BrandWordmark thonColor="light" />
                </Link>
              </li>
              <li><Link to="/problem-statements" className="hover:text-white transition-colors">Problem Statements</Link></li>
              <li><Link to="/team" className="hover:text-white transition-colors">Organizing Team</Link></li>
              <li><Link to="/guidelines" className="hover:text-white transition-colors">Participation Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-3 text-white/75">
              <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/guidelines" className="hover:text-white transition-colors">Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Help & Contact</h4>
            <ul className="space-y-3 text-white/75">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/70" />
                <a href="mailto:zayacodehub@gmail.com" className="hover:text-white transition-colors">zayacodehub@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/70" />
                <span>+91 70333 99183</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white/70 mt-1" />
                <span>SONA College of Technology, Salem, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between text-sm text-white/60">
          <p>© 2026 Zaya Code Hub. All rights reserved.</p>

          <div
            ref={qrWrapperRef}
            className="relative w-fit"
            onMouseEnter={() => setIsQrOpen(true)}
            onMouseLeave={() => setIsQrOpen(false)}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ff8a3d]/40 bg-gradient-to-r from-[#ff8a3d]/18 via-[#ff8a3d]/8 to-white/10 px-2 py-1.5 text-[12px] text-white shadow-[0_4px_20px_rgba(249,115,22,0.22)] hover:shadow-[0_8px_28px_rgba(249,115,22,0.35)] transition-all">
              <button
                type="button"
                onClick={() => setIsQrOpen((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-full p-0.5 ring-1 ring-white/60 hover:ring-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Toggle AJ STUDIOZ QR code"
                aria-expanded={isQrOpen}
              >
                <img src="/favicon.png" alt="AJ STUDIOZ logo" className="h-5 w-5 rounded-sm object-cover" />
              </button>

              <a
                href="https://www.ajstudioz.co.in/"
                target="_blank"
                rel="noreferrer"
                className="text-white/95 pr-1"
                aria-label="Open AJ STUDIOZ official site"
              >
                Revamped With <span className="font-semibold text-[#ffb27f]">AJ STUDIOZ</span>
              </a>
            </div>

            <div
              className={`absolute z-20 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 bottom-full mb-3 transition-all duration-200 ${
                isQrOpen
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="rounded-2xl border border-[#ff8a3d]/35 bg-gradient-to-b from-white to-[#fff3ea] p-2.5 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                <StyledAjQr size={104} className="h-[104px] w-[104px] overflow-hidden rounded-lg" />
                <p className="mt-1.5 text-center text-[10px] font-semibold tracking-wide text-[#9a4b17]">SCAN TO VISIT</p>
              </div>
            </div>
          </div>

          <p>Terms | Privacy policy | Responsible disclosure</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
