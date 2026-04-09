import { useState, useEffect } from "react";

// Avatar images - using uploaded files
// In production, these would be served from your asset server
// For this demo, we'll use data URIs or fallback to initials
const AVATAR_IMAGES = {
  "Bradley Alexander": "/uploads/uifaces-popular-avatar__2_.jpg",
  "Amur Korsgaard": "/uploads/uifaces-popular-avatar__4_.jpg",
  "Cristofer Gouse": "/uploads/uifaces-popular-avatar__6_.jpg",
  "Cheyann Rosser": "/uploads/uifaces-popular-avatar__3_.jpg",
  "Peter Venkman": "/uploads/uifaces-popular-avatar__8_.jpg",
  "Lisa Tran": "/uploads/uifaces-popular-avatar__10_.jpg",
  "Omar Farid": "/uploads/uifaces-popular-avatar__11_.jpg",
};

// Host avatars
const HOST_IMAGES = {
  "Sarah Kim": "/uploads/uifaces-popular-avatar__1_.jpg",
  "Rahul Ramanathan": "/uploads/uifaces-popular-avatar.jpg",
  "Michelle Park": "/uploads/uifaces-popular-avatar__7_.jpg",
  "Rafael Bustamante": "/uploads/uifaces-popular-avatar__9_.jpg",
  "Dana Barrett": "/uploads/uifaces-popular-avatar__5_.jpg",
  "James Whitfield": "/uploads/uifaces-popular-avatar__8_.jpg",
};

// Camera feed images
const CAMERA_IMAGES = {
  lobby: "/uploads/lobby.jpg",
  elevator: "/uploads/elevator.jpg",
};

const VISITORS = [
  { id: 1, name: "Bradley Alexander", host: "Sarah Kim", hostTitle: "VP Operations", type: "Visitor", badge: "1031", signedIn: "9:02 AM", status: "in", company: "Meridian Consulting", email: "b.alexander@meridian.co", phone: "+1 202-555-0147", lang: "English", method: "Signed in on tablet", sightings: ["Lobby", "Elevator B", "Floor 3 Hall", "Conf Room 4A"] },
  { id: 2, name: "Amur Korsgaard", host: "Rahul Ramanathan", hostTitle: "Director of Engineering", type: "Guest", badge: "1032", signedIn: "9:55 AM", status: "in", company: "Korsgaard Design", email: "amur@korsgaard.dk", phone: "+1 781-555-2056", lang: "English", method: "Signed in on tablet", sightings: ["Main Entrance", "Guest Lobby", "Elevator A", "Floor 2"] },
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
  const types = ["Visitor", "Contractor", "Interview", "VIP", "Vendor", "Guest"];
  for (let i = 21; i >= 0; i--) {
    const d = new Date(2025, 3, 8 - i);
    const entry = { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), total: 0 };
    types.forEach(t => { const v = Math.floor(Math.random() * (t === "Visitor" ? 5 : 3)) + (t === "Visitor" ? 1 : 0); entry[t] = v; entry.total += v; });
    days.push(entry);
  }
  return days;
})();

const TYPE_COLORS = { Visitor: "#4A90D9", Contractor: "#2E8B3E", Interview: "#7B61FF", VIP: "#C8102E", Vendor: "#E8A317", Guest: "#66BBCC" };

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

