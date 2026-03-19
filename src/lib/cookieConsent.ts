export type ConsentSource = "accepted" | "rejected" | "customized";

export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export const COOKIE_CHOICE_KEY = "zayathon-cookie-choice";
export const COOKIE_PREFS_KEY = "zayathon-cookie-preferences";
export const COOKIE_CONSENT_EVENT = "zayathon-consent-changed";

const isValidPrefs = (value: unknown): value is CookiePreferences => {
  if (!value || typeof value !== "object") return false;
  const prefs = value as CookiePreferences;
  return (
    prefs.essential === true &&
    typeof prefs.analytics === "boolean" &&
    typeof prefs.marketing === "boolean" &&
    typeof prefs.updatedAt === "string"
  );
};

export const buildPreferences = (
  analytics: boolean,
  marketing: boolean,
): CookiePreferences => ({
  essential: true,
  analytics,
  marketing,
  updatedAt: new Date().toISOString(),
});

export const getCookiePreferences = (): CookiePreferences | null => {
  if (typeof window === "undefined") return null;

  const rawPrefs = localStorage.getItem(COOKIE_PREFS_KEY);
  if (rawPrefs) {
    try {
      const parsed = JSON.parse(rawPrefs);
      if (isValidPrefs(parsed)) return parsed;
    } catch {
      // Ignore malformed payload and continue with migration fallback.
    }
  }

  const legacyChoice = localStorage.getItem(COOKIE_CHOICE_KEY);
  if (!legacyChoice) return null;

  if (legacyChoice === "accepted") return buildPreferences(true, true);
  if (legacyChoice === "rejected") return buildPreferences(false, false);
  if (legacyChoice === "customized") return buildPreferences(false, false);

  return null;
};

const toLegacyChoice = (prefs: CookiePreferences): ConsentSource => {
  if (prefs.analytics && prefs.marketing) return "accepted";
  if (!prefs.analytics && !prefs.marketing) return "rejected";
  return "customized";
};

export const saveCookiePreferences = (
  preferences: CookiePreferences,
  source?: ConsentSource,
) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(preferences));
  localStorage.setItem(COOKIE_CHOICE_KEY, source ?? toLegacyChoice(preferences));

  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, {
      detail: preferences,
    }),
  );
};

export const acceptAllCookies = () => {
  saveCookiePreferences(buildPreferences(true, true), "accepted");
};

export const rejectAllCookies = () => {
  saveCookiePreferences(buildPreferences(false, false), "rejected");
};
