import { useEffect } from "react";
import {
  COOKIE_CONSENT_EVENT,
  getCookiePreferences,
  type CookiePreferences,
} from "@/lib/cookieConsent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const GA_SCRIPT_ID = "zayathon-ga-script";
const GA_BOOTSTRAP_ID = "zayathon-ga-bootstrap";
const FB_PIXEL_ID = "zayathon-fb-pixel";

const getGaId = () => String(import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();
const getMetaPixelId = () => String(import.meta.env.VITE_META_PIXEL_ID || "").trim();

const removeConsentScripts = (selector: string) => {
  document.querySelectorAll(selector).forEach((node) => node.remove());
};

const enableAnalytics = () => {
  const gaId = getGaId();
  if (!gaId) return;

  (window as any)[`ga-disable-${gaId}`] = false;

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.dataset.consent = "analytics";
    document.head.appendChild(script);
  }

  if (!document.getElementById(GA_BOOTSTRAP_ID)) {
    const bootstrap = document.createElement("script");
    bootstrap.id = GA_BOOTSTRAP_ID;
    bootstrap.dataset.consent = "analytics";
    bootstrap.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', '${gaId}', { anonymize_ip: true });
    `;
    document.head.appendChild(bootstrap);
  }
};

const disableAnalytics = () => {
  const gaId = getGaId();
  if (gaId) {
    (window as any)[`ga-disable-${gaId}`] = true;
  }
  removeConsentScripts(`#${GA_SCRIPT_ID}, #${GA_BOOTSTRAP_ID}`);
};

const enableMarketing = () => {
  const pixelId = getMetaPixelId();
  if (!pixelId) return;

  if (document.getElementById(FB_PIXEL_ID)) return;

  const script = document.createElement("script");
  script.id = FB_PIXEL_ID;
  script.dataset.consent = "marketing";
  script.text = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
};

const disableMarketing = () => {
  removeConsentScripts(`#${FB_PIXEL_ID}`);
};

const applyConsent = (preferences: CookiePreferences | null) => {
  if (!preferences) {
    disableAnalytics();
    disableMarketing();
    return;
  }

  if (preferences.analytics) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }

  if (preferences.marketing) {
    enableMarketing();
  } else {
    disableMarketing();
  }
};

const ConsentRuntime = () => {
  useEffect(() => {
    applyConsent(getCookiePreferences());

    const listener = () => {
      applyConsent(getCookiePreferences());
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, listener as EventListener);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, listener as EventListener);
    };
  }, []);

  return null;
};

export default ConsentRuntime;
