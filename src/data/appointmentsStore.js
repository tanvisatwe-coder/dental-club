const KEY = "dentalclub_bookings";

export const loadBookings = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveBooking = (booking) => {
  const existing = loadBookings();
  const next = [
    ...existing,
    { ...booking, id: Date.now(), status: "Requested", createdAt: new Date().toISOString() },
  ];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const updateBookingStatus = (id, status) => {
  const existing = loadBookings();
  const next = existing.map((b) => (b.id === id ? { ...b, status } : b));
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const deleteBooking = (id) => {
  const existing = loadBookings();
  const next = existing.filter((b) => b.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const bookingsStorageKey = KEY;