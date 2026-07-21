import React from "react";
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
} from "react-icons/fa";

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

const Sidebar = ({ activeTab, setActiveTab, role = "Patient", navigate, switchRoute, switchLabel }) => {
  const menu = role === "Dentist" ? dentistMenu : patientMenu;

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-100 bg-white p-5">
      {/* LOGO */}
      <div className="mb-6 flex items-center gap-2.5 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
          <FaTooth />
        </div>
        <div>
          <h1 className="text-[15px] font-bold leading-tight text-slate-800">DentalClub</h1>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {role === "Dentist" ? "Clinical portal" : "Patient portal"}
          </p>
        </div>
      </div>

      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        Navigation
      </p>

      <nav className="flex-1 space-y-1">
        {menu.map((item) => {
          const active = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <span className="text-[15px]">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-100 pt-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50">
          <FaCog className="text-[15px]" /> Settings
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50">
          <FaQuestionCircle className="text-[15px]" /> Help Center
        </button>
        {switchRoute && (
          <button
            onClick={() => navigate(switchRoute)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
          >
            <FaExchangeAlt className="text-[15px]" /> {switchLabel || "Switch Account"}
          </button>
        )}
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50"
        >
          <FaSignOutAlt className="text-[15px]" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;