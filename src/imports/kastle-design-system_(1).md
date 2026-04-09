# Kastle Systems — Design System Reference

> Paste this into any Claude conversation to give it Kastle brand context.
> Extracted from: KastlePresence mobile app (primary), myKastle web app, and print/PDF collateral.
> Last updated: includes full web app component patterns and WCAG AA interactive states.

---

## Color palette

### Brand core
| Token | Hex | Usage |
|---|---|---|
| `brand-red` | `#C8102E` | Logo, primary CTA buttons, active tab underlines, section headings, focus rings |
| `brand-red-dark` | `#9B0A22` | Button hover / press states |
| `brand-red-tint` | `#FDECEA` | Alert backgrounds, selected row highlight, subtle fills |
| `brand-black` | `#1A1A1A` | Headlines, "my" in myKastle wordmark, body text |

### Status / semantic
| Token | Hex | Usage |
|---|---|---|
| `status-unlocked` | `#2E8B3E` | Unlocked door state, success, "In" visitor status text |
| `status-unlocked-bg` | `#E6F4EB` | Background for "In" status pill |
| `status-locked` | `#4A90D9` | Locked door state, informational |
| `status-locked-bg` | `#E6EEF8` | Background for locked status pill |
| `status-link` | `#1A7FCC` | Hyperlinks, "learn more" text |
| `status-presence` | `#4CAF50` | Online/agree badge, active presence |
| `status-warning-text` | `#7A5200` | Warning banner text (on amber bg) |
| `status-warning-bg` | `#FFF8E1` | Warning banner background |
| `status-info-text` | `#1A5FA8` | Info banner text (on blue bg) |
| `status-info-bg` | `#E6EEF8` | Info banner background |

### Neutrals
| Token | Hex | Usage |
|---|---|---|
| `neutral-white` | `#FFFFFF` | Card backgrounds, screen backgrounds, table rows |
| `neutral-surface` | `#F4F4F4` | Page background, table header, input fields |
| `neutral-surface-hover` | `#F0F0F0` | Table header hover, nav link hover bg |
| `neutral-divider` | `#E0E0E0` | Row separators, card borders, input borders |
| `neutral-mid` | `#666666` | Subtext, captions, metadata, inactive tab labels |
| `neutral-nav` | `#212121` | Top nav bar background (preferred over `#2C2C2C` for better small-text contrast) |
| `neutral-subnav` | `#2C2C2C` | Context/session bar below main nav |
| `neutral-nav-text` | `#E8E8E8` | Nav bar link text |
| `neutral-inactive` | `#5E5E5E` | Inactive lock icons, occupancy badges, "Out" status dot |

---

## Typography

Font family: **System sans-serif** — `SF Pro` on iOS, `Roboto` on Android, `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` on web.

| Role | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Display / hero | 28px | 700 | `#1A1A1A` | Marketing headers, print collateral |
| Screen / page title | 16–20px | 600 | `#1A1A1A` | Nav bar title, page `<h1>` |
| Section heading | 16px | 600 | `#C8102E` | Always red in app and web |
| Body / list item | 15px | 400 | `#1A1A1A` | Main content text |
| Table body | 12–13px | 400 | `#1A1A1A` | Data rows |
| Table header | 11px | 600 | `#666666` | Column labels |
| Caption / meta | 11–13px | 400 | `#666666` | Sublabels, locations, dates |
| Tab label (web) | 12px | 500–600 | `#666666` inactive / `#C8102E` active | Sentence case |
| Tab label (mobile) | 12px | 600 | `#666666` inactive / `#C8102E` active | ALL CAPS, letter-spacing 0.05em |
| Nav link | 11px | 400 | `#E8E8E8` | Top nav bar |
| Badge / pill | 11px | 600 | varies by state | See status pills below |

---

## Spacing & shape tokens

