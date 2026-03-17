import { motion } from "framer-motion";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border relative bg-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <motion.a
              href="#home"
              className="font-body text-3xl font-semibold text-background inline-block mb-4"
              whileHover={{ scale: 1.05 }}
            >
              ZAYATHON
            </motion.a>
            <p className="text-background/80 mb-4 max-w-md">
              The ultimate hackathon experience for students. Join us to build, innovate,
              and win amazing prizes while solving real-world problems.
            </p>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "Instagram", "Discord"].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="w-10 h-10 rounded-full bg-background/10 border border-background/30 flex items-center justify-center text-background/70 hover:text-background hover:bg-background/20 transition-colors text-sm"
                >
                  {social[0]}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-normal text-background mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["About", "Prizes", "Timeline", "Sponsors", "Team"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      to={`/details#${link.toLowerCase()}`}
                      className="text-background/70 hover:text-background transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                )
              )}
              <li>
                <Link
                  to="/register"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-normal text-background mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="w-4 h-4 text-background/70" />
                <a href="mailto:contact@zayathon.com" className="hover:text-background transition-colors">
                  zayacodehub@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="w-4 h-4 text-background/70" />
                <span>+917033399183</span>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="w-4 h-4 text-background/70 mt-1" />
                <span>SONA COLLEGE OF TECHNOLOGY,<br />SALEM TAMIL NADU, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/70 text-sm">
            © 2026 Zaya Code Hub. All rights reserved.
          </p>
          <p className="text-background/70 text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-background" /> by the Zayathon Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
