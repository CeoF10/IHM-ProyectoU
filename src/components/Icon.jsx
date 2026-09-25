const paths = {
  accessibility: <><circle cx="12" cy="4" r="2"/><path d="M4 8h16M12 6v14M12 13l-5 7M12 13l5 7"/></>,
  settings: <><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2"/><circle cx="15" cy="17" r="2"/></>,
  text: <><path d="m4 19 5-14 5 14M6 14h6M16 8h5M18.5 8v11"/></>,
  contrast: <><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z"/></>,
  target: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m10 9 5 3-5 3z"/></>,
  volume: <><path d="M4 9v6h4l5 4V5L8 9H4ZM17 9a5 5 0 0 1 0 6M19 6a9 9 0 0 1 0 12"/></>,
  play: <path d="m8 5 11 7-11 7z"/>,
  pause: <><path d="M7 5v14M17 5v14"/></>,
  stop: <rect x="6" y="6" width="12" height="12" rx="1"/>,
  reset: <><path d="M4 11a8 8 0 1 1 2 6M4 5v6h6"/></>,
  close: <path d="M5 5l14 14M19 5 5 19"/>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  check: <path d="m4 12 5 5L20 6"/>,
};

export default function Icon({ name, className = "" }) {
  return <svg className={`ui-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}
