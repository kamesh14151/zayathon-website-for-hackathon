import { useEffect, useMemo, useState } from "react";
import {
  acceptAllCookies,
  buildPreferences,
  getCookiePreferences,
  rejectAllCookies,
  saveCookiePreferences,
} from "@/lib/cookieConsent";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const draftPreferences = useMemo(
    () => buildPreferences(analyticsEnabled, marketingEnabled),
    [analyticsEnabled, marketingEnabled],
  );

  useEffect(() => {
    const savedPreferences = getCookiePreferences();

    if (!savedPreferences) {
      setIsVisible(true);
      return;
    }

    setAnalyticsEnabled(savedPreferences.analytics);
    setMarketingEnabled(savedPreferences.marketing);
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setAnalyticsEnabled(true);
    setMarketingEnabled(true);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setAnalyticsEnabled(false);
    setMarketingEnabled(false);
    setIsVisible(false);
  };

  const handleSaveCustomization = () => {
    saveCookiePreferences(draftPreferences, "customized");
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

      {customizeOpen ? (
        <div className="mb-5 rounded-2xl border border-[#d9d3c6] bg-[#f8f5ee] p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#1f1f1f]">Essential Cookies</p>
              <p className="text-xs text-[#5d6674]">Required for core site functionality. Always on.</p>
            </div>
            <span className="inline-flex h-6 items-center rounded-full bg-[#d6d1c3] px-3 text-xs font-semibold text-[#5c564a]">
              Always active
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 border-t border-[#ddd6c8] pt-3">
            <div>
              <p className="text-sm font-semibold text-[#1f1f1f]">Analytics Cookies</p>
              <p className="text-xs text-[#5d6674]">Helps us understand usage and improve experience.</p>
            </div>
            <button
              type="button"
              onClick={() => setAnalyticsEnabled((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                analyticsEnabled ? "bg-[#e28664]" : "bg-[#cbc2b0]"
              }`}
              aria-pressed={analyticsEnabled}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  analyticsEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-start justify-between gap-4 border-t border-[#ddd6c8] pt-3">
            <div>
              <p className="text-sm font-semibold text-[#1f1f1f]">Marketing Cookies</p>
              <p className="text-xs text-[#5d6674]">Used for campaign measurement and ad relevance.</p>
            </div>
            <button
              type="button"
              onClick={() => setMarketingEnabled((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                marketingEnabled ? "bg-[#e28664]" : "bg-[#cbc2b0]"
              }`}
              aria-pressed={marketingEnabled}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  marketingEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setCustomizeOpen((prev) => !prev)}
        className="w-full rounded-xl border border-[#cbc2b0] bg-[#f7f5ef] px-4 py-3 text-base font-medium text-[#1f1f1f] transition-colors hover:bg-[#efeadd]"
      >
        {customizeOpen ? "Hide customization" : "Customize cookie settings"}
      </button>

      {customizeOpen ? (
        <button
          onClick={handleSaveCustomization}
          className="mt-3 w-full rounded-xl border border-[#da7f5c] bg-[#e28664] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#d97754]"
        >
          Save my preferences
        </button>
      ) : null}

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleRejectAll}
          className="rounded-xl border border-[#cbc2b0] bg-[#f7f5ef] px-4 py-3 text-base font-medium text-[#1f1f1f] transition-colors hover:bg-[#efeadd]"
        >
          Reject all cookies
        </button>
        <button
          onClick={handleAcceptAll}
          className="rounded-xl border border-[#da7f5c] bg-[#e28664] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#d97754]"
        >
          Accept all cookies
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
