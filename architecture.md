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

The theme uses a **three-tier layout system** to achieve full-viewport-width coloured backgrounds while keeping content readable at a constrained width.

### Tier 1 — Full-width background sections

Two techniques are used depending on context:

#### `.full-width-homepage` (used in `action.html`, `an-events.html`, `home.html` variants)

```css
.full-width-homepage {
  width: 100vw !important;
  position: relative;
  left: 50%;
  margin-left: -50vw !important;
  right: 50%;
  margin-right: -50vw !important;
}
```

Additional rules prevent margin collapse at first/last child positions:

```css
main .full-width-homepage:first-child { margin-top: 0 !important; }
main .full-width-homepage:last-child  { margin-bottom: 0 !important; }
```

#### `.wp-block-group.is-style-full-width` (block style variation — usable on any Group block)

```css
.wp-block-group.is-style-full-width {
  width: 100vw !important;
  position: relative;
  left: 50%;
  margin-left: -50vw !important;
  right: 50%;
  margin-right: -50vw !important;
}
```

> **Critical**: `100vw` here is intentional. It includes scrollbar width, which is why `overflow-x: hidden` is set on `html, body`. Do NOT replace with `100%` — that resolves to the parent container width, not the viewport width, and breaks the layout. See [Section 10](#10-known-constraints-and-gotchas).

### Tier 2 — Constrained content

Content inside full-width sections is constrained and centred:

```css
/* Direct children of full-width sections */
.full-width-homepage .wp-block-columns,
.full-width-homepage > .wp-block-heading,
.full-width-homepage > .wp-block-paragraph,
.full-width-homepage > .petition-row,
.full-width-homepage > .content-container {
  max-width: 1800px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

/* .content-container class (used in footer, other sections) */
.content-container {
  max-width: 1800px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

/* is-style-full-width children */
.wp-block-group.is-style-full-width > * {
  max-width: 1800px;
  margin-left: auto;
  margin-right: auto;
}
```

### Tier 3 — Responsive padding

All constrained content gets horizontal padding, switching at the 769px breakpoint:

```css
/* Mobile: 20px */
.content-container { padding-left: 20px !important; padding-right: 20px !important; }
.full-width-homepage .wp-block-columns,
.full-width-homepage > .wp-block-heading, /* etc */ { padding-left: 20px; padding-right: 20px; }
.wp-block-group.is-style-full-width > * { padding-left: 20px; padding-right: 20px; }

/* Desktop (≥769px): 40px */
@media (min-width: 769px) {
  .content-container { padding-left: 40px !important; padding-right: 40px !important; }
  /* same for other constrained selectors */
}
```

### Key layout classes reference

| Class | Where applied | Effect |
|---|---|---|
| `.full-width-homepage` | `wp:group` in action/event/home templates | Full-viewport-width section using 100vw + negative margins |
| `.content-container` | `wp:columns` or `wp:group` inside full-width sections; footer columns | Constrains to 1800px, centred, responsive padding |
| `.content-section` | `wp:group` wrapping standard content | Adds vertical padding (40px mobile, 60px desktop) |
| `.header-columns` | `wp:columns` inside header group | Two-column layout for logo + nav |
| `.home-block` | `wp:columns` and `wp:column` in action/event templates | Removes default padding; enables custom column layout |
| `.is-style-full-width` | Any `wp:group` block (block style variation) | Same full-width 100vw breakout as `.full-width-homepage` |
| `.pre-footer` | Outer `wp:group` in footer | Identifies footer region for CSS scoping |
| `.site-main` | Outer `wp:group` in action/event templates | Constrained layout wrapper around full-width content |

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
| Desktop | `min-width: 769px` | Padding switches 20px → 40px; columns stack/unstack; social icons display |

### Block style variations

Registered via [`houseyou_register_block_styles()`](functions.php:779) on the `init` hook. Applied to both `core/group` and `core/cover` blocks (except `is-style-full-width` which is group-only).

| Style slug | Class | Background | Text | Use when |
|---|---|---|---|---|
| `dark-section` | `is-style-dark-section` | `#141414` (ash-grey) | `#FFFFFF` (white) | Dark band/section across the page |
| `light-section` | `is-style-light-section` | `#FFFFFF` (white) | `#141414` (ash-grey) | Explicit white section against a dark page |
| `pink-section` | `is-style-pink-section` | `#CB1EAA` (house-you-pink) | `#FFFFFF` (white) | Brand-coloured highlight section |
| `full-width` | `is-style-full-width` | _(inherits)_ | _(inherits)_ | Break a Group block out to full viewport width |

**How to use a block style**: In the block editor, select a Group or Cover block → Styles panel → choose the variation. The CSS rules apply `!important` to override any inline colours set on the block.

**Editor preview**: `is-style-full-width` renders with a pink left border and a "Full Width" label in the editor (via `::before`) so the breakout is visible at editing time.

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

The outer `wp:group` has `align: full` (`alignfull` class) and `backgroundColor: ash-grey`. In a block theme, `alignfull` on a group inside the site header area stretches it to 100% width. No `100vw` technique is needed for the header because the template part sits outside the constrained content area — WordPress renders template parts at full width by default.

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

Same `alignfull` technique as the header. The `.content-container` class on the inner columns/group constrains the content to `max-width: 1800px` with `margin: 0 auto` and responsive padding.

**Navigations:** Two separate navigation blocks by database ref ID. `ref: 2063` = footer links (left column); `ref: 2064` = secondary/social links (right column). These refs point to Navigation post objects in the database — they exist on the live site only.

---

## 6. Templates — Detail

### `index.html` — Final fallback

WordPress uses this if no more specific template matches. Contains header, a basic post query loop, and footer. Rarely displayed in production since `page.html` and `single.html` handle the common cases.

---

### `page.html` — Standard pages

Used for all pages not assigned a custom template. Contains header, `wp:post-title`, `wp:post-featured-image` (full-width), `wp:post-content`, and footer. The post content area is where the page editor content appears.

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

A separate homepage layout for 2026 campaign content. Selectable as a custom template via the page editor. Structure mirrors `home.html` but with different pattern references or inline content.

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

### 1. `overflow-x: hidden` on `html, body`

```css
html, body {
  overflow-x: hidden;
}
```

**Why it's there:** The `100vw` unit used in full-width sections includes scrollbar width (typically 15–17px). When a vertical scrollbar is present, elements with `width: 100vw` extend ~15px beyond the right edge of the visible area, creating horizontal overflow and a visible dark strip from the body background. `overflow-x: hidden` clips this overflow.

**Do not remove** this rule unless the 100vw full-width technique is also removed.

---

### 2. `theme.json` layout values are intentionally narrow

```json
"layout": {
  "contentSize": "684px",
  "wideSize": "1160px"
}
```

These values exist in **two places** in [`theme.json`](theme.json:257): `settings.layout` and `settings.custom.layout`. They are deliberately left narrow.

**Why:** WordPress uses these values to constrain block editor content in the editor preview (the editing canvas). The theme's actual content width of 1800px is applied by custom CSS, not by these values. Changing them would alter the editor canvas width and could break the editing experience.

**The custom CSS override:**

```css
.is-layout-constrained {
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
```

This overrides WordPress's runtime application of `contentSize` to the site wrapper, allowing the theme's own max-width constraints to take effect.

**Do not change** `contentSize` or `wideSize` in `theme.json` without understanding and testing the full visual impact in both the editor and the frontend.

---

### 3. Do NOT replace `100vw` with `100%`

The full-width technique uses `width: 100vw` with `margin-left: -50vw`. This is intentional.

- `100vw` = full viewport width (including scrollbar area)
- `100%` = 100% of the **parent element's** width

Replacing `100vw` with `100%` makes full-width sections as wide as their container — which is already constrained — and breaks the breakout effect entirely.

The scrollbar overflow side-effect of `100vw` is managed by `overflow-x: hidden` (see constraint 1 above).

---

### 4. ACF shortcodes in block themes require an explicit filter

ACF shortcodes (`[acf field="..."]` or custom shortcodes that use `get_field()`) do not render inside FSE block templates by default. The theme enables this with:

```php
add_filter( 'acf/shortcode/allow_in_block_themes_outside_content', '__return_true' );
```

This filter is set in [`functions.php:872`](functions.php:872). Without it, `[action_network_embed]` would return empty on all action and event pages.

---

### 5. Navigation refs are database-specific

The footer navigation blocks reference menus by database ID (`ref: 2063`, `ref: 2064`). These IDs exist on the live/staging database only. On any fresh WordPress install or local environment with a different database, these refs point to nothing and the footer nav renders empty. Menus must be recreated and re-referenced in the Site Editor on each environment.

---

## Changelog

### 2026-02-26 — Black bar fix

**Problem:** A black/dark strip appeared on the right side of every page, caused by `100vw` (which includes scrollbar width) creating horizontal overflow.

**Solution applied:**

1. Added `overflow-x: hidden` to `html, body` in [`assets/theme.css`](assets/theme.css)
2. Added `body { background-color: var(--wp--preset--color--white) !important }` to prevent body background showing in overflow area
3. Added `.wp-site-blocks { width: 100%; max-width: 100% }` to ensure site container fills viewport
4. Added `.is-layout-constrained { max-width: 100% !important }` to override WordPress's automatic layout constraint on the site wrapper

**Note:** The `100vw` values themselves were NOT changed — the technique is intentional. The overflow is clipped instead.
