# supportme.com — Design System & Tokens
> Extracted directly from Google Stitch project `7123152762919014765`  
> Covers: Creator Dashboard, Public Creator Page (`/@username`), and Profile Settings.

---

## 1. Design Direction & Brand Essence

- **Theme:** Artisanal micro-funding for India's independent creators.
- **Mood & Atmosphere:** Warm organic editorial, rich forest evergreen (`#00261a`), warm honey-amber coffee accents (`#fea619` / `#855300`), and warm parchment/linen surfaces (`#fdf9ef`).
- **Typography Philosophy:** Dual-type personality pairing classic high-contrast serif display headers (*Playfair Display*) with clean, highly legible geometric sans (*Inter*) for interface copy, tabular financial figures, and controls.

---

## 2. Color Palette

The system follows a refined Material 3 Tonal Palette rooted in deep natural green and warm coffee amber:

### Primary — Deep Pine & Evergreen
| Token | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `primary` | `#00261a` | Deepest pine black, brand titles, primary active controls |
| `on-primary` | `#ffffff` | High contrast text on primary surfaces |
| `primary-container` | `#0f3d2e` | Forest green container cards, hero banners, dark docks |
| `on-primary-container` | `#7ba894` | Soft sage muted text on dark primary containers |
| `primary-fixed` | `#beedd7` | Pale mint pill badges and highlights |
| `primary-fixed-dim` | `#a2d1bb` | Muted mint accent |
| `on-primary-fixed` | `#002116` | Dark green text on fixed mint pills |
| `on-primary-fixed-variant` | `#234f3f` | Secondary text on fixed mint pills |
| `inverse-primary` | `#a2d1bb` | Inverse primary accents |

### Secondary — Roasted Amber & Honey Coffee
| Token | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `secondary` | `#855300` | Roasted amber, secondary emphasis |
| `on-secondary` | `#ffffff` | White text on secondary buttons |
| `secondary-container` | `#fea619` | Golden honey amber — Primary CTA buttons & active coffee chips |
| `on-secondary-container` | `#684000` | Deep bronze text on gold CTA buttons |
| `secondary-fixed` | `#ffddb8` | Warm cream peach badge backgrounds |
| `secondary-fixed-dim` | `#ffb95f` | Warm golden amber button hover |
| `on-secondary-fixed` | `#2a1700` | Dark brown text on warm cream badges |
| `on-secondary-fixed-variant`| `#653e00` | Muted brown secondary text |

### Tertiary — Earthy Olive & Botanical
| Token | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `tertiary` | `#17240e` | Deep botanical olive |
| `on-tertiary` | `#ffffff` | White on tertiary |
| `tertiary-container` | `#2b3a22` | Dark olive accent container |
| `on-tertiary-container` | `#93a484` | Soft olive-sage label text |
| `tertiary-fixed` | `#d6e8c5` | Pale olive highlight badge |
| `tertiary-fixed-dim` | `#baccaa` | Muted olive badge |
| `on-tertiary-fixed` | `#121f09` | Dark text on fixed olive badges |
| `on-tertiary-fixed-variant`| `#3c4b31` | Medium olive text |

### Surfaces & Backgrounds — Warm Linen & Parchment
| Token | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `background` | `#fdf9ef` | Global page background canvas (warm parchment) |
| `on-background` | `#1c1c16` | Deep charcoal ink for high-contrast reading |
| `surface` | `#fdf9ef` | Base surface level |
| `on-surface` | `#1c1c16` | Primary body text and headers |
| `surface-dim` | `#dddad0` | Slightly dimmed surface borders |
| `surface-bright` | `#fdf9ef` | High-brightness canvas |
| `surface-container-lowest` | `#ffffff` | Elevated pure white cards, input fields, and modals |
| `surface-container-low` | `#f7f3e9` | Section groupings, table backgrounds, stat cards |
| `surface-container` | `#f1eee4` | Default card surfaces and subtle containers |
| `surface-container-high`| `#ece8de` | Interactive hover states, pill tabs, dropdowns |
| `surface-container-highest`| `#e6e2d8` | Subtle borders, pill chips, inactive stepper buttons |
| `surface-variant` | `#e6e2d8` | Alternative container surface |
| `on-surface-variant` | `#414944` | Secondary text, captions, timestamps, placeholder copy |
| `surface-tint` | `#3b6756` | Tonal elevation tint |
| `inverse-surface` | `#31312a` | Inverted dark surface |
| `inverse-on-surface` | `#f4f0e7` | Cream text on inverted dark surfaces |

