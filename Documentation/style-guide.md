# House You — Theme Style Guide

The visual system for houseyou.org. This is the **source of truth for look & feel**;
when building or refactoring UI, match it. Tokens here are the real values from
[`theme.json`](../theme.json) and [`sass/theme.scss`](../sass/theme.scss) — if you change a
token, change it there and update this file.

> Deploy note: theme files are not live until pushed. Agent/CLI edits don't auto-sync —
> `scp` to staging and verify. See [architecture.md §9](architecture.md).

---

## 1. Ethos

House You is a grassroots housing-justice movement. The design is **bold, direct, and
unpolished-on-purpose** — it should feel like organised people power, not a corporate
charity. Concretely that means: high contrast, heavy type, sharp edges, confident colour,
and one repeated structural motif rather than lots of decoration.

**Voice in UI copy:** plain, active, imperative. "Sign the petition," not "Submit." Name
things by what people do. Sentence case for body and buttons-as-words; the type system
handles emphasis.

---

## 2. The signature — the "shadow-box"

The one element everything is built around. A **solid ash-grey border + a hard pink offset
shadow** (no blur), which "presses in" on interaction. It already lived in the site's form
inputs; it's now the unifying motif across cards, and should extend to any raised surface
(featured images, pull-quotes, key CTAs).

```css
border: 3px solid var(--wp--preset--color--ash-grey);   /* #141414 */
box-shadow: 7px 7px 0 0 var(--wp--preset--color--house-you-pink); /* #A8178C */
/* interaction: press into the shadow */
transform: translate(3px, 3px);
box-shadow: 4px 4px 0 0 var(--wp--preset--color--house-you-pink);
```

Rules: **no blur, no soft drop-shadows anywhere.** Corners are square (radius 0). Use the
shadow-box sparingly and at full strength — it's the accent, so the things around it stay
quiet. Offset shadow is pink by default; ash-grey is the acceptable alternative on
pink/coloured backgrounds where pink-on-pink wouldn't read.

---

## 3. Colour

Palette from `theme.json` → `settings.color.palette`. Use the CSS vars, not raw hex:
`var(--wp--preset--color--{slug})`.

| Slug | Hex | Role |
|---|---|---|
| `ash-grey` | `#141414` | Primary. Text, borders, dark sections. |
| `house-you-pink` | `#A8178C` | Brand accent. Shadow-box shadow, eyebrows, highlights. |
| `white` | `#FFFFFF` | Page background, text on dark/pink. |
| `hot-pink` | `#E64BC8` | Secondary accent / hover pops. |
| `orange` | `#FB903A` | Accent only. |
| `lime-green` | `#6DF2B3` | Accent only. |
| `light-pink` | `#FFDAF1` | Soft background tint. |
| `purple` | `#5B2B5F` | Accent. |
| `logo-blue` | `#05FBFD` | Logo accent. |
| `blue` / `peppermint-blue` | `#7DD8E6` / `#8BDFED` | Accent only. |

**Semantic tokens** (`settings.custom.color`): `primary` = ash-grey, `secondary` =
house-you-pink, `tertiary` = logo-blue, `foreground` = ash-grey, `background` = white.

### Contrast — text-safe vs accent-only
WCAG AA needs **4.5:1** for normal text, **3:1** for large/bold (≥24px).

- ✅ **Text-safe:** ash-grey on white (high), white on ash-grey, **white on house-you-pink
  `#A8178C` ≈ 6.6:1** (the darken bought us this).
- ⚠️ **Large text only:** hot-pink, purple on white.
- ❌ **Accent-only — never body text on white:** orange, lime-green, blue, peppermint,
  logo-blue, light-pink. Use for fills, borders, shapes, duotones — not running text.

---

## 4. Typography

Two faces, self-hosted (`assets/fonts/`):

- **Lexend** (variable) — display/headings, nav, eyebrows, buttons, labels. Carries the
  personality. `var(--wp--preset--font-family--lexend)`.
- **Poppins** — body copy, excerpts, sublines. `var(--wp--preset--font-family--poppins)`.

### Scale (from `theme.json`)
Headings are Lexend, fluid, heavy. Body is Poppins.

| Element | Size | Weight | Notes |
|---|---|---|---|
| h1 | `min(max(3rem,7vw),4.5rem)` | 700 | lh 1.2 |
| h2 | `min(max(2.4rem,5vw),3.6rem)` | 900 | lh 1.2 |
| h3 | `min(max(1.9rem,4vw),2.8rem)` | 900 | lh 1.3 |
| h4 | `min(max(1.35rem,3.5vw),1.85rem)` | 900 | **UPPERCASE**, ls 0.1em |
| h5 | `1.15rem` | 900 | **UPPERCASE**, ls 0.1em |
| h6 | `1rem` | 900 | **UPPERCASE**, ls 0.1em |
| body | `1.25rem` (`--wp--custom--font-sizes--normal`) | 400 | lh 1.6 |
| small | `1rem` | — | captions |
| x-small | `0.875rem` | — | meta |

Preset sizes: `small 1rem`, `medium 1.5rem`, `large ~1.75–2.25rem`, `x-large ~2.25–3rem`.

