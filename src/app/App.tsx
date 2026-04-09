import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

// Import images using figma:asset scheme
import lobbyImage from "figma:asset/72a7008bae616aac5d499058a57c7c1f16243bbd.png";
import elevatorImage from "figma:asset/7dffc863be6d024a1de8cb0f0b190c25e448cbfe.png";
import avatar1 from "figma:asset/f07ec88ded6b2d295566b0aeb5ec7c1ec82a1c56.png";
import avatar2 from "figma:asset/20b88955d6e91b0f9cbf6e8b1d6959045013c348.png";
import avatar3 from "figma:asset/df808745d4eeae509bbfb902288411fb819999c2.png";
import avatar4 from "figma:asset/30a03b20d0d79bd9c491d22b6f3398fcaedf2780.png";
import avatar5 from "figma:asset/fd3d4c48a8b689cbbfb343fe22651fcb4dc1c2e0.png";
import avatar6 from "figma:asset/389d48c3df5ee8b67ef377543c9b31f0e430e2a6.png";
import kastleLogo from "figma:asset/f2e2e141522dffa19b4cecaf194c6be0834e5c2f.png";
import homeDashboard from "figma:asset/a934f958bf46f8db5ff4ff3c8365f39e5afcb4a6.png";

// Avatar mapping
const AVATAR_IMAGES: Record<string, string> = {
  "Bradley Alexander": avatar6,
  "Amur Korsgaard": avatar4,
  "Cristofer Gouse": avatar4,
  "Cheyann Rosser": avatar5,
  "Peter Venkman": avatar6,
  "Lisa Tran": avatar2,
  "Omar Farid": avatar4,
};

// Host avatars
const HOST_IMAGES: Record<string, string> = {
  "Sarah Kim": avatar2,
  "Rahul Ramanathan": avatar1,
  "Michelle Park": avatar3,
  "Rafael Bustamante": avatar1,
  "Dana Barrett": avatar3,
  "James Whitfield": avatar6,
};

// Camera feed images
const CAMERA_IMAGES = {
  lobby: lobbyImage,
  elevator: elevatorImage,
};

const VISITORS = [
  { id: 1, name: "Bradley Alexander", host: "Sarah Kim", hostTitle: "VP Operations", type: "Visitor", badge: "1031", signedIn: "9:02 AM", status: "in", company: "Meridian Consulting", email: "b.alexander@meridian.co", phone: "+1 202-555-0147", lang: "English", method: "Signed in on tablet", sightings: ["Lobby", "Elevator B", "Floor 3 Hall", "Conf Room 4A"] },
  { id: 2, name: "Amur Korsgaard", host: "Rahul Ramanathan", hostTitle: "Director of Engineering", type: "Visitor", badge: "1032", signedIn: "9:55 AM", status: "in", company: "Korsgaard Design", email: "amur@korsgaard.dk", phone: "+1 781-555-2056", lang: "English", method: "Signed in on tablet", sightings: ["Main Entrance", "Guest Lobby", "Elevator A", "Floor 2"] },
  { id: 3, name: "Cristofer Gouse", host: "Michelle Park", hostTitle: "Head of Partnerships", type: "Contractor", badge: "1033", signedIn: "10:14 AM", status: "in", company: "Parthenon Electric", email: "cgouse@parthenon.com", phone: "+1 617-555-8834", lang: "English", method: "Pre-registered", sightings: ["Loading Dock", "B1 Corridor"] },
  { id: 4, name: "Cheyann Rosser", host: "Rafael Bustamante", hostTitle: "Facilities Manager", type: "VIP", badge: "1034", signedIn: "8:45 AM", status: "in", company: "Atlas Realty Group", email: "crosser@atlasrealty.com", phone: "+1 703-555-4421", lang: "English", method: "Escort required", sightings: ["Lobby", "Executive Suite", "Board Room"] },
  { id: 5, name: "Peter Venkman", host: "Dana Barrett", hostTitle: "Property Manager", type: "Vendor", badge: "1035", signedIn: "11:13 AM", status: "out", signedOut: "12:45 PM", company: "GhostTech HVAC", email: "pvenkman@ghosttech.com", phone: "+1 212-555-0199", lang: "English", method: "Signed in at front desk", sightings: ["Lobby", "Mechanical Room"] },
  { id: 6, name: "Lisa Tran", host: "James Whitfield", hostTitle: "CTO", type: "Interview", badge: "1036", signedIn: "1:30 PM", status: "in", company: "—", email: "lisa.tran@gmail.com", phone: "+1 415-555-7782", lang: "English", method: "Pre-registered", sightings: ["Lobby", "Floor 4 Reception"] },
  { id: 7, name: "Omar Farid", host: "Sarah Kim", hostTitle: "VP Operations", type: "Visitor", badge: "1037", signedIn: "10:00 AM", status: "out", signedOut: "11:30 AM", company: "Zenith Capital", email: "ofarid@zenithcap.com", phone: "+1 646-555-3310", lang: "Arabic, English", method: "Signed in on tablet", sightings: ["Lobby"] },
];

const CAMERAS = [
  { id: "c1", name: "Guest Lobby (NYS2 - C114)", type: "lobby" },
  { id: "c2", name: "Guest Lobby Elevator - C042", type: "elevator" },
];

const ANALYTICS_DATA = (() => {
  const days = [];
  const types = ["Visitor", "Contractor", "Interview", "VIP", "Vendor"];
  for (let i = 21; i >= 0; i--) {
    const d = new Date(2025, 3, 8 - i);
    const entry: any = { 
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), 
      fullDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), 
      total: 0 
    };
    types.forEach(t => { 
      const v = Math.floor(Math.random() * (t === "Visitor" ? 5 : 3)) + (t === "Visitor" ? 1 : 0); 
      entry[t] = v; 
      entry.total += v; 
    });
    days.push(entry);
  }
  return days;
})();

const TYPE_COLORS: Record<string, string> = { 
  Visitor: "#4A90D9", 
  Contractor: "#2E8B3E", 
  Interview: "#7B61FF", 
  VIP: "#C8102E", 
  Vendor: "#E8A317" 
};

// ── Arrival Trends data ─────────────────────────────────────────────────

const DAILY_ARRIVALS_DATA = (() => {
  const data: Array<{ date: string; monthLabel: string; personnel: number; visitor: number; contractor: number; interview: number; vip: number; vendor: number }> = [];
  const start = new Date(2022, 10, 1);
  const end   = new Date(2023,  8, 30);
  const seenMonths = new Set<string>();
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const mKey = `${d.getFullYear()}-${d.getMonth()}`;
    const isFirst = !seenMonths.has(mKey);
    if (isFirst) seenMonths.add(mKey);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const isJan = d.getFullYear() === 2023 && d.getMonth() === 0;
    const seed = (d.getDate() * 7 + (d.getMonth()+1) * 31 + (d.getFullYear() - 2020) * 13) % 997;
    const rnd  = (seed * 16807 % 2147483647) / 2147483647;
    const rnd2 = ((seed +  41) * 16807 % 2147483647) / 2147483647;
    const rnd3 = ((seed +  83) * 16807 % 2147483647) / 2147483647;
    const rnd4 = ((seed + 127) * 16807 % 2147483647) / 2147483647;
    const rnd5 = ((seed + 173) * 16807 % 2147483647) / 2147483647;
    const rnd6 = ((seed + 211) * 16807 % 2147483647) / 2147483647;
    const base = isJan ? 8000 : 19500;
    data.push({
      date: dateStr,
      monthLabel: isFirst ? d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '',
      personnel:  Math.max(0, Math.round(base + (rnd  - 0.5) * 10000)),
      visitor:    Math.max(0, Math.round(rnd2 * 2800 + 1200)),
      contractor: Math.max(0, Math.round(rnd3 * 1600 +  600)),
      interview:  Math.max(0, Math.round(rnd4 *  800 +  200)),
      vip:        Math.max(0, Math.round(rnd5 *  400 +   80)),
      vendor:     Math.max(0, Math.round(rnd6 * 1000 +  300)),
    });
  }
  return data;
})();

