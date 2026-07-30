// Preference keys that should survive a reset — a "reset demo data" click
// should wipe patients/charts/chat/reports, not the user's theme/density/
// notification choices, which aren't "demo data."
const PRESERVE_KEYS = [
  "dentalclub_theme",
  "dentalclub_density",
  "dentalclub_notifications_enabled",
];

export const resetAllDemoData = () => {
  const keys = Object.keys(localStorage).filter(
    (k) => k.startsWith("dentalclub_") && !PRESERVE_KEYS.includes(k)
  );
  keys.forEach((k) => localStorage.removeItem(k));
};