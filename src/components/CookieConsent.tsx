import { useEffect, useState } from "react";

type CookieChoice = "accepted" | "rejected" | "customized";

const COOKIE_STORAGE_KEY = "zayathon-cookie-choice";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const savedChoice = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!savedChoice) {
      setIsVisible(true);
    }
  }, []);

  const handleChoice = (choice: CookieChoice) => {
    localStorage.setItem(COOKIE_STORAGE_KEY, choice);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-md rounded-3xl border border-white/10 bg-[#0b0b0d] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      <h3 className="text-3xl font-semibold tracking-tight text-white mb-4">Cookie Settings</h3>
      <p className="text-[15px] leading-relaxed text-white/75 mb-5">
        We use cookies to improve your experience, analyze traffic, and personalize content.
        You can accept all cookies, reject non-essential cookies, or customize your preference.
      </p>
      <button
        onClick={() => handleChoice("customized")}
        className="w-full rounded-xl border border-white/25 bg-transparent px-4 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
      >
        Customize cookie settings
      </button>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => handleChoice("rejected")}
          className="rounded-xl border border-white/25 bg-transparent px-4 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
        >
          Reject all cookies
        </button>
        <button
          onClick={() => handleChoice("accepted")}
          className="rounded-xl border border-[#e28664] bg-[#e28664] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#d97754]"
        >
          Accept all cookies
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
