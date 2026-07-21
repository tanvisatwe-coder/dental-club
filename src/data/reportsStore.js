const slug = (s) => s.replace(/\s+/g, "_").toLowerCase();

const reportsKeyFor = (patientName) => `dentalclub_reports_${slug(patientName)}`;

export const loadReports = (patientName) => {
  try {
    const raw = localStorage.getItem(reportsKeyFor(patientName));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const sendReport = (patientName, snapshot) => {
  const existing = loadReports(patientName);
  const next = [
    ...existing,
    { ...snapshot, sentAt: new Date().toISOString() },
  ];
  localStorage.setItem(reportsKeyFor(patientName), JSON.stringify(next));
  return next;
};

export const deleteReport = (patientName, index) => {
  const existing = loadReports(patientName);
  const next = existing.filter((_, i) => i !== index);
  localStorage.setItem(reportsKeyFor(patientName), JSON.stringify(next));
  return next;
};

export const deleteAllReports = (patientName) => {
  localStorage.removeItem(reportsKeyFor(patientName));
};

export { reportsKeyFor };