| Token | Value | Used for |
|---|---|---|
| `radius-sm` | 4px | Buttons, table badges |
| `radius-md` | 6–8px | Input fields, small cards |
| `radius-lg` | 10–12px | Cards, modals, bottom sheets |
| `radius-xl` | 16px | Large modals, drawer panels |
| `radius-full` | 999px | Status pills, lock buttons, avatar circles |
| `space-xs` | 4px | Tight gaps, icon-to-label |
| `space-sm` | 8px | Button internal gap, cell padding |
| `space-md` | 16px | Screen edge padding, section padding |
| `space-lg` | 24px | Section separators |
| `border-subtle` | `0.5px solid #E0E0E0` | Table row separators, card outlines |
| `border-default` | `1px solid #E0E0E0` | Input borders, tab bar bottom |
| `border-emphasis` | `1px solid #C8102E` | Active input focus, active tab |
| `table-row-height` | 48px | Web data table rows |
| `list-row-height` | 56px | Mobile list rows |
| `tab-height` | 40px | Web tab bar |
| `nav-height` | 36px | Top nav bar |
| `context-bar-height` | 26px | Session/context bar |

---

## Component patterns

### Primary CTA button
- Background: `#C8102E`
- Text: `#FFFFFF`, 12–14px, weight 600
- Border: `1px solid #C8102E`
- Border radius: 4px
- Padding: 7px 13px
- Hover: background `#9B0A22`, border `#9B0A22`
- Active: `transform: scale(0.98)`
- Focus: `outline: 3px solid #C8102E; outline-offset: 2px`
- Disabled: `opacity: 0.4; cursor: not-allowed` — set both `disabled` and `aria-disabled="true"`

### Secondary button
- Background: `#FFFFFF`
- Text: `#1A1A1A`, 12px, weight 600
- Border: `1px solid #E0E0E0`
- Border radius: 4px
- Padding: 7px 13px
- Hover: background `#F4F4F4`, border `#BBBBBB`
- Focus: `outline: 3px solid #C8102E; outline-offset: 2px`

### Ghost / text button
- Background: transparent
- Text: `#C8102E`, 12px, weight 600
- Border: none
- Hover: background `#FDECEA`
- Use for: inline actions like "Edit", "Show/hide columns"

### Destructive button
- Background: transparent
- Text: `#A32D2D`, 12px, weight 600
- Border: none
- Hover: background `#FDECEA`
- Use for: "Delete" — always paired with a confirmation step before executing

---

### Navigation bar (web)

Two-tier structure:

**Tier 1 — global nav** (`#212121`, height 36px, `role="navigation" aria-label="Global navigation"`)
- Logo left: castle icon SVG + `my` (white `#FFFFFF`, weight 400) + `KASTLE` (red `#C8102E`, weight 700)
- Nav links: 11px, `#E8E8E8`, hover bg `rgba(255,255,255,0.1)`
- "Log out" right: `#F87171`, hover bg `rgba(248,113,113,0.15)`
- Focus on dark bg: `outline: 2px solid #FFFFFF; outline-offset: -2px`

**Tier 2 — context bar** (`#2C2C2C`, height 26px, `aria-label="Session context"`)
- Left: date/timezone, 11px `#AAAAAA`; emphasized segments `#DDDDDD`
- Right: "Welcome, [Name]" — name rendered in `#C8102E`, weight 600

---

### Tab bar (web)

- Container: `role="tablist" aria-label="Application sections"`
- Background: `#FFFFFF`, `border-bottom: 1px solid #E0E0E0`, height 40px, `padding: 0 16px`
- Each tab: `role="tab"`, `aria-selected="true|false"`, `aria-controls="[panel-id]"`
- Inactive: 12px, weight 500, `#666666`, `border-bottom: 3px solid transparent`
- Active: color `#C8102E`, `border-bottom: 3px solid #C8102E`, weight 600
- Hover: background `#F4F4F4`, color `#1A1A1A`
- Focus: `outline: 3px solid #C8102E; outline-offset: -2px`
- Tab icons: 14×14px SVG, `currentColor`, `aria-hidden="true"`
- Tab panel: `role="tabpanel"`, `id` matching tab's `aria-controls`

---

### Data table

```
<table aria-label="[Descriptive label]">
  <thead>
    <tr>
      <th scope="col">…</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>…</td>
    </tr>
  </tbody>
</table>
```

