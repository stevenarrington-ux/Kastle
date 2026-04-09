import { useState, useEffect } from "react";

const VISITORS = [
  { id: 1, name: "Bradley Alexander", photo: "BA", host: "Sarah Kim", hostTitle: "VP Operations", type: "Visitor", badge: "1031", signedIn: "9:02 AM", status: "in", company: "Meridian Consulting", email: "b.alexander@meridian.co", phone: "+1 202-555-0147", lang: "English", method: "Signed in on tablet", sightings: ["Lobby", "Elevator B", "Floor 3 Hall", "Conf Room 4A"] },
  { id: 2, name: "Amur Korsgaard", photo: "AK", host: "Rahul Ramanathan", hostTitle: "Director of Engineering", type: "Guest", badge: "1032", signedIn: "9:55 AM", status: "in", company: "Korsgaard Design", email: "amur@korsgaard.dk", phone: "+1 781-555-2056", lang: "English", method: "Signed in on tablet", sightings: ["Main Entrance", "Guest Lobby", "Elevator A", "Floor 2"] },
  { id: 3, name: "Cristofer Gouse", photo: "CG", host: "Michelle Park", hostTitle: "Head of Partnerships", type: "Contractor", badge: "1033", signedIn: "10:14 AM", status: "in", company: "Parthenon Electric", email: "cgouse@parthenon.com", phone: "+1 617-555-8834", lang: "English", method: "Pre-registered", sightings: ["Loading Dock", "B1 Corridor"] },
  { id: 4, name: "Cheyann Rosser", photo: "CR", host: "Rafael Bustamante", hostTitle: "Facilities Manager", type: "VIP", badge: "1034", signedIn: "8:45 AM", status: "in", company: "Atlas Realty Group", email: "crosser@atlasrealty.com", phone: "+1 703-555-4421", lang: "English", method: "Escort required", sightings: ["Lobby", "Executive Suite", "Board Room"] },
  { id: 5, name: "Peter Venkman", photo: "PV", host: "Dana Barrett", hostTitle: "Property Manager", type: "Vendor", badge: "1035", signedIn: "11:13 AM", status: "out", signedOut: "12:45 PM", company: "GhostTech HVAC", email: "pvenkman@ghosttech.com", phone: "+1 212-555-0199", lang: "English", method: "Signed in at front desk", sightings: ["Lobby", "Mechanical Room"] },
  { id: 6, name: "Lisa Tran", photo: "LT", host: "James Whitfield", hostTitle: "CTO", type: "Interview", badge: "1036", signedIn: "1:30 PM", status: "in", company: "—", email: "lisa.tran@gmail.com", phone: "+1 415-555-7782", lang: "English", method: "Pre-registered", sightings: ["Lobby", "Floor 4 Reception"] },
  { id: 7, name: "Omar Farid", photo: "OF", host: "Sarah Kim", hostTitle: "VP Operations", type: "Visitor", badge: "1037", signedIn: "10:00 AM", status: "out", signedOut: "11:30 AM", company: "Zenith Capital", email: "ofarid@zenithcap.com", phone: "+1 646-555-3310", lang: "Arabic, English", method: "Signed in on tablet", sightings: ["Lobby"] },
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
    const base = Math.floor(Math.random() * 4) + 2;
    const entry = { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), total: 0 };
    types.forEach(t => { const v = Math.floor(Math.random() * (t === "Visitor" ? 5 : 3)) + (t === "Visitor" ? 1 : 0); entry[t] = v; entry.total += v; });
    days.push(entry);
  }
  return days;
})();

const TYPE_COLORS = { Visitor: "#4A90D9", Contractor: "#2E8B3E", Interview: "#7B61FF", VIP: "#C8102E", Vendor: "#E8A317", Guest: "#66BBCC" };

