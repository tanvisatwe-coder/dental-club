const KEY = "dentalclub_inquiries";

export const loadInquiries = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveInquiry = (inquiry) => {
  const existing = loadInquiries();
  const next = [...existing, { ...inquiry, submittedAt: new Date().toISOString() }];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};