- All `<th>` elements use `scope="col"`
- Sortable `<th>`: `tabindex="0"`, `aria-sort="none|ascending|descending"`, Enter key handler
- Active sort: column header text and icon turn `#C8102E`; icon updates `↕` → `↑` or `↓`
- Header: 11px, weight 600, `#666666`, background `#F7F7F7`, cursor pointer on sortable cols
- Header hover: background `#EFEFEF`, color `#1A1A1A`
- Row height: 48px; cell padding: `9px 10px`
- Row separator: `border-bottom: 1px solid #F0F0F0`
- Row hover: background `#FAFAFA`
- Selected row: background `#FDECEA`
- Focus-within row: background `#FFF8F9`
- Primary column text: 12–13px, weight 500, `#1A1A1A`
- Meta/date columns: 11px, weight 400, `#666666`; dates in monospace
- Checkbox column: `accent-color: #C8102E`; each checkbox needs unique `aria-label` tied to row content (e.g. `aria-label="Select Traditional Services"`)
- Select-all checkbox: `aria-label="Select all [noun]"`

### Bulk action toolbar

- Appears above the table, below the search bar — always rendered (not toggled)
- Contains: "Edit" (ghost), "Delete" (destructive), selection count (center), "Show/hide columns" (ghost, right-aligned)
- All buttons disabled when 0 rows selected
- Disabled pattern: `disabled` attribute + `aria-disabled="true"` + `opacity: 0.4`
- Toolbar: `role="toolbar" aria-label="Bulk actions"`, `aria-live="polite"` so count changes are announced
- Count text pattern: `"N visitor(s) selected"` — always singular/plural aware

### Search bar

- Wrap in `role="search" aria-label="Search [noun]"`
- Every `<input>` paired with a `<label>` — visually hidden is fine, placeholder alone is not
- Input: height 32px, 13px, border `1px solid #E0E0E0`
- Input focus: `border-color: #C8102E` + `box-shadow: 0 0 0 2px rgba(200,16,46,0.2)` (no outline override needed here)
- "Search" button: primary style
- "Reset" button: secondary style
- Live result count: separate `aria-live="polite"` element, pattern `"N results for 'query'"`
- Enter key on input triggers search

### Status pills — web visitors table

Always pair color with a shape cue (dot) and a text label. Never color alone.

| State | Background | Text | Dot | ARIA label |
|---|---|---|---|---|
| In | `#E6F4EB` | `#1D7A3A` | `#1D7A3A` | `aria-label="Status: In"` |
| Out | `#F5F5F5` | `#5E5E5E` | `#5E5E5E` | `aria-label="Status: Out"` |

- Border radius: 999px; padding: 2px 8px; font: 11px weight 600
- Dot: 6×6px circle, `aria-hidden="true"`

### Status pills — mobile app

| State | Background | Text | Notes |
|---|---|---|---|
| Unlocked | `#2E8B3E` | white | White dot, `aria-label="Unlocked"` |
| Locked | `#4A90D9` | white | White dot, `aria-label="Locked"` |
| Presence/agree | `#4CAF50` | white | White dot |

### Banners / inline alerts

- Static info: `role="note"`; urgent: `role="alert"` (announces immediately)
- Icon: 14×14px SVG, `aria-hidden="true"` — label comes from text, not icon
- Info: bg `#E6EEF8`, text `#1A5FA8`, border-bottom `1px solid #90CAF9`
- Warning: bg `#FFF8E1`, text `#7A5200`, border-bottom `1px solid #FFD54F`
- Error: bg `#FDECEA`, text `#9B0A22`, border-bottom `1px solid #F48FB1`

### Occupancy badge (mobile)
- Background: `#5E5E5E`; Text: white, 14px, weight 600
- Border radius: 8px; Padding: 6px 14px

### List row (mobile)
- Min-height: 56px; Background: `#FFFFFF`; Separator: `0.5px solid #E0E0E0`
- Star icon: `aria-label="Add to favorites"` / `"Remove from favorites"`
- Subtext: 13px `#666666`
- Right action button: `#4A90D9` (locked) / `#2E8B3E` (unlocked), `aria-label` states the door name and lock state

### Pagination

- Left: summary text, e.g. `"Showing 1–9 of 9 visitors"`, 12px `#666666`
- Page buttons: 28×28px, border `1px solid #E0E0E0`, radius 4px
- Current page: bg `#C8102E`, text white, `aria-current="page"`
- Disabled prev/next: `opacity: 0.4; cursor: not-allowed`; use `disabled` attribute
- Wrapper: `role="navigation" aria-label="Page navigation"`
- Container: `background: #FFFFFF; border-top: 1px solid #E0E0E0; padding: 10px 16px`

