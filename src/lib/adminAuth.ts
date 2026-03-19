export const ADMIN_EMAIL = "kamesh14151@gmail.com";
export const ADMIN_PASSWORD = "2006";
export const ADMIN_SESSION_KEY = "zayathon-admin-session";

export const isAdminCredentials = (email: string, password: string) => {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
};