function Avatar({ name, size = 40 }) {
  const initials = name.split(" ").map(n => n[0]).join("");
  const colors = ["#C8102E","#4A90D9","#2E8B3E","#7B61FF","#E8A317","#1A5FA8"];
  const c = colors[name.length % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: size * 0.38, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function StatusPill({ status }) {
  const isIn = status === "in";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: isIn ? "#E6F4EB" : "#F5F5F5", color: isIn ? "#1D7A3A" : "#5E5E5E" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: isIn ? "#1D7A3A" : "#5E5E5E" }} />
      {isIn ? "In" : "Out"}
    </span>
  );
}

function TypeBadge({ type }) {
  const c = TYPE_COLORS[type] || "#666";
  return <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: c + "18", color: c, letterSpacing: "0.03em" }}>{type}</span>;
}

function CameraFeed({ cam, index }) {
  const grad = index === 0
    ? "linear-gradient(135deg, #2a2a3a 0%, #1a2a3a 40%, #3a3a4a 100%)"
    : "linear-gradient(135deg, #3a3a4a 0%, #2a3a4a 40%, #1a2a3a 100%)";
  return (
    <div style={{ flex: 1, minWidth: 280, borderRadius: 8, overflow: "hidden", position: "relative", background: grad, aspectRatio: "16/10" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 13 }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 12px 10px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C8102E", boxShadow: "0 0 6px #C8102E" }} />
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>{cam.name}</span>
        </div>
      </div>
    </div>
  );
}

function SightingThumb({ label, index }) {
  const hues = [210, 190, 220, 200, 230];
  const h = hues[index % hues.length];
  return (
    <div style={{ width: 110, flexShrink: 0 }}>
      <div style={{ width: 110, height: 80, borderRadius: 6, background: `linear-gradient(135deg, hsl(${h},15%,25%), hsl(${h},20%,35%))`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
      </div>
      <div style={{ fontSize: 10, color: "#666", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
    </div>
  );
}

function DetailPanel({ visitor, onClose }) {
  if (!visitor) return null;
  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 420, background: "#fff", boxShadow: "-4px 0 24px rgba(0,0,0,0.15)", zIndex: 100, display: "flex", flexDirection: "column", animation: "slideIn 0.25s ease-out" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #E0E0E0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>{visitor.name}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4, color: "#666", fontSize: 18, lineHeight: 1 }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Header card */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid #E0E0E0" }}>
          <Avatar name={visitor.name} size={72} />
          <div style={{ marginTop: 12, fontSize: 11, color: "#666" }}>{visitor.company}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <StatusPill status={visitor.status} />
            <TypeBadge type={visitor.type} />
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <div style={{ background: "#E6F4EB", color: "#1D7A3A", padding: "6px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              ✓ Signed in {visitor.signedIn}
            </div>
            {visitor.status === "out" ? (
              <div style={{ background: "#F5F5F5", color: "#5E5E5E", padding: "6px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                Signed out {visitor.signedOut}
              </div>
            ) : (
              <button style={{ background: "#C8102E", color: "#fff", border: "none", padding: "6px 16px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Sign out
              </button>
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
            <div key={label} style={{ display: "flex", padding: "8px 0", fontSize: 12 }}>
              <span style={{ width: 80, color: "#666", flexShrink: 0 }}>{label}</span>
              <span style={{ color: "#1A1A1A", fontWeight: 500 }}>{val}</span>
            </div>
          ))}
        </div>
        {/* Sightings */}
        <div style={{ padding: "16px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#C8102E", marginBottom: 12 }}>Sightings</div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
            {visitor.sightings.map((s, i) => <SightingThumb key={i} label={s} index={i} />)}
          </div>
          <button style={{ marginTop: 12, background: "none", border: "none", color: "#1A7FCC", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0 }}>
            View Person of Interest →
          </button>
        </div>
      </div>
    </div>
  );
}

function AnalyticsView() {
  const maxTotal = Math.max(...ANALYTICS_DATA.map(d => d.total));
  const types = ["Visitor", "Contractor", "Interview", "VIP", "Vendor", "Guest"];
  const totals = {};
  types.forEach(t => { totals[t] = ANALYTICS_DATA.reduce((s, d) => s + d[t], 0); });
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

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
          <div key={i} style={{ flex: "1 1 160px", background: "#fff", borderRadius: 8, padding: 20, border: "1px solid #E0E0E0" }}>
            <div style={{ fontSize: 11, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>{card.value}</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{card.sub}</div>
          </div>
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
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column-reverse", height: "100%" }}>
              <div style={{ fontSize: 8, color: "#999", textAlign: "center", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden" }}>{i % 3 === 0 ? d.date : ""}</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column-reverse", gap: 1 }}>
                {types.map(t => (
                  d[t] > 0 ? <div key={t} style={{ height: `${(d[t] / maxTotal) * 100}%`, background: TYPE_COLORS[t], borderRadius: 2, minHeight: d[t] > 0 ? 3 : 0, opacity: 0.85 }} /> : null
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
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 80, fontSize: 12, color: "#1A1A1A", fontWeight: 500 }}>{t}</span>
              <div style={{ flex: 1, height: 20, background: "#F4F4F4", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${(totals[t] / grandTotal) * 100}%`, height: "100%", background: TYPE_COLORS[t], borderRadius: 4, opacity: 0.8 }} />
              </div>
              <span style={{ width: 36, textAlign: "right", fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>{totals[t]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
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
          {/* Castle icon */}
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="1" width="8" height="8" rx="1" fill="#C8102E"/>
            <rect x="11" y="1" width="8" height="8" rx="1" fill="#C8102E"/>
            <rect x="1" y="11" width="8" height="8" rx="1" fill="#C8102E"/>
            <rect x="11" y="11" width="8" height="8" rx="1" fill="#9B0A22"/>
          </svg>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 400 }}>my</span>
          <span style={{ color: "#C8102E", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>KASTLE</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Home","My Account","Help","Contact Us"].map(l => (
            <span key={l} style={{ color: "#E8E8E8", fontSize: 11, cursor: "pointer" }}>{l}</span>
          ))}
          <span style={{ color: "#F87171", fontSize: 11, cursor: "pointer" }}>Log out</span>
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
        ].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelected(null); }} style={{
            background: "none", border: "none", borderBottom: tab === t.id ? "3px solid #C8102E" : "3px solid transparent",
            color: tab === t.id ? "#C8102E" : "#666", fontSize: 12, fontWeight: tab === t.id ? 600 : 500, cursor: "pointer", padding: "0 4px",
          }}>
            {t.label}
          </button>
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
              <button style={{ background: "#C8102E", color: "#fff", border: "none", borderRadius: 4, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add Visitor</button>
              <button style={{ background: "#fff", color: "#1A1A1A", border: "1px solid #E0E0E0", borderRadius: 4, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Import</button>
            </div>
          </div>
          <div style={{ padding: "0 20px 12px" }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, host, or company…"
              style={{ width: "100%", maxWidth: 400, height: 32, border: "1px solid #E0E0E0", borderRadius: 4, padding: "0 10px", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              onFocus={e => { e.target.style.borderColor = "#C8102E"; e.target.style.boxShadow = "0 0 0 2px rgba(200,16,46,0.2)"; }}
              onBlur={e => { e.target.style.borderColor = "#E0E0E0"; e.target.style.boxShadow = "none"; }}
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
                    <tr key={v.id} onClick={() => setSelected(v)} style={{ cursor: "pointer", background: selected?.id === v.id ? "#FDECEA" : "#fff", transition: "background 0.15s" }}
                      onMouseEnter={e => { if (selected?.id !== v.id) e.currentTarget.style.background = "#FAFAFA"; }}
                      onMouseLeave={e => { if (selected?.id !== v.id) e.currentTarget.style.background = "#fff"; }}
                    >
                      <td style={{ padding: "10px 12px", borderBottom: "1px solid #F0F0F0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={v.name} size={32} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{v.name}</div>
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
                          <button onClick={e => { e.stopPropagation(); }} style={{ background: "#C8102E", color: "#fff", border: "none", borderRadius: 4, padding: "4px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Sign out</button>
                        ) : (
                          <span style={{ fontSize: 11, color: "#666" }}>{v.signedOut}</span>
                        )}
                      </td>
                    </tr>
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
    </div>
  );
}
