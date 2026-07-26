import React from "react";

// Minimal, consistent stroke icons (1.5px stroke, 24x24 viewBox).
// Keeping these hand-rolled avoids adding an icon-library dependency.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconTooth = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 3c-2.2 0-3.4 1.1-4.5 1.1-1.7 0-3 1.5-3 3.8 0 2.9 1 5.3 1.7 7.6.5 1.7.9 3.5 2.1 3.5 1.4 0 1.3-3.3 2.7-3.3s1.3 3.3 2.7 3.3c1.2 0 1.6-1.8 2.1-3.5.7-2.3 1.7-4.7 1.7-7.6 0-2.3-1.3-3.8-3-3.8C15.4 4.1 14.2 3 12 3Z" />
  </svg>
);

export const IconHome = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 11.5 12 4l8 7.5" />
    <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
  </svg>
);

export const IconMessage = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 5h16v11H8l-4 4V5Z" />
  </svg>
);

export const IconFile = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M7 3h7l5 5v13H7z" />
    <path d="M14 3v5h5" />
    <path d="M9.5 13h5M9.5 16.5h5" />
  </svg>
);

export const IconChart = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 20V10M12 20V4M20 20v-7" />
  </svg>
);

export const IconLogout = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
    <path d="M14 8l4 4-4 4" />
    <path d="M18 12H9" />
  </svg>
);

export const IconUsers = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="9" cy="8" r="3" />
    <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
    <circle cx="17" cy="8" r="2.4" />
    <path d="M16 14.2c2.9.5 5 2.6 5 5.8" />
  </svg>
);

export const IconCalendar = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);

export const IconAlert = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 3.5 21 19H3L12 3.5Z" />
    <path d="M12 10v4M12 16.7v.1" />
  </svg>
);

export const IconDroplet = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z" />
  </svg>
);

export const IconDownload = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 4v11M8 11l4 4 4-4" />
    <path d="M4.5 18.5v1a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1" />
  </svg>
);

export const IconSave = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 4h11l3 3v13H5z" />
    <path d="M8 4v5h8V4M8 14h8v6H8z" />
  </svg>
);

export const IconSun = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
  </svg>
);

export const IconMoon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
  </svg>
);

export const IconSearch = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.3-4.3" />
  </svg>
);

export const IconBell = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 9a6 6 0 1 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 13.5 6 9Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);