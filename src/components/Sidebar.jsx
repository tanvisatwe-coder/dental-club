import React, { useState } from "react";
import {
  FaHome,
  FaComments,
  FaFileMedical,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaTooth,
  FaCog,
  FaQuestionCircle,
  FaExchangeAlt,
  FaTimes,
} from "react-icons/fa";
import { IconSun, IconMoon } from "./icons";

const patientMenu = [
  { name: "overview", label: "Overview", icon: <FaHome /> },
  { name: "messages", label: "Secure Chat", icon: <FaComments /> },
  { name: "report", label: "Reports", icon: <FaFileMedical /> },
];

const dentistMenu = [
  { name: "dashboard", label: "Overview Dashboard", icon: <FaHome /> },
  { name: "patients", label: "Patient Profiles", icon: <FaUser /> },
  { name: "appointments", label: "Appointments", icon: <FaCalendarAlt /> },
  { name: "dentalChart", label: "Charting Center", icon: <FaTooth /> },
  { name: "reports", label: "Reports", icon: <FaFileMedical /> },
  { name: "chats", label: "Secure Chat", icon: <FaComments /> },
];

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
      checked ? "bg-brand-600" : "bg-slate-200 dark:bg-slate-700"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

/**
 * Sidebar
 * Renders as a normal, always-visible column on large screens (lg+).
 * On smaller screens it becomes an off-canvas drawer controlled by
 * `open`/`onClose` — pass a hamburger button (see Topbar) to toggle it.
 */
const Sidebar = ({
  activeTab,
  setActiveTab,
  role = "Patient",
  navigate,
  switchRoute,
  switchLabel,
  open = false,
  onClose = () => {},
  theme = "light",
  toggleTheme = () => {},
}) => {
  const menu = role === "Dentist" ? dentistMenu : patientMenu;
  const [showSettings, setShowSettings] = useState(false);

  const handleNavClick = (name) => {
    setActiveTab(name);
    onClose(); // auto-close the drawer on mobile after picking a tab
  };

  return (
    <>
      {/* Backdrop — mobile only, closes the drawer on tap */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col border-r border-slate-100 bg-white p-5 transition-transform duration-200 ease-out dark:border-slate-800 dark:bg-slate-900 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO + mobile close button */}
        <div className="mb-6 flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
              <FaTooth />
            </div>
            <div>
              <h1 className="text-[15px] font-bold leading-tight text-slate-800 dark:text-slate-100">DentalClub</h1>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {role === "Dentist" ? "Clinical portal" : "Patient portal"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation
        </p>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const active = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  active
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <span className="text-[15px]">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            onClick={() => setShowSettings(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <FaCog className="text-[15px]" /> Settings
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800">
            <FaQuestionCircle className="text-[15px]" /> Help Center
          </button>
          {switchRoute && (
            <button
              onClick={() => navigate(switchRoute)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-slate-800"
            >
              <FaExchangeAlt className="text-[15px]" /> {switchLabel || "Switch Account"}
            </button>
          )}
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <FaSignOutAlt className="text-[15px]" /> Logout
          </button>
        </div>
      </aside>

      {/* Settings panel */}
      {showSettings && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4"
          onKeyDown={(e) => { if (e.key === "Escape") setShowSettings(false); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="settings-title" className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                aria-label="Close"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  {theme === "dark" ? <IconMoon className="h-4 w-4" /> : <IconSun className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Appearance</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {theme === "dark" ? "Dark mode" : "Light mode"}
                  </p>
                </div>
              </div>
              <ToggleSwitch checked={theme === "dark"} onChange={toggleTheme} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;