### Outlines & Borders
| Token | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `outline` | `#717974` | Structural input borders and prominent card boundaries |
| `outline-variant` | `#c0c8c3` | Soft dividers, hairline borders, and decorative lines |

### Feedback / Alerts
| Token | Hex Value | Role / Usage |
| :--- | :--- | :--- |
| `error` | `#ba1a1a` | Form validation errors, payment failure text |
| `on-error` | `#ffffff` | White text on error chips |
| `error-container` | `#ffdad6` | Error alert backgrounds |
| `on-error-container` | `#93000a` | Dark red error alert body text |

---

## 3. Typography System

### Font Families
- **Display & Headlines:** `"Playfair Display", Georgia, serif`
- **Body, Labels, Numerics & Currency:** `"Inter", -apple-system, BlinkMacSystemFont, sans-serif`
- **Icons:** Material Symbols Outlined (`'Material Symbols Outlined'`)

### Type Scale Hierarchy

| Token | Family | Size | Line Height | Letter Spacing | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display-hero` | Playfair Display | 52px (3.25rem) | 56px | `-0.02em` | 700 | Hero title, creator name display |
| `display-hero-mobile`| Playfair Display | 36px (2.25rem) | 44px | `-0.01em` | 700 | Mobile hero titles |
| `headline-lg` | Playfair Display | 36px (2.25rem) | 44px | `-0.015em` | 600 | Page titles, major section headers |
| `headline-lg-mobile`| Playfair Display | 28px (1.75rem) | 36px | `0` | 600 | Mobile section headers |
| `headline-md` | Playfair Display | 26px (1.625rem) | 34px | `0` | 600 | Card titles, modal headers |
| `headline-sm` | Playfair Display | 20px (1.25rem) | 28px | `0` | 600 | Subsections, brand mark label |
| `currency-display` | Inter | 32px (2rem) | 38px | `-0.02em` | 700 | Large ₹ payment amounts & stats |
| `body-lg` | Inter | 18px (1.125rem) | 28px | `0` | 400 | Lead paragraphs, hero descriptions |
| `body-md` | Inter | 15px (0.9375rem) | 24px | `0` | 400 | Default body text, bio description |
| `body-sm` | Inter | 13px (0.8125rem) | 20px | `0` | 400 | Supporting text, footnotes, table data |
| `label-lg` | Inter | 15px (0.9375rem) | 20px | `0.01em` | 600 | Main button copy, active chips |
| `label-md` | Inter | 13px (0.8125rem) | 18px | `0.02em` | 500 | Form labels, navigation links, tabs |
| `label-sm` | Inter | 11px (0.6875rem) | 16px | `0.04em` | 600 | Kickers, metadata chips, uppercase tags |

---

## 4. Border Radius Scale

| Token | Value | Tailwind Class | Applied Components |
| :--- | :--- | :--- | :--- |
| `DEFAULT` | `0.25rem` (4px) | `rounded` | Micro-badges, status dots |
| `md` | `0.375rem` (6px) | `rounded-md` | Form input fields, small buttons |
| `lg` | `0.5rem` (8px) | `rounded-lg` | Preset quantity selector chips |
| `xl` | `0.75rem` (12px) | `rounded-xl` | Inner cards, table containers |
| `2xl` | `1rem` (16px) | `rounded-2xl` | Main dashboard cards, support widget container |
| `3xl` | `1.5rem` (24px) | `rounded-3xl` | Hero profile card, public page wrapper |
| `full` | `9999px` | `rounded-full` | Avatars, pills, primary CTA button, floating dock |

---

## 5. Box Shadows & Elevations

| Level | Value | Usage |
| :--- | :--- | :--- |
| `shadow-xs` | `0 1px 2px 0 rgba(15, 61, 46, 0.03)` | Input fields, small badges |
| `shadow-sm` | `0 1px 3px 0 rgba(15, 61, 46, 0.05), 0 1px 2px -1px rgba(15, 61, 46, 0.03)` | Cards at rest, quantity chips |
| `shadow-md` | `0 4px 12px 0 rgba(15, 61, 46, 0.06), 0 1px 3px 0 rgba(15, 61, 46, 0.04)` | Elevated cards, support form container |
| `shadow-lg` | `0 10px 24px -4px rgba(15, 61, 46, 0.08), 0 4px 8px -2px rgba(15, 61, 46, 0.04)` | CTA buttons hover, dropdowns |
| `shadow-xl` | `0 20px 32px -6px rgba(15, 61, 46, 0.10)` | Modals, Razorpay checkout wrapper |
| `shadow-dock`| `0 12px 36px -4px rgba(0, 26, 26, 0.25)` | Sticky bottom floating changes dock |
| `shadow-top` | `0 -1px 8px 0 rgba(0, 0, 0, 0.02)` | Sticky footer separator |

---

## 6. Spacing & Layout Grid

### Spacing Scale
| Token | Rem | Px | Intended Role |
| :--- | :--- | :--- | :--- |
| `space-xs` | `0.25rem` | 4px | Tight icon-to-label gaps, badge paddings |
| `space-sm` | `0.5rem` | 8px | Button inner padding, pill gaps |
| `space-md` | `1rem` | 16px | Form field margins, card internal padding (compact) |
| `gutter-sm`| `1rem` | 16px | Mobile page edge gutter |
| `space-lg` | `1.5rem` | 24px | Card internal padding (default), section gaps |
| `gutter` | `1.5rem` | 24px | Desktop page edge gutter |
| `margin-mobile`| `1rem`| 16px | Outer screen margins on mobile |
| `margin` | `2rem` | 32px | Section vertical spacing |
| `space-xl` | `2.5rem` | 40px | Major block spacing, footer padding |

### Maximum Widths
- **Site Shell / Header / Footer:** `max-w-7xl` (80rem / 1280px)
- **Creator Public Page Container:** `max-w-5xl` (64rem / 1024px)
- **Creator Dashboard Container:** `max-w-6xl` (72rem / 1152px)
- **Profile Settings / Forms:** `max-w-4xl` (56rem / 896px)
- **Support Widget Card:** `w-full max-w-[25rem]` (400px)

---

## 7. Component Patterns from Stitch Screens

### A. Quick Coffee Quantity Selector
- **Preset Chips:** Quick buttons (`1`, `2`, `3`, `5`).
  - Active: `bg-primary text-on-primary font-bold shadow-sm rounded-xl py-2`
  - Inactive: `bg-surface-container-lowest text-primary hover:bg-surface-container-high rounded-xl py-2`
- **Quantity Stepper:** Inset row (`bg-surface-container-lowest border border-outline-variant rounded-xl p-2.5`) with `−` and `+` circular buttons and bold counter in `currency-display` font.

### B. Support CTA Button
- **Style:** Pill button (`rounded-full w-full py-3.5`).
- **Surface:** `bg-secondary-container hover:bg-secondary-fixed text-primary-container font-label-lg font-bold shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]`.
- **Text format:** `Support ₹{total}` with direct coffee cup icon (`☕`).

### C. Public Creator Hero
- **Cover:** Organic emerald radial gradient (`from-emerald-950 via-[#154336] to-emerald-900`) with subtle curved edge.
- **Avatar:** Large round avatar (`size-24 sm:size-28 rounded-full border-4 border-surface bg-surface-container-lowest object-cover shadow-sm`).
- **Verified Badge:** Emerald circle with checkmark positioned at bottom right of avatar (`bg-emerald-600 text-white`).

### D. Creator Stat Card
- **Surface:** `bg-surface-container-low border border-surface-container-highest rounded-2xl p-6`.
- **Value:** `font-currency-display text-currency-display text-on-surface`.
- **Kicker:** `font-label-sm uppercase tracking-wider text-on-surface-variant`.

### E. Floating Action Dock (Settings Screen)
- **Surface:** `sticky bottom-4 z-40 max-w-4xl mx-auto bg-primary-container/95 text-on-primary backdrop-blur-xl rounded-full px-space-lg py-space-sm shadow-dock`.
- **Indicator:** Pulsing amber dot (`bg-secondary-container animate-ping`) indicating unsaved changes.
- **Controls:** Muted "Discard" text button alongside pill "Save Changes" button in `bg-secondary-container text-primary-container`.

