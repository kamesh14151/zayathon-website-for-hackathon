import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Details", href: "/details" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsCompact(window.scrollY > 280);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        isCompact
          ? "bg-[#f4f3ee] border-[#d6d1c6]"
          : "bg-[#f4f3ee] border-[#e3dfd5]"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`flex items-center justify-between gap-4 transition-all duration-300 ${
            isCompact ? "h-[64px]" : "h-[72px]"
          }`}
        >
          <Link
            to="/"
            className="inline-flex items-center"
            aria-label="ZAYATHON Home"
          >
            <img
              src="/zaya.png"
              alt="ZAYATHON"
              className={`w-auto transition-all duration-300 ${
                isCompact ? "h-8" : "h-10"
              }`}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-[17px] font-medium text-[#1a1a1a] hover:text-[#000000] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/register"
              className="inline-flex items-center rounded-xl bg-[#101113] px-5 py-2.5 text-white text-[15px] font-semibold hover:bg-[#1f2124] transition-colors"
            >
              <span>Register</span>
            </Link>
          </div>

          <button
            className="lg:hidden text-[#1a1a1a] p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden py-4 border-t border-[#e0ddd5] bg-[#f4f3ee]">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2.5 text-base font-medium text-[#1a1a1a] hover:text-black transition-colors px-2"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/register"
              className="mt-3 inline-flex items-center rounded-xl bg-[#101113] px-5 py-2.5 text-white text-sm font-semibold hover:bg-[#1f2124] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
