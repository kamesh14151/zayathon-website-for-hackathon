import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Details", href: "/details" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border transition-all duration-300 ${
        scrolled ? "bg-primary/95 shadow-lg" : "bg-primary"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="font-display text-2xl font-extrabold tracking-tight text-primary-foreground"
          >
            <motion.span whileHover={{ scale: 1.02 }}>ZAYATHON</motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-base font-semibold text-primary-foreground hover:underline underline-offset-8 transition-colors duration-200 px-2"
              >
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.name}
                </motion.span>
              </Link>
            ))}
            <Link to="/register">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-white text-primary font-bold border-2 border-primary shadow-md hover:bg-primary-foreground hover:text-primary transition-colors duration-200 text-base"
                style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06)" }}
              >
                Book A Consultation
              </motion.span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-foreground p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-5 border-t border-border bg-primary"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-3 text-base font-semibold text-primary-foreground hover:underline underline-offset-8 transition-colors px-2"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/register"
              className="block mt-4 text-center px-6 py-3 rounded-full bg-white text-primary font-bold border-2 border-primary shadow-md hover:bg-primary-foreground hover:text-primary transition-colors duration-200 text-base"
              style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06)" }}
              onClick={() => setIsOpen(false)}
            >
              Book A Consultation
            </Link>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
