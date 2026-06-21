// ============================================================
// Minimal inline icon set — stroke-based, 1.75px, 24x24 grid.
// ============================================================

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconDashboard = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
);
export const IconApps = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
);
export const IconDeveloper = (p) => (
  <svg {...base} {...p}><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 6l-4 12" /></svg>
);
export const IconUsers = (p) => (
  <svg {...base} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" /><circle cx="17.5" cy="8.5" r="2.5" /><path d="M21 20c0-2.5-1.5-4.5-3.8-5.2" /></svg>
);
export const IconFlag = (p) => (
  <svg {...base} {...p}><path d="M5 21V4" /><path d="M5 4h11l-2 3.5L16 11H5" /></svg>
);
export const IconBridge = (p) => (
  <svg {...base} {...p}><path d="M3 16v-3a6 6 0 0112 0v3" /><path d="M3 16h18M7 19v-3M11 19v-5M15 19v-3M19 19v-3" /></svg>
);
export const IconShield = (p) => (
  <svg {...base} {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /></svg>
);
export const IconHistory = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /><path d="M3.5 9a9 9 0 011-2.5" /></svg>
);
export const IconSettings = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 13.5a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V20a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H4a2 2 0 110-4h.2a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.9.3H10a1.7 1.7 0 001-1.6V4a2 2 0 114 0v.2a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.9V10a1.7 1.7 0 001.6 1H20a2 2 0 110 4h-.2a1.7 1.7 0 00-1.6 1z" /></svg>
);
export const IconLogout = (p) => (
  <svg {...base} {...p}><path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3" /><path d="M16 16l4-4-4-4" /><path d="M20 12H9" /></svg>
);
export const IconSearch = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-3.8-3.8" /></svg>
);
export const IconCheck = (p) => (
  <svg {...base} {...p}><path d="M5 13l4 4 10-10" /></svg>
);
export const IconCheckCircle = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M8 12l2.5 2.5L16 9" /></svg>
);
export const IconXCircle = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
);
export const IconX = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const IconChevronLeft = (p) => (
  <svg {...base} {...p}><path d="M15 5l-7 7 7 7" /></svg>
);
export const IconChevronRight = (p) => (
  <svg {...base} {...p}><path d="M9 5l7 7-7 7" /></svg>
);
export const IconChevronDown = (p) => (
  <svg {...base} {...p}><path d="M5 9l7 7 7-7" /></svg>
);
export const IconBan = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M5.5 5.5l13 13" /></svg>
);
export const IconUnlock = (p) => (
  <svg {...base} {...p}><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V7a4 4 0 017.4-2" /></svg>
);
export const IconLock = (p) => (
  <svg {...base} {...p}><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V7a4 4 0 018 0v3.5" /></svg>
);
export const IconTrash = (p) => (
  <svg {...base} {...p}><path d="M4 7h16" /><path d="M9 7V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V7" /><path d="M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" /><path d="M10 11v6M14 11v6" /></svg>
);
export const IconEye = (p) => (
  <svg {...base} {...p}><path d="M2.5 12S5.5 5.5 12 5.5 21.5 12 21.5 12 18.5 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const IconEyeOff = (p) => (
  <svg {...base} {...p}><path d="M3 3l18 18" /><path d="M10.6 5.7A10.6 10.6 0 0112 5.5c6.5 0 9.5 6.5 9.5 6.5a14.6 14.6 0 01-2.1 2.9M6.6 6.6C4.2 8.2 2.5 10.5 2.5 10.5S5.5 17 12 17a9 9 0 003.4-.7" /><path d="M9.9 9.9a3 3 0 004.2 4.2" /></svg>
);
export const IconMail = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5L12 13l8.5-6.5" /></svg>
);
export const IconStar = (p) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 17.3 6.2 20.5l1.1-6.5L2.5 9.4l6.6-.9z" /></svg>
);
export const IconRefresh = (p) => (
  <svg {...base} {...p}><path d="M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3" /><path d="M4 4v4h4M20 20v-4h-4" /></svg>
);
export const IconClock = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const IconArrowUp = (p) => (
  <svg {...base} {...p}><path d="M12 19V5M6 11l6-6 6 6" /></svg>
);
export const IconArrowDown = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M6 13l6 6 6-6" /></svg>
);
export const IconExternal = (p) => (
  <svg {...base} {...p}><path d="M14 4h6v6" /><path d="M20 4L10 14" /><path d="M19 13v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5" /></svg>
);
export const IconAlertTriangle = (p) => (
  <svg {...base} {...p}><path d="M12 4l9.5 16.5h-19z" /><path d="M12 10v4" /><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" /></svg>
);
export const IconGlobe = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.4 2.6 3.8 5.7 3.8 9s-1.4 6.4-3.8 9c-2.4-2.6-3.8-5.7-3.8-9s1.4-6.4 3.8-9z" /></svg>
);
export const IconBuilding = (p) => (
  <svg {...base} {...p}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" /></svg>
);
export const IconUser = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20c0-3.6 3.2-6 7.5-6s7.5 2.4 7.5 6" /></svg>
);
export const IconActivity = (p) => (
  <svg {...base} {...p}><path d="M3 12h4l2-7 4 14 2-7h6" /></svg>
);
export const IconZap = (p) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}><path d="M13 2L4 14h6l-1 8 9-12h-6z" /></svg>
);
export const IconFilter = (p) => (
  <svg {...base} {...p}><path d="M4 5h16M7 12h10M10 19h4" /></svg>
);
export const IconMore = (p) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>
);
export const IconPlus = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconCrown = (p) => (
  <svg {...base} {...p}><path d="M4 18h16l-1.5-9-4 3.5L12 6l-2.5 6.5-4-3.5z" /></svg>
);
export const IconKey = (p) => (
  <svg {...base} {...p}><circle cx="8" cy="15" r="3.5" /><path d="M10.5 12.5L19 4M16 7l2 2M13 10l2 2" /></svg>
);
export const IconTrendUp = (p) => (
  <svg {...base} {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>
);
export const IconPhone = (p) => (
  <svg {...base} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" /><circle cx="17.5" cy="8.5" r="2.5" /><path d="M21 20c0-2.5-1.5-4.5-3.8-5.2" /></svg>
);