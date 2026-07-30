import { toast } from "react-toastify";

const KEY = "dentalclub_notifications_enabled";

export const areNotificationsEnabled = () => {
  const raw = localStorage.getItem(KEY);
  return raw === null ? true : raw === "true";
};

export const setNotificationsEnabled = (enabled) => {
  localStorage.setItem(KEY, String(enabled));
};

export const notify = {
  success: (msg, opts) => {
    if (areNotificationsEnabled()) toast.success(msg, opts);
  },
  error: (msg, opts) => {
    if (areNotificationsEnabled()) toast.error(msg, opts);
  },
  info: (msg, opts) => {
    if (areNotificationsEnabled()) toast.info(msg, opts);
  },
};