### Uppercase rule
Uppercase + letter-spacing is a **deliberate device for short strings only** — eyebrows,
buttons, nav, labels, h4–h6. **Never set running sentences or article subheadings in
uppercase** (it's ~10–15% slower to read). Sentence case everywhere else.

### Eyebrow (signature text treatment)
The small pink kicker above a title (e.g. an event date, a category). Pairs with the card.
```css
color: var(--wp--preset--color--house-you-pink);
font-family: var(--wp--preset--font-family--lexend);
font-size: 0.78rem; font-weight: 700;
letter-spacing: 0.12em; text-transform: uppercase;
```

### Readability
Long-form prose is capped to a **42rem measure** with ~0.9em paragraph rhythm (scoped to
`.wp-block-post-content` on standard pages). Don't let body copy run the full 1400px.

---

## 5. Spacing & layout

| Token | Value | Use |
|---|---|---|
| `--wp--custom--spacing--outer` | `min(4vw, 90px)` | Page side padding (root) |
| `--wp--custom--spacing--small` | `clamp(20px,4vw,40px)` | Tight gaps |
| `--wp--custom--spacing--medium` | `clamp(30px,8vw,100px)` | Section rhythm |
| `--wp--custom--spacing--large` | `clamp(100px,12vw,460px)` | Big breaks |
| `--wp--custom--gap--horizontal/vertical` | `min(30px,5vw)` | Block gaps |

Layout widths: `contentSize` **1400px**, `wideSize` **1400px**. Full-bleed sections use
`alignfull` (native root-padding-aware). Prose measure ≈ 42rem inside content.

Card grid gap: **25px**. Component internal padding: **~22px** (matches the card).

---

## 6. Components

### Buttons (`theme.json` → core/button)
Sharp, bold, invert on hover — the shadow-box's flat cousin.
```
background: ash-grey;  color: white;
border: 3px solid ash-grey;  border-radius: 0;
padding: 0.667em 1.75em;  font: Lexend 700, 1rem;
text-transform: uppercase;  letter-spacing: 0.1em;
hover → background: white; color: ash-grey;  (border stays)
```
Primary = ash. For a brand-pop CTA, a pink fill with white text is acceptable (passes
contrast). Avoid more than one primary button per view.

### Cards (the reference component) — `.card` / `[content_cards]`
The canonical expression of the system. Structure: `image → eyebrow → title → subline →
excerpt`. White fill, shadow-box, press-on-hover.

| Part | Token |
|---|---|
| frame | 3px ash border, `7px 7px 0` pink offset shadow, radius 0 |
| hover | `translate(3px,3px)`, shadow → `4px 4px 0` |
| image | 16/9, `border-bottom: 3px ash`, placeholder `#efefef` |
| eyebrow | pink, Lexend, 0.78rem/700, ls 0.12em, uppercase |
| title | `h3.card-title` Lexend, ash, 1.3rem/700, lh 1.2 |
| subline | `#5b5b5b`, 0.9rem, lh 1.45 |
| excerpt | `#3a3a3a`, 0.95rem, lh 1.55 |
| padding | 22px sides / top, 24px bottom |

One engine renders all card grids: `[content_cards]` (taxonomy / `parent` / `template`
modes; `[events_listing]` delegates to it). The whole card is the link — **no separate
"Read more" button.** Build new card-like listings on `.card`, never a new card style.

### Forms / inputs
Already shadow-box: 3px border, square corners, offset shadow, transparent fill, Lexend
uppercase labels (`theme.json` → `settings.custom.form`). Keep new inputs in this style.

### Sections (block styles)
Apply via the block editor Styles panel:

| Style | Background | Text |
|---|---|---|
| `is-style-dark-section` | ash-grey | white |
| `is-style-light-section` | white | ash-grey |
| `is-style-pink-section` | house-you-pink | white |

Full-bleed colour bands; alternate to structure a page. White-on-pink is text-safe now.

### Links
Body links: ash-grey, underlined; on hover the link fills ash-grey with white text (a
mini shadow-box-less invert). Don't colour body links pink (reserve pink as accent).

---

## 7. Motion & accessibility

- **Motion is the press**, not decoration. The shadow-box translate (≤0.18s ease) is the
  primary interaction; avoid fades/parallax/scattered effects.
- Always respect `prefers-reduced-motion: reduce` (disable transforms).
- Visible keyboard focus everywhere: `:focus-visible` gets a 3px pink outline, offset 4px.
- Maintain the contrast rules in §3. Don't rely on colour alone to convey state.
- Responsive down to the 768px breakpoint; cards go single-column (max 500px) on mobile.

---

## 8. Do / Don't

**Do**
- Reuse the shadow-box for any raised surface; keep it square and blur-free.
- Use eyebrows + Lexend titles for a consistent "card-like" rhythm in listings.
- Keep one bold element per view; let the rest stay quiet.
- Derive every colour/size from a token.

**Don't**
- ❌ Soft/blurred drop shadows or rounded corners (breaks the language).
- ❌ Grey filler boxes inside white components (the old card meta box — gone).
- ❌ Emoji as UI iconography in templates.
- ❌ Uppercase on multi-word/running text.
- ❌ Accent colours (orange/lime/blue) as text on white.
- ❌ Inventing a second card/button style — extend the existing one.

---

## 9. Where it lives
- **Tokens:** [`theme.json`](../theme.json) (colour, type scale, spacing, button/form).
- **Component CSS:** [`sass/theme.scss`](../sass/theme.scss) → build to `assets/theme.css`
  (`npm run build`; edit SCSS, never the compiled CSS — see
  [css-build-pipeline](css-build-pipeline) note).
- **Card engine:** `[content_cards]` in [`functions.php`](../functions.php).
- **Fonts:** `assets/fonts/` (Lexend variable + Poppins weights).
- Related: [architecture.md](architecture.md), [refactor.md](refactor.md).
