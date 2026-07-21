const PATIENTS_KEY = "dentalclub_patients";

const DEFAULT_PATIENTS = {
  "John Doe": {
    age: 24,
    gender: "Male",
    bloodGroup: "O+",
    phone: "9876543210",
    appointment: "25 June 2025 - 10:00 AM",
    note: "Routine check-up",
    advice: "Avoid cold drinks.",
  },
  "Jane Smith": {
    age: 30,
    gender: "Female",
    bloodGroup: "A+",
    phone: "9876543211",
    appointment: "26 June 2025 - 02:00 PM",
    note: "Crown replacement follow-up",
    advice: "Brush gently.",
  },
  "Alex Mercer": {
    age: 27,
    gender: "Male",
    bloodGroup: "B+",
    phone: "9876543212",
    appointment: "28 June 2025 - 11:30 AM",
    note: "Wisdom tooth extraction",
    advice: "Floss daily.",
  },
};

export const loadPatients = () => {
  try {
    const raw = localStorage.getItem(PATIENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to seeding
  }
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(DEFAULT_PATIENTS));
  return DEFAULT_PATIENTS;
};

export const savePatients = (patients) => {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
};

export const addPatient = (name, profile) => {
  const patients = loadPatients();
  const next = { ...patients, [name]: profile };
  savePatients(next);
  return next;
};

// Merges partial changes into an existing patient's profile (name stays the
// same, since chart/chat history is keyed by name).
export const updatePatient = (name, updatedFields) => {
  const patients = loadPatients();
  const next = { ...patients, [name]: { ...patients[name], ...updatedFields } };
  savePatients(next);
  return next;
};

export const deletePatient = (name) => {
  const patients = loadPatients();
  const next = { ...patients };
  delete next[name];
  savePatients(next);
  return next;
};

export const patientsStorageKey = PATIENTS_KEY;