function Avatar({ name, size = 40, isHost = false }) {
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

function StatusPill({ status }) {
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

function TypeBadge({ type }) {
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

// Interactive button with Kastle brand states
function Button({ variant = "primary", children, disabled, onClick, style = {} }) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [focused, setFocused] = useState(false);
  
  const variants = {
    primary: {
      base: { background: "#C8102E", color: "#fff", border: "1px solid #C8102E" },
      hover: { background: "#9B0A22", borderColor: "#9B0A22" },
    },
    secondary: {
      base: { background: "#fff", color: "#1A1A1A", border: "1px solid #E0E0E0" },
      hover: { background: "#F4F4F4", borderColor: "#BBBBBB" },
    },
    ghost: {
      base: { background: "transparent", color: "#C8102E", border: "none" },
      hover: { background: "#FDECEA" },
    },
    destructive: {
      base: { background: "transparent", color: "#A32D2D", border: "none" },
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

function CameraFeed({ cam, index }) {
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

function SightingThumb({ label, index }) {
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

function DetailPanel({ visitor, onClose }) {
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
            {visitor.sightings.map((s, i) => <SightingThumb key={i} label={s} index={i} />)}
          </div>
          <Button variant="ghost" style={{ marginTop: 12, padding: 0 }}>
            View Person of Interest →
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  const [hover, setHover] = useState(false);
  return (
    <div 
      style={{ 
        display: "flex", 
        padding: "8px 0", 
        fontSize: 12,
        background: hover ? "#FAFAFA" : "transparent",
        margin: "0 -8px",
        padding: "8px",
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

function AnalyticsView() {
  const maxTotal = Math.max(...ANALYTICS_DATA.map(d => d.total));
  const types = ["Visitor", "Contractor", "Interview", "VIP", "Vendor", "Guest"];
  const totals = {};
  types.forEach(t => { totals[t] = ANALYTICS_DATA.reduce((s, d) => s + d[t], 0); });
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
  const [hoveredBar, setHoveredBar] = useState(null);

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
            {types.map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#666" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: TYPE_COLORS[t] }} />{t}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 200 }}>
          {ANALYTICS_DATA.map((d, i) => (
            <div 
              key={i} 
              style={{ flex: 1, display: "flex", flexDirection: "column-reverse", height: "100%", cursor: "pointer" }}
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div style={{ fontSize: 8, color: "#999", textAlign: "center", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden" }}>{i % 3 === 0 ? d.date : ""}</div>
              <div style={{ 
                flex: 1, 
                display: "flex", 
                flexDirection: "column-reverse", 
                gap: 1,
                transform: hoveredBar === i ? "scaleY(1.02)" : "scaleY(1)",
                transformOrigin: "bottom",
                transition: "transform 0.15s ease",
              }}>
                {types.map(t => (
                  d[t] > 0 ? <div key={t} style={{ height: `${(d[t] / maxTotal) * 100}%`, background: TYPE_COLORS[t], borderRadius: 2, minHeight: d[t] > 0 ? 3 : 0, opacity: hoveredBar === i ? 1 : 0.85, transition: "opacity 0.15s ease" }} /> : null
                ))}
              </div>
            </div>
          ))}
        </div>
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

function StatCard({ label, value, sub }) {
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

function BreakdownRow({ type, count, total }) {
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
              <Button variant="destructive">Destructive</Button>
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

          {/* Focus States */}
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #E0E0E0", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Focus States (Tab to test)</h3>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <Button variant="primary">Tab to me</Button>
              <SearchInput placeholder="Focus me too" />
            </div>
            <div style={{ marginTop: 16, padding: 12, background: "#F4F4F4", borderRadius: 4 }}>
              <div style={{ fontSize: 11, color: "#666" }}>
                <strong>Light bg:</strong> outline: 3px solid #C8102E; outline-offset: 2px<br/>
                <strong>Dark bg:</strong> outline: 2px solid #FFFFFF; outline-offset: -2px
              </div>
            </div>
          </div>

          {/* Dark Nav Example */}
          <div style={{ background: "#212121", borderRadius: 8, padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#C8102E", marginTop: 0, marginBottom: 16 }}>Dark Navigation</h3>
            <div style={{ display: "flex", gap: 16 }}>
              {["Home", "Reports", "Settings"].map(item => (
                <NavLink key={item} label={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchInput({ placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ 
        height: 32, 
        border: focused ? "1px solid #C8102E" : "1px solid #E0E0E0", 
        borderRadius: 4, 
        padding: "0 10px", 
        fontSize: 13,
        outline: "none",
        boxShadow: focused ? "0 0 0 2px rgba(200,16,46,0.2)" : "none",
        transition: "all 0.15s ease",
        width: 200,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function ColorSwatch({ name, hex, usage }) {
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

function NavLink({ label }) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  
  return (
    <button
      style={{ 
        background: hover ? "rgba(255,255,255,0.1)" : "transparent",
        border: "none",
        color: "#E8E8E8",
        fontSize: 11,
        padding: "6px 12px",
        borderRadius: 4,
        cursor: "pointer",
        outline: focused ? "2px solid #FFFFFF" : "none",
        outlineOffset: "-2px",
        transition: "all 0.15s ease",
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

function TabButton({ active, onClick, children }) {
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

function TableRow({ visitor, selected, onClick }) {
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
          <Button variant="primary" style={{ padding: "4px 12px", fontSize: 11 }} onClick={e => e.stopPropagation()}>Sign out</Button>
        ) : (
          <span style={{ fontSize: 11, color: "#666" }}>{v.signedOut}</span>
        )}
      </td>
    </tr>
  );
}

export default function KastleVisitors() {
  const [tab, setTab] = useState("visitors");
  const [selected, setSelected] = useState(null);
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
      <div style={{ background: "#212121", height: 36, display: "flex", alignItems: "center", padding: "0 16px", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="1" width="8" height="8" rx="1" fill="#C8102E"/>
            <rect x="11" y="1" width="8" height="8" rx="1" fill="#C8102E"/>
            <rect x="1" y="11" width="8" height="8" rx="1" fill="#C8102E"/>
            <rect x="11" y="11" width="8" height="8" rx="1" fill="#9B0A22"/>
          </svg>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 400 }}>my</span>
          <span style={{ color: "#C8102E", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>KASTLE</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Home","My Account","Help","Contact Us"].map(l => (
            <NavLink key={l} label={l} />
          ))}
          <button 
            style={{ 
              background: "none", 
              border: "none", 
              color: "#F87171", 
              fontSize: 11, 
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: 4,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => e.target.style.background = "rgba(248,113,113,0.15)"}
            onMouseLeave={e => e.target.style.background = "none"}
          >Log out</button>
        </div>
      </div>

      {/* Context bar */}
      <div style={{ background: "#2C2C2C", height: 26, display: "flex", alignItems: "center", padding: "0 16px", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "#AAAAAA" }}>{dateStr} · {timeStr} · HQ — San Mateo</span>
        <span style={{ fontSize: 11, color: "#AAAAAA" }}>Welcome, <span style={{ color: "#C8102E", fontWeight: 600 }}>Michelle Foye</span></span>
      </div>

      {/* Tab bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E0E0E0", height: 40, display: "flex", alignItems: "stretch", padding: "0 16px", gap: 24 }}>
        {[
          { id: "visitors", label: "Visitors" },
          { id: "analytics", label: "Analytics" },
          { id: "styles", label: "Styles" },
        ].map(t => (
          <TabButton key={t.id} active={tab === t.id} onClick={() => { setTab(t.id); setSelected(null); }}>
            {t.label}
          </TabButton>
        ))}
      </div>

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
              onChange={e => setSearch(e.target.value)}
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
      {tab === "styles" && <StylesView />}
    </div>
  );
}
