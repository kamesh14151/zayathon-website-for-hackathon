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
    <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-md rounded-3xl border border-[#d9d3c6] bg-[#f4f3ee] p-6 shadow-[0_18px_48px_rgba(31,28,22,0.22)]">
      <h3 className="text-3xl font-semibold tracking-tight text-[#191919] mb-4">Cookie Settings</h3>
      <p className="text-[15px] leading-relaxed text-[#4e555f] mb-5">
        We use cookies to improve your experience, analyze traffic, and personalize content.
        You can accept all cookies, reject non-essential cookies, or customize your preference.
      </p>
      <button
        onClick={() => handleChoice("customized")}
        className="w-full rounded-xl border border-[#cbc2b0] bg-[#f7f5ef] px-4 py-3 text-base font-medium text-[#1f1f1f] transition-colors hover:bg-[#efeadd]"
      >
        Customize cookie settings
      </button>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => handleChoice("rejected")}
          className="rounded-xl border border-[#cbc2b0] bg-[#f7f5ef] px-4 py-3 text-base font-medium text-[#1f1f1f] transition-colors hover:bg-[#efeadd]"
        >
          Reject all cookies
        </button>
        <button
          onClick={() => handleChoice("accepted")}
          className="rounded-xl border border-[#da7f5c] bg-[#e28664] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#d97754]"
        >
          Accept all cookies
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
