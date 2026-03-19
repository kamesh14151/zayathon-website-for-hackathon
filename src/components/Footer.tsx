import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-[#0d0d0f] text-white pt-16 pb-10 mt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-1">
            <motion.div
              whileHover={{ scale: 1.04 }}
            >
              <Link to="/" className="inline-flex items-center" aria-label="ZAYATHON Home">
                <span className="text-2xl md:text-[30px] font-black tracking-[0.24em] text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.12)]">
                  ZAYATHON
                </span>
              </Link>
            </motion.div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Products</h4>
            <ul className="space-y-3 text-white/75">
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/payment" className="hover:text-white transition-colors">Payment Portal</Link></li>
              <li><Link to="/prizes" className="hover:text-white transition-colors">Prize Pool</Link></li>
              <li><Link to="/timeline" className="hover:text-white transition-colors">Timeline</Link></li>
              <li><Link to="/sponsors" className="hover:text-white transition-colors">Sponsors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Hackathon</h4>
            <ul className="space-y-3 text-white/75">
              <li><Link to="/about" className="hover:text-white transition-colors">About Zayathon</Link></li>
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

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-sm text-white/60">
          <p>© 2026 Zaya Code Hub. All rights reserved.</p>
          <p>Terms | Privacy policy | Responsible disclosure</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