const ARRIVALS_DATE_MAP: Record<string, string> = Object.fromEntries(
  DAILY_ARRIVALS_DATA.filter(d => d.monthLabel).map(d => [d.date, d.monthLabel])
);
const ARRIVALS_MONTH_TICKS = DAILY_ARRIVALS_DATA.filter(d => d.monthLabel).map(d => d.date);

// Weekly aggregated arrivals
const WEEKLY_ARRIVALS_DATA = (() => {
  const map = new Map<string, { date: string; label: string; fullLabel: string; personnel: number; visitor: number; contractor: number; interview: number; vip: number; vendor: number }>();
  for (const d of DAILY_ARRIVALS_DATA) {
    const [y, m, day] = d.date.split('-').map(Number);
    const dt = new Date(y, m - 1, day);
    const dow = dt.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    const mon = new Date(y, m - 1, day + diff);
    const key = `${mon.getFullYear()}-${String(mon.getMonth()+1).padStart(2,'0')}-${String(mon.getDate()).padStart(2,'0')}`;
    if (!map.has(key)) {
      map.set(key, {
        date: key,
        label: mon.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        fullLabel: `Week of ${mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        personnel: 0, visitor: 0, contractor: 0, interview: 0, vip: 0, vendor: 0,
      });
    }
    const w = map.get(key)!;
    w.personnel  += d.personnel;  w.visitor    += d.visitor;
    w.contractor += d.contractor; w.interview  += d.interview;
    w.vip        += d.vip;        w.vendor     += d.vendor;
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
})();
const WEEKLY_MONTH_TICKS = (() => {
  const seen = new Set<string>(); const ticks: string[] = [];
  for (const w of WEEKLY_ARRIVALS_DATA) { const mk = w.date.slice(0, 7); if (!seen.has(mk)) { seen.add(mk); ticks.push(w.date); } }
  return ticks;
})();
const WEEKLY_LABEL_MAP: Record<string, string>      = Object.fromEntries(WEEKLY_ARRIVALS_DATA.map(w => [w.date, w.label]));
const WEEKLY_FULL_LABEL_MAP: Record<string, string> = Object.fromEntries(WEEKLY_ARRIVALS_DATA.map(w => [w.date, w.fullLabel]));

// Monthly aggregated arrivals
const MONTHLY_ARRIVALS_DATA = (() => {
  const map = new Map<string, { date: string; label: string; personnel: number; visitor: number; contractor: number; interview: number; vip: number; vendor: number }>();
  for (const d of DAILY_ARRIVALS_DATA) {
    const [y, m] = d.date.split('-').map(Number);
    const key = `${y}-${String(m).padStart(2,'0')}`;
    if (!map.has(key)) {
      map.set(key, { date: key, label: new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), personnel: 0, visitor: 0, contractor: 0, interview: 0, vip: 0, vendor: 0 });
    }
    const mo = map.get(key)!;
    mo.personnel  += d.personnel;  mo.visitor    += d.visitor;
    mo.contractor += d.contractor; mo.interview  += d.interview;
    mo.vip        += d.vip;        mo.vendor     += d.vendor;
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
})();
const MONTHLY_LABEL_MAP: Record<string, string> = Object.fromEntries(MONTHLY_ARRIVALS_DATA.map(m => [m.date, m.label]));

const DOW_DATA = [
  { day: 'Monday',    pct: 17 },
  { day: 'Tuesday',   pct: 23 },
  { day: 'Wednesday', pct: 24 },
  { day: 'Thursday',  pct: 22 },
  { day: 'Friday',    pct: 14 },
];

const PEAK_HOURS_DATA = [
  { hour: '0',  pct: 1 },  { hour: '1',  pct: 0 },  { hour: '2',  pct: 0 },
  { hour: '3',  pct: 0 },  { hour: '4',  pct: 0 },  { hour: '5',  pct: 0 },
  { hour: '6',  pct: 1 },  { hour: '7',  pct: 5 },  { hour: '8',  pct: 16 },
  { hour: '9',  pct: 28 }, { hour: '10', pct: 16 }, { hour: '11', pct: 6 },
  { hour: '12', pct: 4 },  { hour: '13', pct: 4 },  { hour: '14', pct: 3 },
  { hour: '15', pct: 2 },  { hour: '16', pct: 2 },  { hour: '17', pct: 3 },
  { hour: '18', pct: 2 },  { hour: '19', pct: 2 },  { hour: '20', pct: 1 },
];

// Design system tokens
const DESIGN_TOKENS = {
  colors: {
    brand: [
      { name: "brand-red", hex: "#C8102E", usage: "Primary CTAs, active states, logo" },
      { name: "brand-red-dark", hex: "#9B0A22", usage: "Hover/pressed states" },
      { name: "brand-red-tint", hex: "#FDECEA", usage: "Alert backgrounds, selected rows" },
      { name: "brand-black", hex: "#1A1A1A", usage: "Headlines, body text" },
    ],
    status: [
      { name: "status-unlocked", hex: "#2E8B3E", usage: "Success, 'In' status" },
      { name: "status-unlocked-bg", hex: "#E6F4EB", usage: "Success pill background" },
      { name: "status-locked", hex: "#4A90D9", usage: "Locked state, informational" },
      { name: "status-locked-bg", hex: "#E6EEF8", usage: "Info pill background" },
      { name: "status-link", hex: "#1A7FCC", usage: "Hyperlinks" },
      { name: "status-warning-text", hex: "#7A5200", usage: "Warning text" },
      { name: "status-warning-bg", hex: "#FFF8E1", usage: "Warning background" },
    ],
    neutral: [
      { name: "neutral-white", hex: "#FFFFFF", usage: "Card backgrounds" },
      { name: "neutral-surface", hex: "#F4F4F4", usage: "Page backgrounds" },
      { name: "neutral-divider", hex: "#E0E0E0", usage: "Borders, dividers" },
      { name: "neutral-mid", hex: "#666666", usage: "Secondary text" },
      { name: "neutral-nav", hex: "#212121", usage: "Top nav background" },
      { name: "neutral-subnav", hex: "#2C2C2C", usage: "Context bar" },
    ],
  },
  typography: [
    { name: "Display", size: "28px", weight: 700, sample: "Hero Headlines" },
    { name: "Page Title", size: "18px", weight: 600, sample: "Today's Visitors" },
    { name: "Section Heading", size: "16px", weight: 600, sample: "Sightings", color: "#C8102E" },
    { name: "Body", size: "14px", weight: 400, sample: "Main content text" },
    { name: "Table Body", size: "12px", weight: 400, sample: "Data cell content" },
    { name: "Caption", size: "11px", weight: 400, sample: "Metadata, timestamps", color: "#666666" },
  ],
  spacing: [
    { name: "space-xs", value: "4px" },
    { name: "space-sm", value: "8px" },
    { name: "space-md", value: "16px" },
    { name: "space-lg", value: "24px" },
  ],
  radii: [
    { name: "radius-sm", value: "4px", usage: "Buttons, badges" },
    { name: "radius-md", value: "8px", usage: "Cards, inputs" },
    { name: "radius-lg", value: "12px", usage: "Modals, sheets" },
    { name: "radius-full", value: "999px", usage: "Pills, avatars" },
  ],
};

function Avatar({ name, size = 40, isHost = false }: { name: string, size?: number, isHost?: boolean }) {
  const [imgError, setImgError] = useState(false);
  const imageMap = isHost ? HOST_IMAGES : AVATAR_IMAGES;
  const photoUrl = imageMap[name];
  const initials = name.split(" ").map(n => n[0]).join("");
  const colors = ["#C8102E","#4A90D9","#2E8B3E","#7B61FF","#E8A317","#1A5FA8"];
  const c = colors[name.length % colors.length];
  
  if (photoUrl && !imgError) {
    return (
      <img 
        src={photoUrl} 
        alt={name}
        onError={() => setImgError(true)}
        style={{ 
          width: size, 
          height: size, 
          borderRadius: "50%", 
          objectFit: "cover",
          flexShrink: 0,
          border: "2px solid #fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }} 
      />
    );
  }
  
  return (
    <div style={{ 
      width: size, 
      height: size, 
      borderRadius: "50%", 
      background: c, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      color: "#fff", 
      fontWeight: 600, 
      fontSize: size * 0.38, 
      flexShrink: 0,
      border: "2px solid #fff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    }}>
      {initials}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const isIn = status === "in";
  const [hover, setHover] = useState(false);
  return (
    <span 
      style={{ 
        display: "inline-flex", 
        alignItems: "center", 
        gap: 5, 
        padding: "2px 10px", 
        borderRadius: 999, 
        fontSize: 11, 
        fontWeight: 600, 
        background: isIn ? "#E6F4EB" : "#F5F5F5", 
        color: isIn ? "#1D7A3A" : "#5E5E5E",
        cursor: "default",
        transition: "all 0.15s ease",
        transform: hover ? "scale(1.05)" : "scale(1)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{ 
        width: 6, 
        height: 6, 
        borderRadius: "50%", 
        background: isIn ? "#1D7A3A" : "#5E5E5E",
        boxShadow: isIn && hover ? "0 0 6px #1D7A3A" : "none",
        transition: "box-shadow 0.15s ease",
      }} />
      {isIn ? "In" : "Out"}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const [hover, setHover] = useState(false);
  const c = TYPE_COLORS[type] || "#666";
  return (
    <span 
      style={{ 
        fontSize: 10, 
        fontWeight: 600, 
        padding: "2px 8px", 
        borderRadius: 999, 
        background: hover ? c + "28" : c + "18", 
        color: c, 
        letterSpacing: "0.03em",
        cursor: "default",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {type}
    </span>
  );
}

function Button({ variant = "primary", children, disabled, onClick, style = {} }: any) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [focused, setFocused] = useState(false);
  
  const variants: any = {
    primary: {
      base: { background: "#C8102E", color: "#fff", border: "1px solid #C8102E" },
      hover: { background: "#9B0A22", border: "1px solid #9B0A22" },
    },
    secondary: {
      base: { background: "#fff", color: "#1A1A1A", border: "1px solid #E0E0E0" },
      hover: { background: "#F4F4F4", border: "1px solid #BBBBBB" },
    },
    ghost: {
      base: { background: "transparent", color: "#C8102E", border: "none" },
      hover: { background: "#FDECEA" },
    },
  };
  
  const v = variants[variant];
  const computedStyle = {
    ...v.base,
    borderRadius: 4,
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.15s ease",
    outline: focused && !disabled ? "3px solid #C8102E" : "none",
    outlineOffset: "2px",
    transform: active && !disabled ? "scale(0.98)" : "scale(1)",
    ...(hover && !disabled ? v.hover : {}),
    ...style,
  };
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      style={computedStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </button>
  );
}

function CameraFeed({ cam, index }: { cam: any, index: number }) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgUrl = cam.type === "lobby" ? CAMERA_IMAGES.lobby : CAMERA_IMAGES.elevator;
  
  return (
    <div 
      style={{ 
        flex: 1, 
        minWidth: 280, 
        borderRadius: 8, 
        overflow: "hidden", 
        position: "relative", 
        aspectRatio: "16/10",
        cursor: "pointer",
        transform: hover ? "scale(1.01)" : "scale(1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: hover ? "0 4px 20px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.1)",
        background: "#1a1a2e",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {!imgError ? (
        <img 
          src={imgUrl} 
          alt={cam.name}
          onError={() => setImgError(true)}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            filter: "brightness(0.9) contrast(1.05)",
          }} 
        />
      ) : (
        <div style={{ 
          width: "100%", 
          height: "100%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: "linear-gradient(135deg, #2a2a3a 0%, #1a2a3a 50%, #3a3a4a 100%)",
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </div>
      )}
      
      {/* Live indicator */}
      <div style={{ 
        position: "absolute", 
        top: 10, 
        left: 10, 
        display: "flex", 
        alignItems: "center", 
        gap: 6,
        background: "rgba(0,0,0,0.6)",
        padding: "4px 10px",
        borderRadius: 4,
        backdropFilter: "blur(4px)",
      }}>
        <span style={{ 
          width: 8, 
          height: 8, 
          borderRadius: "50%", 
          background: "#C8102E", 
          boxShadow: "0 0 8px #C8102E",
          animation: "pulse 2s infinite",
        }} />
        <span style={{ color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em" }}>LIVE</span>
      </div>
      
      {/* Timestamp */}
      <div style={{
        position: "absolute",
        top: 10,
        right: 10,
        background: "rgba(0,0,0,0.6)",
        padding: "4px 8px",
        borderRadius: 4,
        backdropFilter: "blur(4px)",
      }}>
        <span style={{ color: "#fff", fontSize: 10, fontFamily: "monospace" }}>
          {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>
      </div>
      
      {/* Camera name overlay */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 12px 10px", background: "linear-gradient(transparent, rgba(0,0,0,0.75))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>{cam.name}</span>
        </div>
      </div>
      
      {/* Hover overlay */}
      {hover && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(200,16,46,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(1px)",
        }}>
          <div style={{
            background: "#C8102E",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>
            View Full Screen
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

function SightingThumb({ label, index }: { label: string, index: number }) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgUrl = index % 2 === 0 ? CAMERA_IMAGES.lobby : CAMERA_IMAGES.elevator;
  
  return (
    <div 
      style={{ width: 110, flexShrink: 0, cursor: "pointer" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ 
        width: 110, 
        height: 80, 
        borderRadius: 6, 
        overflow: "hidden",
        marginBottom: 4,
        transform: hover ? "scale(1.03)" : "scale(1)",
        transition: "all 0.15s ease",
        boxShadow: hover ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
        border: hover ? "2px solid #C8102E" : "2px solid transparent",
      }}>
        {!imgError ? (
          <img 
            src={imgUrl} 
            alt={label}
            onError={() => setImgError(true)}
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              filter: "brightness(0.85) saturate(0.9)",
            }} 
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, hsl(${200 + index * 20},15%,25%), hsl(${200 + index * 20},20%,35%))`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </div>
        )}
      </div>
      <div style={{ 
        fontSize: 10, 
        color: hover ? "#C8102E" : "#666", 
        textAlign: "center", 
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis", 
        fontWeight: hover ? 600 : 400, 
        transition: "all 0.15s ease" 
      }}>
        {label}
      </div>
    </div>
  );
}

function DetailPanel({ visitor, onClose }: { visitor: any, onClose: () => void }) {
  const [closeHover, setCloseHover] = useState(false);
  
  if (!visitor) return null;
  
  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 420, background: "#fff", boxShadow: "-4px 0 24px rgba(0,0,0,0.15)", zIndex: 100, display: "flex", flexDirection: "column", animation: "slideIn 0.25s ease-out" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
      
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #E0E0E0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{visitor.name}</span>
        <button 
          onClick={onClose} 
          style={{ 
            background: closeHover ? "#F4F4F4" : "none", 
            border: "none", 
            cursor: "pointer", 
            padding: 8, 
            borderRadius: 4, 
            color: closeHover ? "#1A1A1A" : "#666", 
            fontSize: 18, 
            lineHeight: 1,
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
          }}
          onMouseEnter={() => setCloseHover(true)}
          onMouseLeave={() => setCloseHover(false)}
        >✕</button>
      </div>
      
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Header card */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid #E0E0E0" }}>
          <Avatar name={visitor.name} size={80} />
          <div style={{ marginTop: 12, fontSize: 11, color: "#666" }}>{visitor.company}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <StatusPill status={visitor.status} />
            <TypeBadge type={visitor.type} />
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <div style={{ background: "#E6F4EB", color: "#1D7A3A", padding: "6px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
              ✓ Signed in {visitor.signedIn}
            </div>
            {visitor.status === "out" ? (
              <div style={{ background: "#F5F5F5", color: "#5E5E5E", padding: "6px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                Signed out {visitor.signedOut}
              </div>
            ) : (
              <Button variant="primary" style={{ padding: "6px 16px" }}>
                Sign out
              </Button>
            )}
          </div>
        </div>
        
        {/* Info */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #E0E0E0" }}>
          {[
            ["Host", `${visitor.host} · ${visitor.hostTitle}`],
            ["Email", visitor.email],
            ["Phone", visitor.phone],
            ["Language", visitor.lang],
            ["Check-in", visitor.method],
          ].map(([label, val]) => (
            <InfoRow key={label} label={label} value={val} />
          ))}
        </div>
        
        {/* Sightings */}
        <div style={{ padding: "16px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#C8102E", marginBottom: 12 }}>Sightings</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
            {visitor.sightings.map((s: string, i: number) => <SightingThumb key={i} label={s} index={i} />)}
          </div>
          <Button variant="ghost" style={{ marginTop: 12, padding: 0 }}>
            View Person of Interest →
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string, value: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div 
      style={{ 
        display: "flex", 
        padding: "8px", 
        fontSize: 12,
        background: hover ? "#FAFAFA" : "transparent",
        margin: "0 -8px",
        borderRadius: 4,
        transition: "background 0.15s ease",
        cursor: "default",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{ width: 80, color: "#666", flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#1A1A1A", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const types = ["Visitor", "Contractor", "Interview", "VIP", "Vendor"];
    
    return (
      <div style={{ 
        background: "#fff", 
        border: "1px solid #E0E0E0", 
        borderRadius: 6, 
        padding: "12px 16px", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)" 
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>
          {data.fullDate}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {types.map(type => (
            data[type] > 0 && (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: TYPE_COLORS[type] }} />
                <span style={{ color: "#666", minWidth: 80 }}>{type}:</span>
                <span style={{ fontWeight: 600, color: "#1A1A1A", marginLeft: "auto" }}>{data[type]}</span>
              </div>
            )
          ))}
          <div style={{ 
            borderTop: "1px solid #E0E0E0", 
            marginTop: 4, 
            paddingTop: 4, 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: 12,
            fontWeight: 600 
          }}>
            <span>Total:</span>
            <span style={{ color: "#C8102E" }}>{data.total}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// ── Home dashboard sub-components ──────────────────────────────────────

function HomeSecondaryNav() {
  const [active, setActive] = useState("Personnel");
  const items = ["Personnel", "Visitors", "Reports", "Kastle Insights", "Facilities", "Notifications", "Incidents", "Store"];
  const hasDropdown = new Set(["Facilities", "Notifications"]);
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #E0E0E0", display: "flex", gap: 0, paddingLeft: 8, overflowX: "auto" }}>
      {items.map(item => {
        const isActive = item === active;
        return (
          <button
            key={item}
            onClick={() => setActive(item)}
            style={{
              background: "none",
              border: "none",
              borderBottom: isActive ? "3px solid #C8102E" : "3px solid transparent",
              padding: "12px 16px",
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#C8102E" : "#333",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            {item}
            {hasDropdown.has(item) && <span style={{ fontSize: 10, color: "#999" }}>▾</span>}
          </button>
        );
      })}
    </div>
  );
}

function HomePanelCard({ title, children, style = {} }: { title: string, children: React.ReactNode, style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #D8D8D8", borderRadius: 4, overflow: "hidden", ...style }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #E8E8E8" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{title}</span>
      </div>
      <div style={{ padding: "14px 16px" }}>{children}</div>
    </div>
  );
}

function HomeRedLink({ children }: { children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#"
      onClick={e => e.preventDefault()}
      style={{ color: hover ? "#9B0A22" : "#C8102E", fontSize: 12, textDecoration: hover ? "underline" : "none", cursor: "pointer", transition: "color 0.12s ease" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </a>
  );
}

function HomeTextInput({ placeholder, style = {} }: { placeholder: string, style?: React.CSSProperties }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      style={{
        width: "100%",
        border: "1px solid #C8C8C8",
        borderRadius: 3,
        padding: "6px 10px",
        fontSize: 12,
        color: "#333",
        outline: "none",
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
}

function HomeSmallBtn({ label, variant = "outline" }: { label: string, variant?: "dark" | "outline" | "red" }) {
  const [hover, setHover] = useState(false);
  const styles: Record<string, React.CSSProperties> = {
    dark: { background: hover ? "#333" : "#1A1A1A", color: "#fff", border: "1px solid #1A1A1A" },
    outline: { background: hover ? "#F4F4F4" : "#fff", color: "#333", border: "1px solid #BBBBBB" },
    red: { background: hover ? "#9B0A22" : "#C8102E", color: "#fff", border: "1px solid #C8102E" },
  };
  return (
    <button
      style={{
        ...styles[variant],
        borderRadius: 3,
        padding: "5px 12px",
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.03em",
        transition: "background 0.12s ease, color 0.12s ease",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </button>
  );
}

function QLinkIcon({ icon, label }: { icon: React.ReactNode, label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", padding: "10px 8px", borderRadius: 6, background: hover ? "#FFF5F5" : "transparent", transition: "background 0.12s ease", minWidth: 72 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ color: hover ? "#9B0A22" : "#C8102E", transition: "color 0.12s ease" }}>{icon}</div>
      <span style={{ fontSize: 11, color: hover ? "#C8102E" : "#333", textAlign: "center", lineHeight: 1.3, fontWeight: 400, transition: "color 0.12s ease", whiteSpace: "pre-line" }}>{label}</span>
    </div>
  );
}

function HomeView() {
  return (
    <div style={{ background: "#F4F4F4", minHeight: "100%" }}>
      {/* Welcome bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E0E0E0", padding: "7px 24px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>
            Welcome, MARQUESE WATSON <span style={{ fontSize: 10, color: "#999" }}>▾</span>
          </div>
          <div style={{ fontSize: 10, color: "#999", marginTop: 1 }}>
            Mon Apr 22 2024 8:34:47 AM (UTC-08:00) Pacific Daylight Savings Time (US &amp; Canada)
          </div>
        </div>
      </div>

      {/* Dashboard panels */}
      <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto", gap: 14 }}>

        {/* ── Quick Personnel Management ── */}
        <HomePanelCard title="Quick Personnel Management">
          <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Assigned and Stock Cards</div>
          <HomeTextInput placeholder="Enter card number, first name, or last name" />
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <HomeSmallBtn label="EDIT" variant="dark" />
            <HomeSmallBtn label="TERMINATE" variant="outline" />
            <HomeSmallBtn label="NEW HIRE" variant="outline" />
          </div>
          <div style={{ marginTop: 14 }}>
            <HomeRedLink>View Help and How-to Guides</HomeRedLink>
          </div>
        </HomePanelCard>

        {/* ── My Reports ── */}
        <HomePanelCard title="My Reports">
          <div style={{ height: 80 }} />
          <HomeRedLink>Go to Reports</HomeRedLink>
        </HomePanelCard>

        {/* ── Who's In? ── */}
        <HomePanelCard title="Who's In?">
          <div style={{ marginBottom: 12, display: "flex", gap: 4, fontSize: 12 }}>
            <HomeRedLink>States Board</HomeRedLink>
            <span style={{ color: "#999" }}>|</span>
            <HomeRedLink>Check In/Out</HomeRedLink>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Legends</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
            {[
              { dot: "filled", color: "#2E8B3E", label: "In" },
              { dot: "outline", color: "#2E8B3E", label: "In + Special Notes" },
              { dot: "filled", color: "#C8102E", label: "Out" },
              { dot: "outline", color: "#C8102E", label: "Out + Special Notes" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {item.dot === "filled" ? (
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0, display: "inline-block" }} />
                ) : (
                  <span style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${item.color}`, flexShrink: 0, display: "inline-block" }} />
                )}
                <span style={{ fontSize: 11, color: "#333" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </HomePanelCard>

        {/* ── Authorize Visitors ── */}
        <HomePanelCard title="Authorize Visitors">
          <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Add Visitor</div>
          <div style={{ display: "flex", gap: 6 }}>
            <HomeTextInput placeholder="Enter last name, first name" style={{ flex: 1 }} />
            <HomeSmallBtn label="GO" variant="red" />
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <HomeRedLink>Add Multiple Visitors</HomeRedLink>
            <span style={{ color: "#999", fontSize: 12 }}>|</span>
            <HomeRedLink>Import Visitors</HomeRedLink>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginTop: 16, marginBottom: 6 }}>Today's Authorizations</div>
          <div style={{ marginBottom: 8 }}>
            <HomeRedLink>Test Kastle</HomeRedLink>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <HomeTextInput placeholder="Search by last or first name" style={{ flex: 1 }} />
            <HomeSmallBtn label="SEARCH" variant="red" />
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <HomeRedLink>Today Visitors</HomeRedLink>
            <span style={{ color: "#999", fontSize: 12 }}>|</span>
            <HomeRedLink>Export Visitors</HomeRedLink>
            <span style={{ color: "#999", fontSize: 12 }}>|</span>
            <HomeRedLink>Visitor Report</HomeRedLink>
          </div>
        </HomePanelCard>

        {/* ── Quick Links ── */}
        <HomePanelCard title="Quick Links" style={{ gridColumn: "2 / 4" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", justifyContent: "start", gap: 4 }}>
            <QLinkIcon label="Floor Plans" icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            } />
            <QLinkIcon label="Alarms" icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            } />
            <QLinkIcon label="Watch List" icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            } />
            <QLinkIcon label="Enroll Card" icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>
            } />
            <QLinkIcon label="Schedules" icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            } />
            <QLinkIcon label="Door Control" icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/><circle cx="12" cy="14" r="1" fill="currentColor"/></svg>
            } />
            <QLinkIcon label="Kastle Video" icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"/><rect x="2" y="6" width="13" height="12" rx="2"/></svg>
            } />
            <QLinkIcon label={"Schedule\nFire Tests"} icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-6-6-8-6-14z"/><path d="M12 12c0 3-2 4-2 6a2 2 0 004 0c0-2-2-3-2-6z"/></svg>
            } />
          </div>
        </HomePanelCard>

      </div>
    </div>
  );
}

function AnalyticsView() {
  const maxTotal = Math.max(...ANALYTICS_DATA.map(d => d.total));
  const types = ["Visitor", "Contractor", "Interview", "VIP", "Vendor"];
  const totals: Record<string, number> = {};
  types.forEach(t => { totals[t] = ANALYTICS_DATA.reduce((s, d) => s + d[t], 0); });
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
  const [hiddenAnalytics, setHiddenAnalytics] = useState<Set<string>>(new Set());
  const toggleAnalytics = (t: string) => setHiddenAnalytics(prev => { const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n; });


  return (
    <div style={{ padding: 20 }}>
      {/* Summary cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Total Visitors", value: grandTotal, sub: "Last 22 days" },
          { label: "Avg / Day", value: (grandTotal / 22).toFixed(1), sub: "Across all types" },
          { label: "Currently In", value: VISITORS.filter(v => v.status === "in").length, sub: "Active visitors" },
          { label: "Unique Hosts", value: [...new Set(VISITORS.map(v => v.host))].length, sub: "Hosting visitors" },
        ].map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>Visitor Traffic</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {types.map(t => {
              const hidden = hiddenAnalytics.has(t);
              return (
                <span
                  key={t}
                  onClick={() => toggleAnalytics(t)}
                  style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: hidden ? "#bbb" : "#666", cursor: "pointer", userSelect: "none", transition: "color 0.15s ease" }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: TYPE_COLORS[t], opacity: hidden ? 0.25 : 1, transition: "opacity 0.15s ease", flexShrink: 0, display: "inline-block" }} />
                  <span style={{ textDecoration: hidden ? "line-through" : "none" }}>{t}</span>
                </span>
              );
            })}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: "#666" }}
              tickLine={false}
              axisLine={{ stroke: "#E0E0E0" }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: "#666" }}
              tickLine={false}
              axisLine={{ stroke: "#E0E0E0" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(200,16,46,0.05)" }} />
            {!hiddenAnalytics.has("Visitor")    && <Bar dataKey="Visitor"    stackId="a" fill={TYPE_COLORS.Visitor}    radius={[0, 0, 0, 0]} isAnimationActive={false} />}
            {!hiddenAnalytics.has("Contractor") && <Bar dataKey="Contractor" stackId="a" fill={TYPE_COLORS.Contractor} radius={[0, 0, 0, 0]} isAnimationActive={false} />}
            {!hiddenAnalytics.has("Interview")  && <Bar dataKey="Interview"  stackId="a" fill={TYPE_COLORS.Interview}  radius={[0, 0, 0, 0]} isAnimationActive={false} />}
            {!hiddenAnalytics.has("VIP")        && <Bar dataKey="VIP"        stackId="a" fill={TYPE_COLORS.VIP}        radius={[0, 0, 0, 0]} isAnimationActive={false} />}
            {!hiddenAnalytics.has("Vendor")     && <Bar dataKey="Vendor"     stackId="a" fill={TYPE_COLORS.Vendor}     radius={[2, 2, 0, 0]} isAnimationActive={false} />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Type breakdown */}
      <div style={{ marginTop: 20, background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 16 }}>Breakdown by Type</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {types.sort((a, b) => totals[b] - totals[a]).map(t => (
            <BreakdownRow key={t} type={t} count={totals[t]} total={grandTotal} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string, value: number | string, sub: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div 
      style={{ 
        flex: "1 1 160px", 
        background: "#fff", 
        borderRadius: 8, 
        padding: 20, 
        border: hover ? "1px solid #C8102E" : "1px solid #E0E0E0",
        transition: "all 0.15s ease",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover ? "0 4px 12px rgba(200,16,46,0.1)" : "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ fontSize: 11, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: hover ? "#C8102E" : "#1A1A1A", marginTop: 4, transition: "color 0.15s ease" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function BreakdownRow({ type, count, total }: { type: string, count: number, total: number }) {
  const [hover, setHover] = useState(false);
  return (
    <div 
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0", cursor: "pointer" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{ width: 80, fontSize: 12, color: hover ? "#C8102E" : "#1A1A1A", fontWeight: 500, transition: "color 0.15s ease" }}>{type}</span>
      <div style={{ flex: 1, height: 20, background: "#F4F4F4", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ 
          width: `${(count / total) * 100}%`, 
          height: "100%", 
          background: TYPE_COLORS[type], 
          borderRadius: 4, 
          opacity: hover ? 1 : 0.8,
          transition: "opacity 0.15s ease",
        }} />
      </div>
      <span style={{ width: 36, textAlign: "right", fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>{count}</span>
    </div>
  );
}

function ArrivalTrendsView() {
  const [subTab, setSubTab] = useState("arrival");
  const [arrivalPeriod, setArrivalPeriod] = useState<"daily"|"weekly"|"monthly">("weekly");
  const [hiddenArrivals, setHiddenArrivals] = useState<Set<string>>(new Set());
  const toggleArrival = (key: string) => setHiddenArrivals(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const periodCfg = {
    daily:   { data: DAILY_ARRIVALS_DATA,   ticks: ARRIVALS_MONTH_TICKS,                            tickFmt: (d: string) => ARRIVALS_DATE_MAP[d] || "",     labelFmt: (d: string) => ARRIVALS_DATE_MAP[d] || d,     yDomain: [0, 40000]  as [number,number], yTicks: [0,10000,20000,30000,40000],       yFmt: (v: number) => v === 0 ? "0K" : `${Math.round(v/1000)}K` },
    weekly:  { data: WEEKLY_ARRIVALS_DATA,  ticks: WEEKLY_MONTH_TICKS,                              tickFmt: (d: string) => WEEKLY_LABEL_MAP[d] || "",      labelFmt: (d: string) => WEEKLY_FULL_LABEL_MAP[d] || d, yDomain: [0, 160000] as [number,number], yTicks: [0,40000,80000,120000,160000],    yFmt: (v: number) => `${Math.round(v/1000)}K` },
    monthly: { data: MONTHLY_ARRIVALS_DATA, ticks: MONTHLY_ARRIVALS_DATA.map(d => d.date),          tickFmt: (d: string) => MONTHLY_LABEL_MAP[d] || "",     labelFmt: (d: string) => MONTHLY_LABEL_MAP[d] || d,     yDomain: [0, 600000] as [number,number], yTicks: [0,150000,300000,450000,600000],  yFmt: (v: number) => `${Math.round(v/1000)}K` },
  }[arrivalPeriod];
  // Zero-out hidden series instead of conditionally rendering <Bar> elements
  // (conditional rendering causes Recharts to generate duplicate internal keys)
  const arrivalsChartData = periodCfg.data.map((d: any) => {
    const r = { ...d };
    for (const k of ["personnel","visitor","contractor","interview","vip","vendor"]) {
      if (hiddenArrivals.has(k)) r[k] = 0;
    }
    return r;
  });
  const arrivalSeries = [
    { label: "Personnel",  key: "personnel",  color: "#4A5568" },
    { label: "Visitor",    key: "visitor",    color: TYPE_COLORS.Visitor },
    { label: "Contractor", key: "contractor", color: TYPE_COLORS.Contractor },
    { label: "Interview",  key: "interview",  color: TYPE_COLORS.Interview },
    { label: "VIP",        key: "vip",        color: TYPE_COLORS.VIP },
    { label: "Vendor",     key: "vendor",     color: TYPE_COLORS.Vendor },
  ];
  const subTabs = [
    { id: "arrival",   label: "Arrival Trends" },
    { id: "activity",  label: "Activity Trends" },
    { id: "bycompany", label: "Activity By Company" },
    { id: "presence",  label: "Presence Usage" },
  ];
  const statCards = [
    { value: "78,009", label: "Personnel At Least Once In Last Year" },
    { value: "76,703", label: "At Least Once In Date Range" },
    { value: "25,234", label: "Daily Max In Date Range" },
    { value: "19,174", label: "Daily Average In Date Range" },
  ];

  return (
    <div style={{ padding: 20, background: "#F4F4F4", minHeight: "calc(100vh - 88px)" }}>

      {/* Sub-tab navigation */}
      

      {subTab !== "arrival" ? (
        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: "48px 20px", textAlign: "center", color: "#999", fontSize: 13 }}>
          This report is not available in this preview.
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
            {statCards.map((s, i) => (
              <StatCard key={i} label={s.label} value={s.value} sub="" />
            ))}
          </div>

          {/* Arrivals chart */}
          <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: 8, padding: 20, marginBottom: 16 }}>
            {/* Header row: title + period toggle + legend */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Arrivals</div>
                {/* Period toggle */}
                <div style={{ display: "flex", background: "#F4F4F4", borderRadius: 6, padding: 2, gap: 1 }}>
                  {(["daily","weekly","monthly"] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setArrivalPeriod(p)}
                      style={{
                        fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 4, border: "none",
                        background: arrivalPeriod === p ? "#fff" : "transparent",
                        color: arrivalPeriod === p ? "#1A1A1A" : "#888",
                        boxShadow: arrivalPeriod === p ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                        cursor: "pointer", transition: "all 0.15s ease", textTransform: "capitalize",
                      }}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {arrivalSeries.map(s => {
                  const hidden = hiddenArrivals.has(s.key);
                  return (
                    <span
                      key={s.key}
                      onClick={() => toggleArrival(s.key)}
                      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: hidden ? "#bbb" : "#666", cursor: "pointer", userSelect: "none", transition: "color 0.15s ease" }}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, opacity: hidden ? 0.25 : 1, transition: "opacity 0.15s ease", flexShrink: 0, display: "inline-block" }} />
                      <span style={{ textDecoration: hidden ? "line-through" : "none" }}>{s.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={arrivalsChartData} margin={{ top: 8, right: 8, left: 10, bottom: 0 }} barCategoryGap="15%">
                <XAxis
                  dataKey="date"
                  ticks={periodCfg.ticks}
                  tickFormatter={periodCfg.tickFmt}
                  tick={{ fontSize: 10, fill: "#666" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E0E0E0" }}
                />
                <YAxis
                  tickFormatter={periodCfg.yFmt}
                  tick={{ fontSize: 10, fill: "#666" }}
                  tickLine={false}
                  axisLine={false}
                  domain={periodCfg.yDomain}
                  ticks={periodCfg.yTicks}
                />
                <Tooltip
                  cursor={{ fill: "rgba(200,16,46,0.04)" }}
                  formatter={(val: any, name: string) => [Number(val).toLocaleString(), name.charAt(0).toUpperCase() + name.slice(1)]}
                  contentStyle={{ fontSize: 11, border: "1px solid #E0E0E0", borderRadius: 6 }}
                  labelFormatter={periodCfg.labelFmt}
                />
                <Bar dataKey="personnel"  stackId="a" fill="#4A5568"               isAnimationActive={false} />
                <Bar dataKey="visitor"    stackId="a" fill={TYPE_COLORS.Visitor}    isAnimationActive={false} />
                <Bar dataKey="contractor" stackId="a" fill={TYPE_COLORS.Contractor} isAnimationActive={false} />
                <Bar dataKey="interview"  stackId="a" fill={TYPE_COLORS.Interview}  isAnimationActive={false} />
                <Bar dataKey="vip"        stackId="a" fill={TYPE_COLORS.VIP}        isAnimationActive={false} />
                <Bar dataKey="vendor"     stackId="a" fill={TYPE_COLORS.Vendor}     isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom row — Days of Week + Peak Arrival Times */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Days of Week */}
            <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: 8, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 12 }}>Days Of Week</div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={DOW_DATA} margin={{ top: 22, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#666" }} tickLine={false} axisLine={{ stroke: "#E0E0E0" }} />
                  <YAxis hide domain={[0, 30]} />
                  <Tooltip
                    cursor={{ fill: "rgba(200,16,46,0.04)" }}
                    formatter={(v: any) => [`${v}%`, "Share"]}
                    contentStyle={{ fontSize: 11, border: "1px solid #E0E0E0", borderRadius: 6 }}
                  />
                  <Bar dataKey="pct" fill="#9B0A22" isAnimationActive={false} radius={[2, 2, 0, 0]} label={{ position: "top", formatter: (v: any) => `${v}%`, fontSize: 11, fill: "#1A1A1A", fontWeight: 600 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Peak Arrival Times */}
            <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: 8, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 12 }}>Peak Arrival Times</div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={PEAK_HOURS_DATA} margin={{ top: 22, right: 10, left: -20, bottom: 18 }}>
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 9, fill: "#666" }}
                    tickLine={false}
                    axisLine={{ stroke: "#E0E0E0" }}
                    label={{ value: "Hour", position: "insideBottom", offset: -10, fontSize: 10, fill: "#999" }}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 9, fill: "#666" }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 30]}
                    ticks={[0, 10, 20, 30]}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(200,16,46,0.04)" }}
                    formatter={(v: any) => [`${v}%`, "Share"]}
                    contentStyle={{ fontSize: 11, border: "1px solid #E0E0E0", borderRadius: 6 }}
                    labelFormatter={(h) => `Hour ${h}`}
                  />
                  <Bar dataKey="pct" fill="#9B0A22" isAnimationActive={false} radius={[2, 2, 0, 0]} label={{ position: "top", formatter: (v: any) => `${v}%`, fontSize: 8, fill: "#1A1A1A", fontWeight: 600 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

function StylesView() {
  const [activeSection, setActiveSection] = useState("colors");
  
  return (
    <div style={{ padding: 20, maxWidth: 1000 }}>
      {/* Section tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { id: "colors", label: "Colors" },
          { id: "typography", label: "Typography" },
          { id: "spacing", label: "Spacing & Radii" },
          { id: "components", label: "Components" },
        ].map(s => (
          <Button 
            key={s.id}
            variant={activeSection === s.id ? "primary" : "secondary"}
            onClick={() => setActiveSection(s.id)}
          >
            {s.label}
          </Button>
        ))}
      </div>

      {activeSection === "colors" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Brand Colors</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {DESIGN_TOKENS.colors.brand.map(c => <ColorSwatch key={c.name} {...c} />)}
            </div>
          </div>
          
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Status / Semantic</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {DESIGN_TOKENS.colors.status.map(c => <ColorSwatch key={c.name} {...c} />)}
            </div>
          </div>
          
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Neutrals</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {DESIGN_TOKENS.colors.neutral.map(c => <ColorSwatch key={c.name} {...c} />)}
            </div>
          </div>
        </div>
      )}

      {activeSection === "typography" && (
        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Typography Scale</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {DESIGN_TOKENS.typography.map(t => (
              <div key={t.name} style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "12px 0", borderBottom: "1px solid #F0F0F0" }}>
                <div style={{ width: 140 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>{t.size} / {t.weight}</div>
                </div>
                <div style={{ flex: 1, fontSize: t.size, fontWeight: t.weight, color: t.color || "#1A1A1A" }}>
                  {t.sample}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 16, background: "#F4F4F4", borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", marginBottom: 8 }}>Font Stack</div>
            <code style={{ fontSize: 11, color: "#666", fontFamily: "monospace" }}>
              -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
            </code>
          </div>
        </div>
      )}

      {activeSection === "spacing" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Spacing Scale</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DESIGN_TOKENS.spacing.map(s => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 100, fontSize: 12, fontWeight: 500, color: "#1A1A1A" }}>{s.name}</div>
                  <div style={{ width: s.value, height: 24, background: "#C8102E", borderRadius: 2, opacity: 0.8 }} />
                  <div style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Border Radii</h3>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {DESIGN_TOKENS.radii.map(r => (
                <div key={r.name} style={{ textAlign: "center" }}>
                  <div style={{ 
                    width: 64, 
                    height: 64, 
                    background: "#FDECEA", 
                    border: "2px solid #C8102E", 
                    borderRadius: r.value,
                    marginBottom: 8,
                  }} />
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#1A1A1A" }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: "#666" }}>{r.value}</div>
                  <div style={{ fontSize: 9, color: "#999", marginTop: 2 }}>{r.usage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === "components" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Buttons */}
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Buttons</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: "#F4F4F4", borderRadius: 4 }}>
              <div style={{ fontSize: 11, color: "#666" }}>
                <strong>Interactive states:</strong> Hover darkens background, Active scales to 98%, Focus shows 3px red outline with 2px offset
              </div>
            </div>
          </div>

          {/* Status Pills */}
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Status Pills</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <StatusPill status="in" />
              <StatusPill status="out" />
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, color: "#666" }}>Always include dot + text label — never color alone (WCAG AA)</div>
            </div>
          </div>

          {/* Type Badges */}
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Type Badges</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.keys(TYPE_COLORS).map(t => <TypeBadge key={t} type={t} />)}
            </div>
          </div>

          {/* Avatars */}
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Avatars</h3>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <Avatar name="Bradley Alexander" size={32} />
              <Avatar name="Lisa Tran" size={40} />
              <Avatar name="Cheyann Rosser" size={56} />
              <Avatar name="Omar Farid" size={72} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorSwatch({ name, hex, usage }: { name: string, hex: string, usage: string }) {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const isLight = hex === "#FFFFFF" || hex === "#F4F4F4" || hex.toLowerCase().includes("fff") || hex.toLowerCase().includes("f4f") || hex.toLowerCase().includes("fde") || hex.toLowerCase().includes("e6f") || hex.toLowerCase().includes("e6e");
  
  const copyHex = () => {
    navigator.clipboard?.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <div 
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 12, 
        padding: 8, 
        borderRadius: 6,
        background: hover ? "#F4F4F4" : "transparent",
        cursor: "pointer",
        transition: "background 0.15s ease",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={copyHex}
    >
      <div style={{ 
        width: 40, 
        height: 40, 
        borderRadius: 6, 
        background: hex, 
        border: isLight ? "1px solid #E0E0E0" : "none",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>{name}</div>
        <div style={{ fontSize: 11, color: copied ? "#2E8B3E" : "#666", fontFamily: "monospace", fontWeight: copied ? 600 : 400 }}>{copied ? "Copied!" : hex}</div>
        <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{usage}</div>
      </div>
    </div>
  );
}

function SearchInput({ placeholder, value, onChange }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ 
        width: "100%",
        maxWidth: 400,
        height: 32, 
        border: focused ? "1px solid #C8102E" : "1px solid #E0E0E0", 
        borderRadius: 4, 
        padding: "0 10px", 
        fontSize: 13,
        outline: "none",
        boxShadow: focused ? "0 0 0 2px rgba(200,16,46,0.2)" : "none",
        transition: "all 0.15s ease",
        boxSizing: "border-box",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function NavLink({ label }: { label: string }) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  
  return (
    <button
      style={{ 
        background: hover ? "#F4F4F4" : "transparent",
        border: "none",
        color: hover ? "#C8102E" : "#666",
        fontSize: 12,
        padding: "8px 14px",
        borderRadius: 4,
        cursor: "pointer",
        outline: focused ? "2px solid #C8102E" : "none",
        outlineOffset: "2px",
        transition: "all 0.15s ease",
        fontWeight: 500,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {label}
    </button>
  );
}

function TabButton({ active, onClick, children }: any) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  
  return (
    <button 
      onClick={onClick} 
      style={{
        background: hover && !active ? "#F4F4F4" : "none", 
        border: "none", 
        borderBottom: active ? "3px solid #C8102E" : "3px solid transparent",
        color: active ? "#C8102E" : (hover ? "#1A1A1A" : "#666"), 
        fontSize: 12, 
        fontWeight: active ? 600 : 500, 
        cursor: "pointer", 
        padding: "0 4px",
        outline: focused ? "3px solid #C8102E" : "none",
        outlineOffset: "-2px",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </button>
  );
}

function TableRow({ visitor, selected, onClick }: any) {
  const [hover, setHover] = useState(false);
  const v = visitor;
  
  return (
    <tr 
      onClick={onClick} 
      style={{ 
        cursor: "pointer", 
        background: selected ? "#FDECEA" : (hover ? "#FAFAFA" : "#fff"), 
        transition: "background 0.15s ease" 
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <td style={{ padding: "10px 12px", borderBottom: "1px solid #F0F0F0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={v.name} size={32} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: hover || selected ? "#C8102E" : "#1A1A1A", transition: "color 0.15s ease" }}>{v.name}</div>
            <div style={{ fontSize: 11, color: "#666" }}>Host: {v.host}</div>
          </div>
        </div>
      </td>
      <td style={{ padding: "10px 12px", borderBottom: "1px solid #F0F0F0", fontSize: 12, color: "#666" }}>{v.company}</td>
      <td style={{ padding: "10px 12px", borderBottom: "1px solid #F0F0F0" }}><TypeBadge type={v.type} /></td>
      <td style={{ padding: "10px 12px", borderBottom: "1px solid #F0F0F0", fontSize: 12, color: "#1A1A1A" }}>{v.host}</td>
      <td style={{ padding: "10px 12px", borderBottom: "1px solid #F0F0F0", fontSize: 12, color: "#666", fontFamily: "monospace" }}>{v.badge}</td>
      <td style={{ padding: "10px 12px", borderBottom: "1px solid #F0F0F0", fontSize: 12, color: "#666" }}>{v.signedIn}</td>
      <td style={{ padding: "10px 12px", borderBottom: "1px solid #F0F0F0" }}><StatusPill status={v.status} /></td>
      <td style={{ padding: "10px 12px", borderBottom: "1px solid #F0F0F0" }}>
        {v.status === "in" ? (
          <Button variant="primary" style={{ padding: "4px 12px", fontSize: 11 }} onClick={(e: any) => e.stopPropagation()}>Sign out</Button>
        ) : (
          <span style={{ fontSize: 11, color: "#666" }}>{v.signedOut}</span>
        )}
      </td>
    </tr>
  );
}

export default function App() {
  const [tab, setTab] = useState("styles");
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");

  const filtered = VISITORS.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.host.toLowerCase().includes(search.toLowerCase()) ||
    v.company.toLowerCase().includes(search.toLowerCase())
  );

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" });

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#F4F4F4", minHeight: "100vh", color: "#1A1A1A" }}>
      {/* Global nav */}
      <div style={{ background: "#fff", height: 48, display: "flex", alignItems: "center", padding: "0 20px", justifyContent: "space-between", borderBottom: "1px solid #E0E0E0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <img src={kastleLogo} alt="myKastle" style={{ height: 28 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Home","My Account","Help","Contact Us"].map(l => (
            <NavLink key={l} label={l} />
          ))}
          <button 
            style={{ 
              background: "none", 
              border: "1px solid #E0E0E0", 
              color: "#C8102E", 
              fontSize: 12, 
              cursor: "pointer",
              padding: "8px 14px",
              borderRadius: 4,
              transition: "all 0.15s ease",
              fontWeight: 500,
            }}
            onMouseEnter={(e: any) => {
              e.target.style.background = "#FDECEA";
              e.target.style.borderColor = "#C8102E";
            }}
            onMouseLeave={(e: any) => {
              e.target.style.background = "none";
              e.target.style.borderColor = "#E0E0E0";
            }}
          >Log out</button>
        </div>
      </div>

      {/* Context bar */}
      

      {/* Tab bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E0E0E0", height: 40, display: "flex", alignItems: "stretch", padding: "0 16px", gap: 24 }}>
        {[
          { id: "styles", label: "Styles" },
          { id: "visitors", label: "Visitors" },
          { id: "analytics", label: "Analytics" },
          { id: "arrival-trends", label: "Arrival Trends" },
          { id: "home", label: "Personnel" },
        ].map(t => (
          <TabButton key={t.id} active={tab === t.id} onClick={() => { setTab(t.id); setSelected(null); }}>
            {t.label}
          </TabButton>
        ))}
      </div>

      {tab === "home" && <HomeView />}
      {tab === "visitors" && (
        <div style={{ position: "relative" }}>
          {/* Camera feeds */}
          <div style={{ padding: "16px 20px 0", display: "flex", gap: 12 }}>
            {CAMERAS.map((cam, i) => <CameraFeed key={cam.id} cam={cam} index={i} />)}
          </div>

          {/* Search + page header */}
          <div style={{ padding: "16px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Today's Visitors</h1>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="primary">+ Add Visitor</Button>
              <Button variant="secondary">Import</Button>
            </div>
          </div>
          <div style={{ padding: "0 20px 12px" }}>
            <SearchInput
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              placeholder="Search by name, host, or company…"
            />
          </div>

          {/* Table */}
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F7F7F7" }}>
                    {["Visitor","Company","Type","Host","Badge","Signed In","Status",""].map((h, i) => (
                      <th key={i} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#666", borderBottom: "1px solid #E0E0E0", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(v => (
                    <TableRow key={v.id} visitor={v} selected={selected?.id === v.id} onClick={() => setSelected(v)} />
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "10px 16px", borderTop: "1px solid #E0E0E0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#666" }}>Showing {filtered.length} of {VISITORS.length} visitors</span>
              </div>
            </div>
          </div>

          {/* Detail panel overlay */}
          {selected && <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 99 }} />}
          <DetailPanel visitor={selected} onClose={() => setSelected(null)} />
        </div>
      )}

      {tab === "analytics" && <AnalyticsView />}
      {tab === "arrival-trends" && <ArrivalTrendsView />}
      {tab === "styles" && <StylesView />}
    </div>
  );
}