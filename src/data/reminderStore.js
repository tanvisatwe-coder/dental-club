// ============================================================
// Reminders per patient (localStorage) — dentist ➜ patient
// ============================================================
const PREFIX = "dentalclub_reminders_";

export const remindersKeyFor = (patientName) => `${PREFIX}${patientName}`;

export const loadReminders = (patientName) => {
  if (!patientName) return [];
  try {
    return JSON.parse(localStorage.getItem(remindersKeyFor(patientName))) || [];
  } catch {
    return [];
  }
};

export const saveReminders = (patientName, list) => {
  const key = remindersKeyFor(patientName);
  localStorage.setItem(key, JSON.stringify(list));
  // fire a same-tab event too (native "storage" only fires in OTHER tabs)
  window.dispatchEvent(new StorageEvent("storage", { key }));
};

/**
 * Create a reminder for a patient.
 * item: { title, date, time, tooth, procedure, note, sentBy }
 */
export const addReminder = (patientName, item) => {
  const list = loadReminders(patientName);
  const reminder = {
    id: Date.now(),
    title: item.title || "Appointment reminder",
    date: item.date || "",
    time: item.time || "",
    tooth: item.tooth || "",
    procedure: item.procedure || "",
    note: item.note || "",
    sentBy: item.sentBy || "Your dentist",
    sentAt: new Date().toISOString(),
    read: false,
  };
  const next = [...list, reminder];
  saveReminders(patientName, next);
  return reminder;
};

export const deleteReminder = (patientName, id) => {
  saveReminders(patientName, loadReminders(patientName).filter((r) => r.id !== id));
};

export const markRemindersRead = (patientName) => {
  saveReminders(
    patientName,
    loadReminders(patientName).map((r) => ({ ...r, read: true }))
  );
};

export const getUnreadReminderCount = (patientName) =>
  loadReminders(patientName).filter((r) => !r.read).length;

// upcoming first, past at the bottom
export const sortReminders = (list) =>
  [...list].sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