---

## Accessibility requirements (WCAG AA)

| Rule | Requirement |
|---|---|
| Focus indicator (light bg) | `outline: 3px solid #C8102E; outline-offset: 2px` |
| Focus indicator (dark nav bg) | `outline: 2px solid #FFFFFF; outline-offset: -2px` |
| Never suppress focus | Never `outline: none` without a custom replacement |
| Body text contrast | `#1A1A1A` on white = 18.1:1 ✓ |
| Mid gray text | `#666666` on white = 5.7:1 ✓ |
| Nav text | `#E8E8E8` on `#212121` = 13.1:1 ✓ |
| Brand red on white | `#C8102E` on white = 5.9:1 ✓ (AA for normal text) |
| Red on red-tint | `#9B0A22` on `#FDECEA` = 6.2:1 ✓ |
| Status green on green-tint | `#1D7A3A` on `#E6F4EB` = 5.1:1 ✓ |
| Color not sole indicator | Status uses dot shape + text label; sort uses icon + aria-sort |
| Keyboard nav | All interactive elements reachable and operable by keyboard |
| Sortable columns | `tabindex="0"` + Enter key handler + `aria-sort` updated on click |
| Disabled states | `disabled` attribute + `aria-disabled="true"` + `opacity: 0.4` |
| Live regions | Search results and selection counts: `aria-live="polite"` |
| Skip link | `<a href="#main-content">Skip to main content</a>` — visually hidden until focused |
| Tables | `<th scope="col">` on all headers; `aria-label` on `<table>`; unique `aria-label` on each row checkbox |
| Tab components | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` → matching panel `id` |
| Icons | Decorative: `aria-hidden="true"`; functional: `aria-label` on the parent button |
| Form inputs | Every `<input>` paired with `<label>` — visually hidden is acceptable, placeholder alone is not |
| Touch targets | 44×44px minimum on mobile; 28×28px acceptable on desktop with pointer |

---

## Logo usage

- **"my" prefix**: `#1A1A1A` on light; `#FFFFFF` on dark — regular weight, lowercase
- **"KASTLE" wordmark**: `#C8102E` — bold, uppercase, always
- **Castle icon**: Four squares forming a castle silhouette. Three squares: `#C8102E`. Bottom-right (shadow): `#9B0A22`. Always SVG — never rasterize at small sizes.
- Never place the red logo on a red background
- Minimum clear space: equal to the cap height of "K"

---

## Page layout structure (web app)

```
┌─────────────────────────────────────────────┐
│  [skip link — visible on focus only]        │
├─────────────────────────────────────────────┤
│  Global nav bar (#212121, 36px)             │
│  Context / session bar (#2C2C2C, 26px)      │
├─────────────────────────────────────────────┤
│  Tab bar (white, 40px, border-bottom)       │
├─────────────────────────────────────────────┤
│  Page header (white, flex, 16px pad)        │
│    <h1> page title     [action buttons →]   │
├─────────────────────────────────────────────┤
│  Search toolbar (white, 10px pad)           │
├─────────────────────────────────────────────┤
│  Banner — info/warning (conditional)        │
├─────────────────────────────────────────────┤
│  Bulk action toolbar (surface bg, 6px pad)  │
├─────────────────────────────────────────────┤
│  Data table (white, full-width)             │
│    Header row (#F7F7F7)                     │
│    Data rows (white / hover #FAFAFA)        │
├─────────────────────────────────────────────┤
│  Pagination (white, border-top)             │
└─────────────────────────────────────────────┘
```

---

## Voice & tone

- Confident, direct: "Unlock doors from your desk"
- Feature-led headlines with benefit subtext
- Action words bolded in print: **MANAGE** access, **VERIFY** alarms, **CONTROL** your system
- No jargon in consumer-facing copy; technical detail reserved for spec sheets
- Error messages: specific and actionable — state what happened and what to do next

---

## Source priority (highest to lowest)
1. **KastlePresence mobile app** — primary source for color, spacing, mobile components
2. **myKastle web app** — nav patterns, dashboard layout, table and web component styles
3. **Print / PDF collateral** — typography hierarchy, logo rules, tone of voice
