# House You WordPress Theme

## Project Context
Custom WordPress theme for houseyou.org - a housing justice advocacy organisation in the Northern Rivers region of NSW, Australia. The site advocates for housing policy reform and community action.

This theme is a **renamed copy of the Skatepark theme** (not a child theme). Following WordPress conventions:
- **Text domain:** `house-you` (matches folder name, uses hyphens)
- **Function prefix:** `houseyou_` (uses underscores - PHP doesn't allow hyphens in function names)
- **CSS classes:** Use `house-you-` or `.hy-` prefix (hyphens)

## Development Environment
- **Local development:** Local by Flywheel
- **Live hosting:** WordPress.com Business plan
- **Local URL:** houseyou-local.local
- **Live URL:** https://houseyou.org
- **Theme location:** /wp-content/themes/house-you

## Theme Type
WordPress Block Theme (Full Site Editing / FSE)
- Standalone theme (no parent/child relationship — no `Template:` line in style.css)
- Uses block template parts for header and footer
- 9 block templates
- 10 block patterns
- Block-based content editing

**Editor Used:**
- **Block Editor (Gutenberg)** for editing pages/posts
- Gutenberg plugin installed (provides experimental features)
- Post Editor loads CSS via `add_editor_style()` in `functions.php`

---

## File Structure

```
house-you/
├── assets/
│   ├── fonts/
│   │   ├── red-hat-display-500.woff2
│   │   ├── red-hat-display-500italic.woff2
│   │   ├── red-hat-display-700.woff2
│   │   ├── red-hat-display-700italic.woff2
│   │   ├── red-hat-display-900.woff2
│   │   ├── red-hat-display-900italic.woff2
│   │   ├── red-hat-display-italic.woff2
│   │   └── red-hat-display-regular.woff2
│   ├── images/
│   │   ├── riding-skateboard.jpeg
│   │   ├── skateboard-sideways.jpg
│   │   └── skatepark.jpg
│   ├── svg/
│   │   ├── post-category.svg
│   │   ├── post-date.svg
│   │   └── post-tag.svg
│   ├── theme.css          ← compiled CSS (230 lines)
│   └── theme.css.map      ← source map
├── block-template-parts/
│   ├── footer.html
│   └── header.html
├── block-templates/
│   ├── 404.html
│   ├── archive.html
│   ├── blank.html
│   ├── header-footer-only.html
│   ├── home.html
│   ├── index.html
│   ├── page.html
│   ├── search.html
│   └── single.html
├── inc/
│   ├── action-network-api.php  ← Action Network API client
│   └── headstart/
│       └── en.json
├── languages/
│   └── (empty - translations removed)
├── patterns/
│   ├── blog-posts.php
│   ├── columns-in-container.php
│   ├── full-width-image-with-aside-caption.php
│   ├── hidden-404.php
│   ├── hidden-home-patterns.php
│   ├── mixed-media-in-container.php
│   ├── paragraph-with-quote.php
│   ├── testimonial.php
│   ├── text-list-with-button.php
│   └── three-columns.php
├── sass/
│   └── theme.scss          ← source SCSS (264 lines)
├── CLAUDE.md
├── functions.php
├── index.php               ← intentionally blank (block theme)
├── package.json            ← build tools (sass, postcss, autoprefixer)
├── readme.txt
├── screenshot.png
├── style.css               ← theme metadata ONLY (7 lines) ✓ Modern practice
└── theme.json              ← design tokens, typography, colors, spacing
```

**39 files total. No JavaScript files exist in the theme.**

**CSS Architecture:**
All custom CSS consolidated in `sass/theme.scss` → compiles to `assets/theme.css` (~1460 lines). Follows modern block theme best practice.

---

## CSS Architecture

### Where CSS Lives
1. **`style.css`** — Theme metadata header only (7 lines, no CSS rules)
   - Follows modern block theme best practice
   - Theme Name, URI, Author, Description, Version
2. **`assets/theme.css`** — **ALL theme CSS** compiled from `sass/theme.scss` (~1460 lines total):
   - **Base theme styles** (264 lines):
     - Text selection, link hover states
     - Post title styling, separators
     - Button hover states
     - Search/file block fixes
     - Comment form styling
     - Full-width alignment system
     - Responsive navigation padding
   - **Custom House You styles** (~1200 lines):
     - Custom container system (1800px max-width)
     - Layout & full-width sections
     - Typography (Inter & League Spartan fonts)
     - Hero sections & page blocks
     - Navigation & Mega Menu styling
     - Social icons
     - Action Network form styling (letter campaigns & RSVP)
     - Visibility helpers (.hide-on-mobile, .hide-on-desktop)
3. **`theme.json`** — Design tokens and block-level styling:
   - Colors: 11-color House You brand palette (Ash Grey, House You Pink, etc.)
   - Layout: contentSize 684px, wideSize 1160px
   - Typography, spacing, button styles, form styles

### Build Process
- **Source:** `sass/theme.scss` (all CSS lives here)
- **Output:** `assets/theme.css` (compiled CSS)
- **Command:** `npm run build`
- **Process:** SCSS → CSS via sass compiler → PostCSS with autoprefixer
- **Source maps:** Generated automatically
- **Note:** Run `npm install` first if dependencies not installed

---

## Typography System (Actual)

### Font
- **All text:** Red Hat Display (weights: 400, 500, 700, 900 with italic variants)
- Loaded via `@font-face` inline styles in `functions.php`
- Regular and bold weights preloaded via `<link rel="preload">`

### Heading Sizes (from theme.json)
- **H1:** `min(max(3rem, 7vw), 4.5rem)` — weight 700
- **H2:** `min(max(2.25rem, 5vw), 4rem)` — weight 900
- **H3:** `min(max(1.875rem, 5vw), 3rem)` — weight 900
- **H4:** `1.25rem` (normal custom size) — weight 900, uppercase
- **H5:** `1rem` (small) — weight 900, uppercase
- **H6:** `0.875rem` (x-small) — weight 900, uppercase

### Font Sizes (from theme.json)
- Small: 1rem
- Medium: 1.5rem
- Large: responsive min/max (~1.75rem–2.25rem)
- Extra Large: responsive min/max (~2.25rem–3rem)
- Normal (custom): 1.25rem
- X-Small (custom): 0.875rem

---

## Layout System (Actual)

### Content Widths (from theme.json)
- **contentSize:** 684px
- **wideSize:** 1160px

### Spacing (from theme.json)
- **Outer:** `min(4vw, 90px)`
- **Small:** `clamp(20px, 4vw, 40px)`
- **Medium:** `clamp(30px, 8vw, 100px)`
- **Large:** `clamp(100px, 12vw, 460px)`

### Full-Width Alignment
- Uses negative margin technique in `assets/theme.css`
- `margin-left/right: calc(-1 * var(--wp--custom--spacing--outer))`
- Applied to `.alignfull`, `.has-background` groups, covers

---

## functions.php Summary

All functions use the `houseyou_` prefix.

### Core Theme Functions

| Function | Hook | Purpose |
|---|---|---|
| `houseyou_add_featured_image_class()` | `body_class` | Adds `has-featured-image` body class |
| `houseyou_support()` | `after_setup_theme` | Block styles, editor styles, translations |
| `houseyou_styles()` | `wp_enqueue_scripts` | Enqueues `assets/theme.css` + inline font-face |
| `houseyou_editor_styles()` | `admin_init` | Adds theme CSS + fonts to block editor |
| `houseyou_get_font_face_styles()` | (helper) | Returns @font-face CSS for 8 Red Hat Display variants |
| `houseyou_preload_webfonts()` | `wp_head` | Preloads regular + bold font files |
| `houseyou_register_block_pattern_categories()` | `init` | Registers: featured, columns, images, text, query |
| `houseyou_register_block_styles()` | `init` | Registers custom block styles (Dark/Light/Pink/Full Width sections) |

### Action Network Integration

| Function | Hook | Purpose |
|---|---|---|
| `houseyou_action_network_embed_shortcode()` | shortcode | `[action_network_embed]` - displays ACF embed code |
| `houseyou_event_meta_boxes()` | `add_meta_boxes` | Registers Event Details meta box |
| `houseyou_event_details_callback()` | (meta box) | Renders Event Details UI with sync button |
| `houseyou_save_event_details()` | `save_post` | Saves event date/time/location fields |
| `houseyou_enqueue_event_sync_scripts()` | `admin_enqueue_scripts` | Inline JS for AJAX sync button |
| `houseyou_ajax_sync_event()` | `wp_ajax` | AJAX handler for sync requests |
| `houseyou_an_add_settings_page()` | `admin_menu` | Adds Settings → Action Network Sync page |
| `houseyou_an_register_settings()` | `admin_init` | Registers API key setting |
| `houseyou_an_settings_page()` | (admin page) | Renders settings page UI |
| `houseyou_events_listing_shortcode()` | shortcode | `[events_listing]` - displays grid of upcoming events |

**API Functions:** See `inc/action-network-api.php` for API client functions (`houseyou_an_get_event()`, `houseyou_an_parse_event_id()`, `houseyou_an_sync_event()`, etc.)

---

## Action Network Integration

**Unified Workflow:** Single ACF field (`action_embed_code`) serves dual purpose:
1. Displays Action Network form via `[action_network_embed]` shortcode
2. Auto-detected by Event Details meta box for syncing event data from API

**CSS:** Action Network form styling exists in Simple Custom CSS plugin or WPCode snippets (not in theme files).

### Action Network API v2 - Capabilities & Limitations

**Authentication:**
- Requires API key (obtained by becoming a partner)
- Key sent via header: `OSDI-API-Token: your_api_key_here`
- Keys provide full account access - must be kept secret

**Rate Limits:**
- Maximum 4 API calls per second (~14,400/hour)
- Message operations: POST/PUT once every 30 seconds only
- Recommended: Queue calls, use exponential backoff on failures

**Events Endpoint (`/api/v2/events`):**

*Available Read Fields:*
- Basic: `title`, `name`, `description`, `instructions`
- DateTime: `start_date`, `end_date` (local timezone assumed)
- Location: `venue`, `address_lines`, `locality`, `region`, `postal_code`, `country`
- Metadata: `status`, `visibility`, `capacity`, `total_accepted` (RSVP count)
- Media: `featured_image_url`, `browser_url`
- System: `identifiers`, `created_date`, `modified_date`, `origin_system`

*Writable Fields:*
- Can POST/PUT: `title` (required), `description`, `instructions`, `start_date`, `end_date`, location fields, `origin_system`
- Cannot modify: `total_accepted`, `status`, `visibility`, `capacity`, system timestamps

*Filtering & Querying:*
- Supports OData syntax: `?filter=field_name operator 'value'`
- Operators: `eq` (equals), `gt` (greater than), `lt` (less than)
- Can filter by: `modified_date`, `created_date`, `start_date`, `end_date`, `identifier`, `title`, `origin_system`
- Example: `?filter=modified_date gt '2025-02-05'` (fetch only events changed since date)
- **Enables efficient incremental syncs** - only fetch events modified since last sync

*Key Limitations:*
- **API-created events lack dashboard visibility** - no manage page, no autoresponses, no reminders
- **Cannot delete events** via API
- Events need ≥1 attendance to appear in targeting interfaces
- Not intended for building replacement UIs

**Attendances Endpoint (`/api/v2/events/[id]/attendances`):**
- Read: All attendance records (RSVPs) for an event
- Write: Can POST new RSVPs (1 per person per event)
- Cannot: Delete attendances, trigger autoresponses, modify status
- Each RSVP auto-subscribes person to associated lists

**Practical Implications for Event Sync:**
- ✓ Can read event date, time, location from API
- ✓ Can fetch RSVP counts (`total_accepted`)
- ✓ Can retrieve featured image URLs
- ✓ **Can filter by `modified_date` for efficient incremental syncs** (only fetch changed events)
- ✓ Can filter upcoming events: `?filter=start_date gt '2025-02-05'`
- ✗ Cannot detect event cancellations programmatically (status is read-only)
- ✗ API-created events won't show in AN dashboard
- ⚠ Use Action Network as source of truth, WordPress displays synced data

### Event Sync Implementation

**Status:** ✓ Phase 1 + 2 (Manual Sync + Auto-Detection) implemented

**How to Use (Unified Workflow):**
1. **Initial Setup:** Go to Settings → Action Network Sync and enter your API key
2. **Create/Edit Event Page:**
   - Create page with "AN Events" template
   - Add Action Network embed code to ACF field `action_embed_code`
   - Add `[action_network_embed]` shortcode where you want the form to appear
3. **Automatic Integration:**
   - Event ID is **auto-detected** from embed code (no duplicate entry)
   - Event Details meta box shows "✓ Action Network Event Detected"
4. **Sync Event Data:**
   - Click "🔄 Sync from Action Network" in Event Details sidebar
   - Date, time, end time, and location auto-populate
   - Save the page

**Result:** One ACF field powers both the embedded form display AND event metadata sync.

**Files:**
- `inc/action-network-api.php` - API client functions
- `functions.php` - Shortcode, meta box, AJAX handler, settings page

**Features:**
- ✓ **Single ACF field for everything** (embed display + data sync)
- ✓ `[action_network_embed]` shortcode in theme (replaces Code Snippets JS)
- ✓ Auto-detects event ID from ACF embed code
- ✓ Manual one-click sync per event
- ✓ Parses event ID from embed scripts, URLs, or raw IDs
- ✓ Timezone conversion (UTC → WordPress timezone)
- ✓ Shows last sync timestamp
- ✓ Error handling with clear messages
- ✓ Fallback to manual event ID entry if ACF field is empty

### Events Listing Shortcode

**Location:** `functions.php` → `houseyou_events_listing_shortcode()` (line ~458)

**Usage:** `[events_listing]`

**Purpose:** Displays a grid of upcoming event pages (pages using the "AN Events" template).

**Output:**
- Queries all published pages using the `an-events` template
- Filters to only show events with `_event_date` >= today (or no date set)
- Outputs a clean grid with no inline styles or wrapper containers

**CSS Classes (for styling):**
| Class | Element |
|---|---|
| `.events-grid` | Grid container wrapping all event cards |
| `.event-card-link` | Link wrapper around each card |
| `.event-card` | Individual event card container |
| `.event-image` | Featured image container |
| `.event-warning` | "Date not set" warning |
| `.event-title` | Event title (h3) |
| `.event-meta` | Meta info container (date/time/location) |
| `.event-date` | Event date display |
| `.event-time` | Event time display |
| `.event-location` | Event location display |
| `.event-excerpt` | Event excerpt text |
| `.events-no-events` | "No upcoming events" message |

**Note:** No inline styles or background colors are applied. Style via `sass/theme.scss` or the block editor.

**Future Enhancements (Phase 3-4):**
- Scheduled auto-sync (WP-Cron every 6 hours)
- Bulk "Sync All Events" action
- Featured image import from Action Network
- Sync log/history

---

## Colour Palette (from theme.json)

| Name | Hex | RGB | Usage |
|---|---|---|---|
| Ash Grey Background | `#2D2A2E` | rgb(45, 42, 46) | Text, borders (primary) |
| House You Pink | `#CB1EAA` | rgb(203, 30, 170) | Buttons, accents (secondary) |
| White | `#FFFFFF` | rgb(255, 255, 255) | Page background |
| Hot Pink | `#E64BC8` | rgb(230, 75, 200) | Accent color |
| Orange | `#FB903A` | rgb(251, 144, 58) | Accent color |
| Light Pink | `#FFDAF1` | rgb(255, 218, 241) | Accent color |
| Lime Green | `#6DF2B3` | rgb(109, 242, 179) | Accent color |
| Purple | `#5B2B5F` | rgb(91, 43, 95) | Accent color |
| Logo Blue | `#05FBFD` | rgb(5, 251, 253) | Brand color (tertiary) |
| Blue | `#7DD8E6` | rgb(125, 216, 230) | Accent color |
| Peppermint Sky Blue | `#8BDFED` | rgb(139, 223, 237) | Accent color |

**Duotone filters:** default (black/green), white, red, blue, blue-cream, green-pink (available but not applied by default).

---

## Block Templates

| Template | Purpose |
|---|---|
| `index.html` | Default/fallback |
| `home.html` | Homepage |
| `page.html` | Static pages |
| `single.html` | Single posts |
| `archive.html` | Archive pages |
| `search.html` | Search results |
| `404.html` | Not found page |
| `blank.html` | No header/footer |
| `header-footer-only.html` | Header + footer, empty body |

---

## Block Styles (Color Presets)

**Custom block styles registered for one-click color schemes:**

Applied to `core/group` blocks via Styles panel in block editor:

| Style Name | Background | Text Color | Usage |
|---|---|---|---|
| **Dark Section** | Ash Grey (#2D2A2E) | White | Default dark sections |
| **Light Section** | White | Ash Grey | Light/clean sections |
| **Pink Section** | House You Pink (#CB1EAA) | White | Branded sections |
| **Full Width** | (inherited) | (inherited) | Breaks out of container to full viewport width |

**How to Use:**
1. Add a Group block
2. In block settings sidebar → Styles panel
3. Select "Dark Section", "Light Section", "Pink Section", or "Full Width"
4. Colors apply automatically in both editor and front-end

**Code Location:**
- Registration: `functions.php` → `houseyou_register_block_styles()`
- Styling: `sass/theme.scss` → "BLOCK STYLES - COLOR PRESETS" section

---

## Known Issues / Cleanup Needed

### Recently Fixed (Feb 2026)
- ✅ Function naming standardized to `houseyou_` prefix
- ✅ Pattern slugs updated from `skatepark/*` to `house-you/*`
- ✅ Block styles (Dark/Light/Pink Section) now work correctly with CSS variables
- ✅ Header full-width background matches footer
- ✅ Gap between sections removed
- ✅ Events listing CSS moved from inline to stylesheet
- ✅ Admin JS externalized to `assets/js/admin-event-sync.js`
- ✅ Date i18n fixed using `date_i18n()`

## Non-urgent cleanup
1. **Custom templates stored in database** — Custom templates (Homepage, Contact Us, PETITIONS, etc.) are currently stored in the database as custom `wp_template` posts. Eventually migrate these to theme files (`block-templates/*.html`) for version control and easier deployment.
2. **Scheduled auto-sync** — Manual sync with auto-detection is implemented. Future enhancement: Add WP-Cron scheduled sync to automatically update all events every 6 hours.
3. **Featured image auto-import** — Sync currently pulls date/time/location. Could also import `featured_image_url` from Action Network to WordPress media library.
4. **Bulk sync action** — Add "Sync All Events" button to sync all event pages at once.


---

## Active Plugins

### Navigation & Menus
- Max Mega Menu

### Forms
- Fluent Forms
- Contact Form 7
- Contact Form 7 Multi-Step Forms
- Ultra Addons for Contact Form 7
- Jetpack (includes contact forms)

### Integrations
- Action Network (provides embed codes as shortcodes)
- Form Integration for Action Network and Contact Form 7
- FluentCRM (email marketing)
- FluentSMTP (email delivery)

### Content Management
- Advanced Custom Fields (ACF)
- Custom Post Type UI
- Gutenberg (block editor)

### Media & Files
- FileBird Lite (media organization)
- SVG Support

### Customization
- Simple Custom CSS (migrated to theme - plugin can be removed)
- WPCode Lite (code snippets)
- Fonts Plugin (Google Fonts, Adobe Fonts)
- Preserved HTML Editor Markup Plus

### Utilities
- Redirection (301 redirects)
- Akismet (spam protection)
- Layout Grid
- Meta Field Block

---

## Breakpoints
- **Mobile:** ≤768px
- **Desktop:** ≥769px

---

## WordPress Coding Standards

### General Rules
- Follow WordPress Coding Standards
- Mobile-first approach
- Maintain current layout system
- Don't break existing functionality
- Test responsive behaviour at 768px breakpoint
- Use semantic HTML5 markup
- Maintain accessibility standards

### Files to Never Modify
- WordPress core files
- Plugin files

### All Customizations Go In
- This theme's files only
- `style.css` for CSS (after metadata header)
- `assets/theme.css` (compiled from `sass/theme.scss`) for existing CSS
- `functions.php` for PHP/JavaScript enqueuing
- Block templates and template parts for structure
- `theme.json` for design tokens and block settings

---

## Testing Checklist

When making changes:
1. Always work locally first
2. Test on local site (houseyou-local.local)
3. Check both mobile (≤768px) and desktop (≥769px) views
4. Verify forms still work (Fluent Forms, Contact Form 7)
5. Check navigation on mobile (hamburger menu)
6. Test Action Network embeds still display correctly
7. Check header/footer alignment with body content
8. Then deploy to staging
9. Finally push to live
