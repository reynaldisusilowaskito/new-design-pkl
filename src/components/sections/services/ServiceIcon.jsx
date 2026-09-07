function ServiceIcon({ code }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const icons = {
    KR: <><circle cx="9" cy="7" r="3" /><path d="M4 19v-2a5 5 0 0 1 10 0v2M16 5h4v6h-4M17 8h2" /></>,
    NIK: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2.5" /><path d="M6 16c.8-2.2 5.2-2.2 6 0M15 10h3M15 14h3" /></>,
    BLC: <><path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" /><rect x="9" y="7" width="6" height="5" rx="1" /><path d="M10 14h4" /></>,
    EH: <><path d="M12 21C6 17.3 3 14.2 3 9.8A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 9 2.8c0 4.4-3 7.5-9 11.2Z" /><path d="M12 8v6M9 11h6" /></>,
    JH: <><path d="M12 3v18M5 6h14M7 6l-4 7h8L7 6ZM17 6l-4 7h8l-4-7ZM8 21h8" /></>,
    RUP: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2h6v2M8 9h8M8 13h8M8 17h5" /></>,
    LP: <><path d="M4 20h16M7 20V9h10v11M9 9V5h6v4M10 13h4M10 16h4" /></>,
    W: <><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 9h8M8 12h5" /></>,
    UM: <><path d="M4 19V9M9 19V5M14 19v-7M19 19V3M2 21h20" /><path d="m4 7 5-4 5 5 5-6" /></>,
    PI: <><path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" /><path d="M12 11v6M12 7h.01" /></>,
    DS: <><circle cx="12" cy="7" r="3" /><path d="M6 20v-3a6 6 0 0 1 12 0v3M3 12l3 2M21 12l-3 2" /></>,
    PD: <><path d="M4 20V7l8-4 8 4v13M8 10h2M14 10h2M8 14h2M14 14h2M10 20v-3h4v3" /></>,
    SSW: <><path d="M12 3a5 5 0 0 0-5 5c0 4-2 5-2 8a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4c0-3-2-4-2-8a5 5 0 0 0-5-5Z" /><path d="M9 12h6M12 9v6" /></>,
    '1D': <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" /></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>{icons[code] ?? icons.PI}</svg>
}

export default ServiceIcon
