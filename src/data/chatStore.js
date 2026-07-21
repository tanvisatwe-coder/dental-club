const slug = (s) => s.replace(/\s+/g, "_").toLowerCase();

export const storageKeyFor = (doctorName, patientName) =>
  `dentalclub_chat_${slug(doctorName)}__${slug(patientName)}`;

const lastSeenKeyFor = (doctorName, patientName, role) =>
  `dentalclub_lastseen_${slug(doctorName)}__${slug(patientName)}__${slug(role)}`;

export const loadMessages = (doctorName, patientName) => {
  try {
    const raw = localStorage.getItem(storageKeyFor(doctorName, patientName));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveMessages = (doctorName, patientName, messages) => {
  localStorage.setItem(storageKeyFor(doctorName, patientName), JSON.stringify(messages));
};

const getLastSeenCount = (doctorName, patientName, role) => {
  const raw = localStorage.getItem(lastSeenKeyFor(doctorName, patientName, role));
  return raw ? Number(raw) : 0;
};

// Call this whenever `role` has just looked at this thread (e.g. the chat
// tab is open/visible) so their unread count for it resets to zero.
export const markThreadRead = (doctorName, patientName, role) => {
  const messages = loadMessages(doctorName, patientName);
  localStorage.setItem(lastSeenKeyFor(doctorName, patientName, role), String(messages.length));
};

// How many messages in this thread were sent by the OTHER role, since `role`
// last saw it.
export const getUnreadCount = (doctorName, patientName, role) => {
  const messages = loadMessages(doctorName, patientName);
  const seenCount = getLastSeenCount(doctorName, patientName, role);
  return messages.slice(seenCount).filter((m) => m.sender !== role).length;
};

export const deleteThread = (doctorName, patientName) => {
  localStorage.removeItem(storageKeyFor(doctorName, patientName));
};

// Posts a report snapshot into the chat thread itself as a special message
// type (rendered as a card, not plain text) so "a report was sent" shows up
// as an actual message both sides can see, not just a silent data update.
export const sendReportMessage = (doctorName, patientName, sender, reportSnapshot) => {
  const messages = loadMessages(doctorName, patientName);
  const next = [
    ...messages,
    {
      id: Date.now(),
      sender,
      type: "report",
      report: reportSnapshot,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ];
  saveMessages(doctorName, patientName, next);
  return next;
};