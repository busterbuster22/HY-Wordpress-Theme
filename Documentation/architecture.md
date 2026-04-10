# House You Theme — Architecture & Reference

This document is the authoritative reference for the House You WordPress theme. It covers architecture, CSS conventions, layout system, design tokens, plugin dependencies, and deployment workflow. Keep it updated when making structural changes.

---

## 1. Theme Type and Architecture

### Theme Type: Full Site Editing (FSE) Block Theme

This is a **block theme** (also called a Full Site Editing theme). It uses:

- [`block-templates/`](block-templates/) — page templates as HTML block markup
- [`block-template-parts/`](block-template-parts/) — reusable parts (header, footer) as HTML block markup
- [`theme.json`](theme.json) — design tokens, colour palette, typography, layout settings
- [`functions.php`](functions.php) — PHP logic, shortcodes, ACF fields, block style registration
- No classic PHP template files (no `page.php`, `single.php`, etc.)

WordPress resolves templates using the [block template hierarchy](https://developer.wordpress.org/themes/basics/template-hierarchy/). The FSE editor (Site Editor) is the primary interface for editing templates and template parts.

### Template Hierarchy

| Template file | Purpose | Assigned to |
|---|---|---|
| [`block-templates/index.html`](block-templates/index.html) | Fallback for any URL that matches no other template | All unmatched URLs |
| [`block-templates/page.html`](block-templates/page.html) | Default page template | All standard pages |
| [`block-templates/single.html`](block-templates/single.html) | Single blog post | All `post` post-type entries |
| [`block-templates/archive.html`](block-templates/archive.html) | Archive / category / tag listing | Category, tag, date, author archives |
| [`block-templates/search.html`](block-templates/search.html) | Search results page | `?s=` queries |
| [`block-templates/404.html`](block-templates/404.html) | Not-found page | All 404 responses |
| [`block-templates/home.html`](block-templates/home.html) | Homepage (pattern-driven) | Page set as front page in Settings → Reading |
| [`block-templates/home-2026.html`](block-templates/home-2026.html) | 2026 homepage variant | Manually assigned in page editor |
| [`block-templates/action.html`](block-templates/action.html) | Action Network embed page (petition/letter) | Pages using "Action" custom template |
| [`block-templates/an-events.html`](block-templates/an-events.html) | Individual event page with RSVP form | Pages using "AN Events" custom template |
| [`block-templates/contact-us.html`](block-templates/contact-us.html) | Contact page with Jetpack form | Contact Us page |
| [`block-templates/blank.html`](block-templates/blank.html) | No header or footer | Pages using "Blank" custom template |
| [`block-templates/header-footer-only.html`](block-templates/header-footer-only.html) | Header + footer with no content wrapper | Pages using "Header and Footer Only" custom template |

### Template Parts

| Template part file | Area | Purpose |
|---|---|---|
| [`block-template-parts/header.html`](block-template-parts/header.html) | `header` | Site-wide header: logo + Max Mega Menu |
| [`block-template-parts/footer.html`](block-template-parts/footer.html) | `footer` | Site-wide footer: nav + logo + nav + acknowledgement |

### Custom Templates (registered in `theme.json`)

Three templates are registered in [`theme.json`](theme.json:4) as selectable in the page editor:

| `name` | `title` | Available for |
|---|---|---|
| `blank` | Blank | `page`, `post` |
| `header-footer-only` | Header and Footer Only | `page`, `post` |
| `an-events` | AN Events | `page` |

---

## 2. CSS Loading Chain

Styles are enqueued in [`houseyou_styles()`](functions.php:67), hooked to `wp_enqueue_scripts`.

### Load order

```
style.css
  handle:       house-you-main-style
  source:       get_stylesheet_uri() → /wp-content/themes/house-you/style.css
  dependencies: none
  version:      theme Version header (currently 1.0.7)
  content:      Theme header comment only — no rules

assets/theme.css
  handle:       house-you-style
  source:       get_template_directory_uri() + /assets/theme.css
  dependencies: ['house-you-main-style']
  version:      theme Version header (currently 1.0.7)
  content:      All custom CSS rules

[inline style appended to house-you-style]
  source:       houseyou_get_font_face_styles() → PHP-generated @font-face rules
  content:      @font-face declarations for Red Hat Display (all weights/styles)
                pointing to /assets/fonts/*.woff2
```

### Editor styles

Registered via [`houseyou_support()`](functions.php:36) on the `after_setup_theme` hook:

```php
add_editor_style( array( 'style.css', 'assets/theme.css' ) );
```

Font-face styles are also injected into the editor via [`houseyou_editor_styles()`](functions.php:106) on `admin_init`, appended inline to the `wp-block-library` handle.

### Google Fonts

[`assets/theme.css`](assets/theme.css:2) imports Inter (weights 600 and 800) from Google Fonts for admin UI use only:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@600;800&display=swap");
```

---

## 3. Layout System

The theme uses WordPress's native **`useRootPaddingAwareAlignments`** system for layout. This was migrated from a legacy CSS-hack approach in March 2026 (see [plans/layout-migration-completed.md](plans/layout-migration-completed.md)).

### How it works

1. **Root padding** is defined in `theme.json` → `styles.spacing.padding` as `var(--wp--custom--spacing--outer)` (which resolves to `min(4vw, 90px)`)
2. WordPress applies this padding to `.wp-site-blocks`, creating consistent side margins on all pages
3. Blocks with `align: full` (`alignfull` class) automatically **negate** the root padding, breaking out to full viewport width
4. Content inside constrained blocks is limited to `contentSize: 1160px` or `wideSize: 1400px`

### Content widths (from `theme.json` → `settings.layout`)

| Setting | Value | Purpose |
|---|---|---|
| `contentSize` | `1160px` | Default max-width for constrained blocks |
| `wideSize` | `1400px` | Max-width for `alignwide` blocks |

These values also exist under `settings.custom.layout` (which generates `--wp--custom--layout--content-size` and `--wp--custom--layout--wide-size` CSS properties).

### Full-width sections

To make a section span the full viewport width:

1. In the block editor, select the Group block
2. Set alignment to **"Full Width"** in the toolbar
3. WordPress adds `"align":"full"` to the block comment and `alignfull` to the HTML class
4. The native layout system removes root padding on that element automatically

No CSS hacks are needed. The `home-2026.html` template uses this on all 4 sections (hero, light, pink, dark).

### Responsive padding

Padding uses the `--wp--custom--spacing--outer` CSS variable (`min(4vw, 90px)`), which is responsive by nature. Additional padding rules in `sass/theme.scss` use this same variable for header, footer, and content containers:

```css
/* Mobile: inherits from --wp--custom--spacing--outer (min(4vw, 90px)) */
.content-container { padding-left: 20px; padding-right: 20px; }

/* Desktop (≥769px): uses the CSS variable */
@media (min-width: 769px) {
  .content-container {
    padding-left: var(--wp--custom--spacing--outer);
    padding-right: var(--wp--custom--spacing--outer);
  }
}
```

### Key layout classes reference

| Class | Where applied | Effect |
|---|---|---|
| `.full-width-homepage` | `wp:group` in home-2026 template | Legacy class kept on sections that also use `alignfull`; child-padding rules still reference it |
| `.content-container` | `wp:columns` or `wp:group` inside full-width sections; footer columns | Constrains to 1800px, centred, responsive padding |
| `.content-section` | `wp:group` wrapping standard content | Adds vertical padding (40px mobile, 60px desktop) |
| `.header-columns` | `wp:columns` inside header group | Two-column layout for logo + nav |
| `.home-block` | `wp:columns` and `wp:column` in action/event templates | Removes default padding; enables custom column layout |
| `.pre-footer` | Outer `wp:group` in footer | Identifies footer region for CSS scoping |
| `.site-main` | Outer `wp:group` in action/event templates | Constrained layout wrapper with white background |

---

## 4. Design System

### Colour Palette

Defined in [`theme.json`](theme.json:74). All colours are available as CSS custom properties `var(--wp--preset--color--{slug})`.

| Slug | Hex | Name | Primary use |
|---|---|---|---|
| `ash-grey` | `#141414` | Ash Grey Background | Header, footer, dark section backgrounds; body text |
| `house-you-pink` | `#CB1EAA` | House You Pink | Primary brand colour, buttons, accents |
| `white` | `#FFFFFF` | White | Page background, light section text |
| `hot-pink` | `#E64BC8` | Hot Pink | Accent / hover states |
| `orange` | `#FB903A` | Orange | Accent colour |
| `light-pink` | `#FFDAF1` | Light Pink | Soft background tint |
| `lime-green` | `#6DF2B3` | Lime Green | Accent, duotone overlay |
| `purple` | `#5B2B5F` | Purple | Accent |
| `logo-blue` | `#05FBFD` | Logo Blue | Logo accent; custom colour token `tertiary` |
| `blue` | `#7DD8E6` | Blue | Accent |
| `peppermint-blue` | `#8BDFED` | Peppermint Sky Blue | Accent |

### Custom colour tokens (in `theme.json` → `settings.custom.color`)

| Token | Resolves to |
|---|---|
| `--wp--custom--color--foreground` | `ash-grey` (#141414) |
| `--wp--custom--color--background` | `white` (#FFFFFF) |
| `--wp--custom--color--primary` | `ash-grey` (#141414) |
| `--wp--custom--color--secondary` | `house-you-pink` (#CB1EAA) |
| `--wp--custom--color--tertiary` | `logo-blue` (#05FBFD) |

### Duotone filters

| Slug | Colours | Name |
|---|---|---|
| `default-filter` | `#000` → `#B9FB9C` | Default filter |
| `white-filter` | `#000` → `#FFF` | White Filter |
| `red-filter` | `#000` → `#F3B2A9` | Red Filter |
| `blue-filter` | `#000` → `#C9E4ED` | Blue Filter |
| `blue-cream-filter` | `#252B39` → `#F9EED4` | Blue/Cream Filter |
| `green-pink-filter` | `#153232` → `#F7B9A9` | Green/Pink Filter |

### Typography

**Font family**: Red Hat Display only — `"Red Hat Display", sans-serif`

**Self-hosted**: All font files are in [`assets/fonts/`](assets/fonts/) as `.woff2` and loaded via PHP-generated `@font-face` rules.

| File | Weight | Style |
|---|---|---|
| `red-hat-display-regular.woff2` | 400 | normal |
| `red-hat-display-italic.woff2` | 400 | italic |
| `red-hat-display-500.woff2` | 500 | normal |
| `red-hat-display-500italic.woff2` | 500 | italic |
| `red-hat-display-700.woff2` | 700 | normal |
| `red-hat-display-700italic.woff2` | 700 | italic |
| `red-hat-display-900.woff2` | 900 | normal |
| `red-hat-display-900italic.woff2` | 900 | italic |

**Font sizes** (from `theme.json` → `settings.typography.fontSizes`):

| Slug | Size | Name |
|---|---|---|
| `small` | `1rem` (16px) | Small |
| `medium` | `1.5rem` (24px) | Medium |
| `large` | `min(max(1.75rem, 5vw), 2.25rem)` | Large — fluid |
| `x-large` | `min(max(2.25rem, 5vw), 3rem)` | Extra Large — fluid |

Custom font-size tokens:

| Token | Value |
|---|---|
| `--wp--custom--font-sizes--x-small` | `0.875rem` |
| `--wp--custom--font-sizes--normal` | `1.25rem` |

**Heading default weight**: 700 (set via `settings.custom.heading.typography.fontWeight`)

**Body line-height**: 1.6

### Spacing tokens (from `settings.custom.spacing`)

| Token | Value |
|---|---|
| `--wp--custom--spacing--small` | `clamp(20px, 4vw, 40px)` |
| `--wp--custom--spacing--medium` | `clamp(30px, 8vw, 100px)` |
| `--wp--custom--spacing--large` | `clamp(100px, 12vw, 460px)` |
| `--wp--custom--spacing--outer` | `min(4vw, 90px)` |

### Breakpoints

The theme has a single mobile/desktop breakpoint:

| Breakpoint | Value | Usage |
|---|---|---|
| Desktop | `min-width: 769px` | Padding switches to `var(--wp--custom--spacing--outer)`; columns stack/unstack; social icons display |

### Block style variations

Registered via [`houseyou_register_block_styles()`](functions.php:779) on the `init` hook. Applied to both `core/group` and `core/cover` blocks.

| Style slug | Class | Background | Text | Use when |
|---|---|---|---|---|
| `dark-section` | `is-style-dark-section` | `#141414` (ash-grey) | `#FFFFFF` (white) | Dark band/section across the page |
| `light-section` | `is-style-light-section` | `#FFFFFF` (white) | `#141414` (ash-grey) | Explicit white section against a dark page |
| `pink-section` | `is-style-pink-section` | `#CB1EAA` (house-you-pink) | `#FFFFFF` (white) | Brand-coloured highlight section |

**How to use a block style**: In the block editor, select a Group or Cover block → Styles panel → choose the variation. The CSS rules apply `!important` to override any inline colours set on the block.

**Full-width sections**: Use the block editor's alignment toolbar (set to "Full Width") instead of a block style. This uses native `alignfull` and works with `useRootPaddingAwareAlignments`. The legacy `is-style-full-width` block style was removed in the March 2026 layout migration.

---

## 5. Header and Footer

### Header (`block-template-parts/header.html`)

**Structure:**

```
wp:group  [alignfull, backgroundColor: ash-grey, layout: default]
  └── wp:columns  [class: header-columns, isStackedOnMobile: false]
        ├── wp:column  [verticalAlignment: center]
        │     └── wp:site-logo  [width: 153px]
        └── wp:column  [verticalAlignment: center]
              └── wp:shortcode
                    [maxmegamenu location="max_mega_menu_2"]
```

**How full-width dark background is achieved:**

The outer `wp:group` has `align: full` (`alignfull` class) and `backgroundColor: ash-grey`. With `useRootPaddingAwareAlignments` enabled, `alignfull` elements automatically negate the root padding and span the full viewport. The header template part's background colour and text colour are also reinforced in `sass/theme.scss` on the `header.wp-block-template-part` selector.

**Navigation:** Max Mega Menu plugin renders the nav via the shortcode `[maxmegamenu location="max_mega_menu_2"]` placed inside a `wp:shortcode` block. The menu location `max_mega_menu_2` is configured in WP Admin → Max Mega Menu → Menu Locations.

**Social icons:**

Social links are added as standard navigation items in the Max Mega Menu, with each link given the custom CSS class `social-icon` (set per menu item in WP Admin → Menus → item CSS Classes). The CSS then:

1. Hides the link label text with `font-size: 0`
2. Displays the icon via `background-image` matched on the link's `href`:

```css
/* The link text is hidden */
.social-icon a span,
.social-icon .mega-menu-link {
  font-size: 0 !important;
}

/* Icon displayed as background image matched by URL */
.social-icon a[href*="facebook.com"] {
  background-image: url("../assets/svg/facebook-2.svg") !important;
}
.social-icon a[href*="instagram.com"] {
  background-image: url("../assets/svg/instagram.svg") !important;
}
```

SVG files live at [`assets/svg/facebook-2.svg`](assets/svg/facebook-2.svg) and [`assets/svg/instagram.svg`](assets/svg/instagram.svg).

---

### Footer (`block-template-parts/footer.html`)

**Structure:**

```
wp:group  [alignfull, class: pre-footer, backgroundColor: ash-grey, textColor: white]
  ├── wp:columns  [class: content-container]
  │     ├── wp:column  [verticalAlignment: center]
  │     │     └── wp:navigation  [ref: 2063 — footer nav left]
  │     ├── wp:column
  │     │     └── wp:site-logo  [width: 150px, align: center]
  │     └── wp:column  [verticalAlignment: center]
  │           └── wp:navigation  [ref: 2064 — social/secondary nav right]
  └── wp:group  [class: content-container]
        └── wp:paragraph  [First Nations acknowledgement text]
```

**How full-width dark background is achieved:**

Same `alignfull` + `useRootPaddingAwareAlignments` technique as the header. The `.content-container` class on the inner columns/group constrains the content to `max-width: 1800px` with `margin: 0 auto` and responsive padding via `var(--wp--custom--spacing--outer)`.

**Navigations:** Two separate navigation blocks by database ref ID. `ref: 2063` = footer links (left column); `ref: 2064` = secondary/social links (right column). These refs point to Navigation post objects in the database — they exist on the live site only.

---

## 6. Templates — Detail

### `index.html` — Final fallback

WordPress uses this if no more specific template matches. Contains header, a basic post query loop, and footer. Rarely displayed in production since `page.html` and `single.html` handle the common cases.

---

### `page.html` — Standard pages

Used for all pages not assigned a custom template. Contains header, a constrained `<main>` group with white background and top/bottom padding, `wp:post-content`, and footer. Content is constrained to `contentSize` (1160px) by the native layout system. Side margins come from root padding via `useRootPaddingAwareAlignments`.

---

### `single.html` — Blog posts

Used for all single `post` entries. Structure:
- Header template part
- Post title (`h1`, `align: wide`) with top padding
- Full-width featured image
- `wp:post-content` (inherits layout)
- Author/date metadata columns
- Comments block
- Footer template part

---

### `archive.html` — Archive listings

Used for category, tag, date, and author archive pages. Contains header, archive title, and a `wp:query` loop displaying post excerpts.

---

### `search.html` — Search results

Displays search results using a `wp:query` loop. Shows a "No results" message when the query returns nothing.

---

### `404.html` — Not found

Uses the `house-you/hidden-404` pattern. Shows a styled not-found message.

---

### `home.html` — Homepage

The primary homepage template. **Does not use block editor page content directly** — it renders a fixed set of block patterns:

- `house-you/hidden-home-patterns` — main hero content (defined in [`patterns/hidden-home-patterns.php`](patterns/hidden-home-patterns.php))
- `house-you/columns-in-container` — multi-column content section
- `house-you/text-list-with-button` — text + CTA section

Patterns are registered in [`patterns/`](patterns/) and appear as hidden (not shown in the block inserter).

---

### `home-2026.html` — 2026 homepage variant

A separate homepage layout for 2026 campaign content. Selectable as a custom template via the page editor. Contains four full-width sections (hero, light, pink, dark), each using `align: full` (`alignfull`) with block style colour presets (`is-style-dark-section`, `is-style-light-section`, `is-style-pink-section`). The hero section includes an inline Action Network letter campaign embed. Footer template part is at root level after closing `</main>`.

---

### `action.html` — Action Network action page

**Purpose:** Displays a petition, letter, or other Action Network action form alongside page content.

**Structure:**

```
header template part
wp:group  [class: site-main, layout: constrained]
  └── wp:group  [class: full-width-homepage, backgroundColor: white]
        └── wp:columns  [class: home-block]
              ├── wp:column  [class: home-block]  ← left: post content (h1, body)
              └── wp:column  [class: home-block, width: 35%, verticalAlignment: top]  ← right: form
                    ├── wp:post-featured-image
                    ├── wp:heading  "TAKE ACTION"
                    └── wp:shortcode  [action_network_embed]
footer template part
```

**Shortcode used:** `[action_network_embed]` — reads the `action_embed_code` ACF field on the current page and outputs the embed HTML. See [Section 8](#8-action-network-integration).


---

### `an-events.html` — Individual event page

**Purpose:** Displays a single event with RSVP form.

**Structure:** Identical to `action.html` except:
- Left column shows `wp:post-title` + `wp:post-content` instead of raw post content block
- Right column heading is "RSVP HERE" (h3 with top border) instead of "TAKE ACTION"
- Right column uses `verticalAlignment: top` with `padding-top: var(--wp--preset--spacing--70)`

**Shortcode used:** `[action_network_embed]`

**Also uses:** The `_event_date`, `_event_time`, `_event_end_time`, `_event_location` post meta fields (set via the Event Details meta box in the post editor).

---

### `contact-us.html` — Contact page

**Purpose:** Contact form page.

**Plugin dependency:** Jetpack — the contact form blocks (`wp:jetpack/contact-form`, `wp:jetpack/field-*`, `wp:jetpack/button`) are Jetpack blocks. Without Jetpack, the form renders as empty or broken.

---

### `blank.html` — No header or footer

**Purpose:** A fully empty wrapper — only `wp:post-content`. Used for pages that need to be completely custom-built (e.g., landing pages with their own header/footer in page content, or pages embedded in iframes).

---

### `header-footer-only.html` — Header + footer, no content wrapper

**Purpose:** Renders the header and footer template parts with `wp:post-content` in between, but with no layout constraints or padding wrappers. The page editor content occupies the full space between header and footer.

---

## 7. Plugin Dependencies

| Plugin | What it provides | What breaks without it |
|---|---|---|
| **Advanced Custom Fields (ACF)** | `action_embed_code` textarea field on action/event pages; `get_field()` function | `[action_network_embed]` returns empty/warning; event sync cannot auto-detect embed code to extract event ID |
| **Jetpack** | Contact form blocks (`contact-form`, `field-*`, `button`) | The contact-us template shows no form; blocks may render as empty divs or error notices |
| **Max Mega Menu** | Responsive mega-menu via `[maxmegamenu]` shortcode; mobile hamburger menu | Header renders with no navigation — the shortcode outputs nothing without the plugin |
| **Action Network** (external service) | Embed widget scripts loaded from `actionnetwork.org` | RSVP / petition / letter forms do not load; the embed area is visually empty |

---

## 8. Action Network Integration

### `[action_network_embed]` shortcode

**Registered in:** [`functions.php:853`](functions.php:853) via `add_shortcode( 'action_network_embed', 'houseyou_action_network_embed_shortcode' )`

**How it works:**

1. Calls `get_field( 'action_embed_code' )` (ACF) to read the embed code from the current page's meta
2. If the field is empty and the current user is an editor, renders a yellow admin warning box
3. If the field is empty and not logged in, returns `''` (silent)
4. If the field has content, returns the raw HTML/script unescaped

**Used in templates:** [`action.html`](block-templates/action.html) and [`an-events.html`](block-templates/an-events.html) via `wp:shortcode` blocks.

**ACF compatibility filter:** `acf/shortcode/allow_in_block_themes_outside_content` is set to `true` to allow ACF shortcodes to render in FSE block templates.

---

### ACF field: `action_embed_code`

**Registered programmatically** in [`houseyou_register_acf_fields()`](functions.php:880) on the `acf/init` hook. This means the field requires no database import — it activates immediately when the theme is active and ACF is installed.

**Field key:** `field_action_embed_code`  
**Field name:** `action_embed_code`  
**Type:** `textarea`  
**Group key:** `group_action_network_embed`

**Dual purpose:**

1. **Display** — `[action_network_embed]` shortcode reads this field to output the embed HTML
2. **Event sync detection** — the Event Details meta box reads this field to auto-detect an Action Network event ID (UUID extracted from the embed script URL), so editors don't need to enter the ID manually

**Accepted input formats** (documented in field instructions):

```
<script src="https://actionnetwork.org/widgets/v3/event/EVENT-SLUG?format=js"></script>
https://actionnetwork.org/events/event-slug
abc123-def456-ghi789   (bare UUID)
```

**Appears on pages using:** `action` template OR `an-events` template.

---

### Event meta fields

Stored as post meta on individual event pages (pages using the `an-events` template):

| Meta key | Content | Set by |
|---|---|---|
| `_action_network_event_id` | Action Network UUID (parsed from embed code or entered manually) | Event Details meta box on save |
| `_event_date` | Date string `YYYY-MM-DD` | Event Details meta box |
| `_event_time` | Time string `HH:MM` | Event Details meta box |
| `_event_end_time` | End time string `HH:MM` | Event Details meta box |
| `_event_location` | Plain text location | Event Details meta box |

Meta is saved in [`houseyou_save_event_details()`](functions.php:400) on the `save_post` hook.

---

### Action Network API sync

**API client:** [`inc/action-network-api.php`](inc/action-network-api.php)

- API key stored in WordPress option `houseyou_action_network_api_key` (set in WP Admin → Settings → Action Network Sync)
- Fetches event data from `https://actionnetwork.org/api/v2/events/{uuid}`
- Authenticates with `OSDI-API-Token` header
- 15-second timeout

**Admin JS:** [`assets/js/admin-event-sync.js`](assets/js/admin-event-sync.js) — powers the "Sync from Action Network" button in the Event Details meta box. Sends an AJAX request to pull event date/time/location from the API and populate the meta box fields.

---

### `[events_listing]` shortcode

**Registered in:** [`functions.php:458`](functions.php:458)

**Purpose:** Renders a grid of upcoming events for use on an events index page.

**How it works:**

1. Queries all published `page` post types with `_wp_page_template = an-events`
2. Filters to events where `_event_date >= today` (OR where `_event_date` does not exist)
3. Orders by `_event_date` ascending
4. Renders an `.events-grid` div containing `.event-card` links for each event

**Event card includes:** featured image, event title, date (📅), time range (🕐), location (📍), excerpt (15 words), and a "⚠ Date not set" warning if no date is stored.

**Usage:** Place `[events_listing]` in any page's content via the shortcode block.

**Attributes:**

| Attribute | Default | Effect |
|---|---|---|
| `limit` | `-1` (all) | Maximum number of events to show |
| `order` | `DESC` | Passed to `WP_Query` (note: query itself forces `ASC` by date — the attribute currently has no effect on ordering) |

---

### Home page letter action JS — `home-letter-action.js`

**File:** [`assets/js/home-letter-action.js`](assets/js/home-letter-action.js)

**Enqueued by:** [`houseyou_enqueue_home_letter_action()`](functions.php:97) on `wp_enqueue_scripts`, only when `is_front_page()` is true — i.e. only on the site front page.

**Target form:** The Action Network letter campaign `end-the-tax-breaks-and-fund-housing-first`, embedded directly in [`block-templates/home-2026.html`](block-templates/home-2026.html:52) via a raw `<script>` + `<div id="can-letter-area-end-the-tax-breaks-and-fund-housing-first">` block.

**Page guard:** The script opens with an IIFE early-exit check — if `#can-letter-area-end-the-tax-breaks-and-fund-housing-first` is not in the DOM it exits immediately. This prevents any effect on Action Network forms embedded on action template pages or anywhere else.

**What it does (in execution order):**

| Block | Target selector | Behaviour |
|---|---|---|
| 1 — Housing Demographic dropdown | `select#Housing-Demographic` | Converts first option to a disabled placeholder ("Your housing situation"), greys it out |
| 2 — Year of Birth placeholder | `input#Year-of-Birth-YYYY` | Adds `placeholder="Year of Birth (YYYY)"` |
| 3 — Step 2 header injection | `#can_letter_one_col` | Inserts an `h3` ("Step 2: Send a message to our politicians") and description `p` at the top of the letter-writing step; uses a `MutationObserver` because this element is dynamically revealed |
| 4 — Custom thank you page | `#can_embed_form.can_thank_you_wrap` | Replaces Action Network's thank you content with a custom Step 3 social sharing block (Instagram + Facebook); uses a `MutationObserver` |
| 5 — Submit button text | `#can_embed_form input[type="submit"]` | Overrides button label to "Have Your Say"; intercepts both attribute mutations and JS property setter so Action Network cannot revert it |
| 6 — Step 1 header + privacy disclaimer | `#form_col1`, `#d_sharing` | Inserts "Step 1: Join the movement" before form fields and a privacy disclaimer `p` after the opt-in checkbox |

**Timing pattern:** Blocks 1, 2, 5, and 6 use `setInterval` at 100 ms polling (max 5 seconds) because Action Network injects its DOM asynchronously. Blocks 3 and 4 use `MutationObserver` on `document.body` (childList, subtree, attributes) to react to the form's multi-step transitions.

**Social icon URLs (Block 4):**
- `https://houseyou.org/wp-content/uploads/2025/11/hy-insta-scaled.png`
- `https://houseyou.org/wp-content/uploads/2025/11/hy-fb2-scaled.png`

---

### AN Events embed JS — `action-event-embed.js`

**File:** [`assets/js/action-event-embed.js`](assets/js/action-event-embed.js)

**Enqueued by:** [`houseyou_enqueue_action_event_embed()`](functions.php:120) on `wp_enqueue_scripts`, only when `is_page_template( 'an-events' )` is true — i.e. only on individual event pages using the AN Events template.

**Target form:** Action Network RSVP/event widgets embedded via `[action_network_embed]` shortcode on `an-events` template pages.

**What it does:** After the Action Network widget loads, hides two elements that are not appropriate for the site's UX:

| Target | Selector | Action |
|---|---|---|
| Event date/location row | `#can_embed_form .last_line` | `display:none`, `visibility:hidden`, `height:0`, `overflow:hidden` |
| "Attend this event" heading | `#can_embed_form_inner > h4` (text match) | `display:none` |

**Timing:** 100 ms `setInterval` polling, max 10 seconds (longer than the letter script because event forms can be slower to initialise). Clears as soon as both elements are found.

---

## 9. Deployment Workflow

### Local development

- **Runtime:** [Local by Flywheel](https://localwp.com/) — runs WordPress locally on the development machine
- **Editor:** VS Code with the [SFTP extension](https://marketplace.visualstudio.com/items?itemName=Natizyskunk.sftp) (`.vscode/sftp.json` config — not committed to git)
- **On save:** The SFTP extension watches theme files and automatically uploads changed files to the WordPress.com Business **staging** site

### What syncs via SFTP

**Only theme files sync:**

```
/wp-content/themes/house-you/
  ├── assets/
  ├── block-template-parts/
  ├── block-templates/
  ├── inc/
  ├── patterns/
  ├── sass/
  ├── functions.php
  ├── style.css
  ├── theme.json
  └── ...
```

**What does NOT sync via SFTP:**

- WordPress database (pages, posts, menus, ACF field data, navigation blocks, options)
- Uploaded media files
- Plugin files
- WordPress core files

> **Critical caveat:** All database content — page content, navigation menus, ACF embed codes, event meta, site settings — lives on the **live/staging site only**. There is no local database that mirrors production. Do not attempt to push a local database to staging.

### Staging → Production

1. Make and test changes on the WordPress.com staging environment
2. Use the WordPress.com dashboard **"Push to production"** (or equivalent staging-to-live button) to promote the staging site to production
3. This copies both files and database from staging to production

### Workflow summary

```
Local VS Code
  ↓ (auto-upload on save via SFTP extension)
WordPress.com staging
  ↓ (manual push via WP.com dashboard)
WordPress.com production (live site)
```

---

## 10. Known Constraints and Gotchas

### 1. `theme.json` layout values exist in two places

```json
"settings.layout":        { "contentSize": "1160px", "wideSize": "1400px" }
"settings.custom.layout": { "contentSize": "1160px", "wideSize": "1400px" }
```

Both must be kept in sync. `settings.layout` controls the actual block layout constraints. `settings.custom.layout` generates CSS custom properties (`--wp--custom--layout--content-size`, `--wp--custom--layout--wide-size`) that may be referenced elsewhere.

---

### 2. `useRootPaddingAwareAlignments` and `.wp-site-blocks`

With `useRootPaddingAwareAlignments: true`, WordPress applies root padding to `.wp-site-blocks`. Do not add `padding: 0` or `margin: 0` to `.wp-site-blocks` in the CSS — this would nullify the root padding system and break consistent side margins.

The current `.wp-site-blocks` rule in `sass/theme.scss` only sets `width: 100%` and `max-width: 100%`.

---

### 3. `[action_network_embed]` shortcode uses `get_post_meta()`, not ACF

The `[action_network_embed]` shortcode reads embed code directly from post meta via `get_post_meta()`, not ACF's `get_field()`. This means it does not depend on ACF being active and does not require the `acf/shortcode/allow_in_block_themes_outside_content` filter.

---

### 4. Navigation refs are database-specific

The footer navigation blocks reference menus by database ID (`ref: 2063`, `ref: 2064`). These IDs exist on the live/staging database only. On any fresh WordPress install or local environment with a different database, these refs point to nothing and the footer nav renders empty. Menus must be recreated and re-referenced in the Site Editor on each environment.

---

### 5. Event sync: widget slug ≠ API event ID

The "Sync from Action Network" button in the Event Details meta box does not currently work. The embed script URL contains a human-readable **slug** (e.g. `housing-rally-lismore`), but the API endpoint (`/api/v2/events/{id}`) requires a **UUID** (e.g. `abc12345-def6-7890-ghij-klmnopqrstuv`). The parse function extracts the slug, sends it to the API, and gets a 500 error.

**Future fix options:**
- Add a separate text input for the API event UUID (used only for sync, not display)
- Add an API lookup step that lists events and matches by title/date to resolve the UUID
- Fetch the event list once and cache a slug→UUID mapping

The embed display itself works fine without sync — date/time/location can be entered manually.

---

## Changelog

### 2026-03-10 — Layout migration to `useRootPaddingAwareAlignments`

**What:** Complete layout architecture overhaul. Replaced all legacy CSS hacks (100vw breakouts, negative margins, TwentyTwentyTwo alignment workarounds, `overflow-x: hidden`) with WordPress's native `useRootPaddingAwareAlignments` system.

**Key changes:**
- ~130 lines of CSS hacks deleted from `sass/theme.scss`
- All hardcoded `40px` padding values converted to `var(--wp--custom--spacing--outer)`
- `theme.json` layout updated: `contentSize: 1160px`, `wideSize: 1400px`
- `home-2026.html` sections converted from `.full-width-homepage` CSS hack to native `alignfull`
- Template margins removed from `page.html`, `contact-us.html`; `contentSize: 100%` removed from `an-events.html`, `action.html`
- White backgrounds restored/added to `page.html`, `contact-us.html`, `an-events.html`, `action.html` outer wrappers

**Full details:** [plans/layout-migration-completed.md](plans/layout-migration-completed.md)

---

### 2026-02-26 — Black bar fix (superseded by 2026-03-10 migration)

**Problem:** A black/dark strip appeared on the right side of every page, caused by `100vw` (which includes scrollbar width) creating horizontal overflow.

**Solution applied at the time:** Added `overflow-x: hidden` to clip the overflow. This was a workaround for the 100vw hack.

**Status:** This fix is no longer present. The root cause (100vw hacks) was eliminated in the 2026-03-10 layout migration, making `overflow-x: hidden` unnecessary.
## Action Network Embed Styling

### Overview

The Action Network embed (`#can_embed_form`) is injected via AN's own JavaScript
from `actionnetwork.org`. It loads two external resources that cannot be controlled
via WordPress:

- `style-embed-v3.css` — AN's full stylesheet, loaded as an external file
- Dynamic `<style>` blocks — injected into the DOM by AN's embed JS after page
  load, containing `!important` rules for layout-critical properties like column
  widths and floats

### The Cascade Problem

AN's stylesheet loads at position ~49 in the stylesheet order, after `theme.css`
at position 34. More critically, AN injects `<style>` blocks dynamically via
JavaScript after all external stylesheets have loaded. This means:

- CSS specificity alone cannot win — even 3-ID selectors with `!important` lose
  to AN's dynamically injected `<style>` blocks because source order decides ties
  and AN's blocks always arrive later
- The only mechanism that reliably beats dynamically injected styles is JavaScript
  inline styles set via `element.style.setProperty('property', 'value', 'important')`

### Our Approach

**1. CSS reset on the embed container**

At the top of the Action Network section in `assets/theme.css`:
```css
#can_embed_form,
#can_embed_form * {
  all: unset;
}
```

This nullifies `style-embed-v3.css` entirely. All visual styling of the form
comes from our custom rules below the reset. Note that `all: unset` removes
default browser display values so `display` must be explicitly declared on
block elements.

**2. JavaScript inline style overrides for layout-critical properties**

`assets/js/action-template-embed.js` contains a polling block (100ms interval,
5s max) that waits for `#form_col1` and `#form_col2` to appear in the DOM, then
applies inline `!important` styles:
```javascript
col1.style.setProperty('width',   '100%', 'important');
col1.style.setProperty('float',   'none', 'important');
col1.style.setProperty('display', 'flex', 'important');
col2.style.setProperty('width',   '100%', 'important');
col2.style.setProperty('float',   'none', 'important');
col2.style.setProperty('clear',   'both', 'important');
```

Elements are marked with `data-col-fixed` after processing to prevent re-running.
This pattern should be used for any other AN properties that CSS cannot reliably
override.

**3. Checkbox appearance**

After `all: unset`, checkboxes lose their native rendering. Restored with:
```css
#can_embed_form input[type="checkbox"] {
  appearance: checkbox !important;
  -webkit-appearance: checkbox !important;
  -moz-appearance: checkbox !important;
  width: auto !important;
  height: auto !important;
}
```

### Key Rules for Future AN Styling Work

1. Write all AN styles scoped under `#can_embed_form` — the reset means nothing
   leaks in or out
2. If a CSS rule isn't sticking, AN is probably injecting it dynamically — use
   `setProperty` in `action-template-embed.js` instead
3. Always check which stylesheet is winning using the cascade checker console
   script before spending time on specificity battles
4. The polling pattern in `action-template-embed.js` is the established pattern
   for JS overrides — follow it for consistency

### Staging Test Mode

`functions.php` contains a conditional that runs only on `wpcomstaging.com` URLs.
It strips required field validation and intercepts form submission so the form
can be tested visually without sending data to Action Network.