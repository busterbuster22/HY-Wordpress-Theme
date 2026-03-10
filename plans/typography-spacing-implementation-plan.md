# Typography & Spacing Implementation Plan
## Handoff Document for Code Execution

**Strategic Decision:**
- **Headings:** League Spartan
- **Body/Paragraphs:** Glacial Indifference

---

## Phase 1: Font Loading & Assets

### Step 1.1: Audit Current Font Assets

**Finding:** The theme currently only hosts Red Hat Display fonts locally in `assets/fonts/`. League Spartan is loaded via Google Fonts import. Glacial Indifference source is unknown (possibly WordPress.com or external plugin).

**Files to check:**
- `assets/fonts/` - Currently contains only Red Hat Display woff2 files

### Step 1.2: Download Required Font Files

**Action:** Download and add the following fonts to `assets/fonts/`:

**League Spartan (Required for Headings):**
- `league-spartan-400.woff2` (Regular)
- `league-spartan-500.woff2` (Medium)
- `league-spartan-600.woff2` (SemiBold)
- `league-spartan-700.woff2` (Bold)

**Glacial Indifference (Required for Body):**
- `glacial-indifference-regular.woff2`
- `glacial-indifference-italic.woff2`
- `glacial-indifference-bold.woff2`

**Source:** 
- League Spartan: https://fonts.google.com/specimen/League+Spartan
- Glacial Indifference: https://www.fontsquirrel.com/fonts/glacial-indifference (free for commercial use)

### Step 1.3: Update functions.php Font Face Declarations

**File:** `functions.php`
**Location:** Lines 198-265 (inside `houseyou_get_font_face_styles()` function)

**Add after line 265 (before the closing quote and semicolon):**

```php
		@font-face{
			font-family: 'League Spartan';
			font-weight: 400;
			font-style: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/league-spartan-400.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'League Spartan';
			font-weight: 500;
			font-style: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/league-spartan-500.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'League Spartan';
			font-weight: 600;
			font-style: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/league-spartan-600.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'League Spartan';
			font-weight: 700;
			font-style: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/league-spartan-700.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'Glacial Indifference';
			font-weight: 400;
			font-style: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/glacial-indifference-regular.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'Glacial Indifference';
			font-weight: 400;
			font-style: italic;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/glacial-indifference-italic.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'Glacial Indifference';
			font-weight: 700;
			font-style: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/glacial-indifference-bold.woff2' ) . "') format('woff2');
		}
```

### Step 1.4: Add Font Preload Links

**File:** `functions.php`
**Location:** Inside `houseyou_preload_webfonts()` function (around line 285)

**Add after existing preload links:**

```php
		<link rel="preload" href="<?php echo esc_url( get_theme_file_uri( 'assets/fonts/league-spartan-700.woff2' ) ); ?>" as="font" type="font/woff2" crossorigin>
		<link rel="preload" href="<?php echo esc_url( get_theme_file_uri( 'assets/fonts/glacial-indifference-regular.woff2' ) ); ?>" as="font" type="font/woff2" crossorigin>
```

---

## Phase 2: Update theme.json

### Step 2.1: Add Font Family Declarations

**File:** `theme.json`
**Location:** Lines 282-287 (inside `settings.typography.fontFamilies` array)

**Replace existing:**
```json
"fontFamilies": [
    {
        "fontFamily": "\"Red Hat Display\", sans-serif",
        "slug": "red-hat-display",
        "name": "Red Hat Display"
    }
]
```

**With:**
```json
"fontFamilies": [
    {
        "fontFamily": "\"League Spartan\", sans-serif",
        "slug": "league-spartan",
        "name": "League Spartan"
    },
    {
        "fontFamily": "\"Glacial Indifference\", sans-serif",
        "slug": "glacial-indifference",
        "name": "Glacial Indifference"
    },
    {
        "fontFamily": "\"Red Hat Display\", sans-serif",
        "slug": "red-hat-display",
        "name": "Red Hat Display"
    }
]
```

### Step 2.2: Update Body Typography

**File:** `theme.json`
**Location:** Lines 581-586 (inside `styles.typography`)

**Replace existing:**
```json
"typography": {
    "lineHeight": "var(--wp--custom--body--typography--line-height)",
    "fontFamily": "var(--wp--preset--font-family--red-hat-display)",
    "fontSize": "var(--wp--custom--font-sizes--normal)",
    "fontWeight": "400"
}
```

**With:**
```json
"typography": {
    "lineHeight": "var(--wp--custom--body--typography--line-height)",
    "fontFamily": "var(--wp--preset--font-family--glacial-indifference)",
    "fontSize": "var(--wp--custom--font-sizes--normal)",
    "fontWeight": "400"
}
```

### Step 2.3: Update Heading Typography

**File:** `theme.json`
**Location:** Lines 491-574 (inside `styles.elements`)

**For each heading element (h1, h2, h3, h4, h5, h6), add fontFamily:**

**Example for h1 (lines 491-502):**
```json
"h1": {
    "typography": {
        "fontFamily": "var(--wp--preset--font-family--league-spartan)",
        "fontSize": "min(max(3rem, 7vw), 4.5rem)",
        "fontWeight": "700",
        "lineHeight": "1.2"
    },
    "spacing": {
        "margin": {
            "top": "calc( 1.1 * var(--wp--custom--gap--vertical) )",
            "bottom": "calc( 1.1 * var(--wp--custom--gap--vertical) )"
        }
    }
}
```

**Apply to all headings (h1-h6):**
- Add `"fontFamily": "var(--wp--preset--font-family--league-spartan)"` to each heading's `typography` object

### Step 2.4: Update Navigation Typography

**File:** `theme.json`
**Location:** Lines 376-385 (inside `styles.blocks."core/navigation"`)

**Replace existing:**
```json
"typography": {
    "letterSpacing": "0.05em",
    "fontSize": "var(--wp--custom--font-sizes--normal)",
    "fontWeight": "900",
    "textTransform": "uppercase"
}
```

**With:**
```json
"typography": {
    "fontFamily": "var(--wp--preset--font-family--league-spartan)",
    "letterSpacing": "0.05em",
    "fontSize": "var(--wp--custom--font-sizes--normal)",
    "fontWeight": "700",
    "textTransform": "uppercase"
}
```

### Step 2.5: Update Site Title Typography

**File:** `theme.json`
**Location:** Lines 477-484 (inside `styles.blocks."core/site-title"`)

**Replace existing:**
```json
"typography": {
    "fontSize": "var(--wp--preset--font-size--medium)",
    "fontWeight": "900",
    "letterSpacing": "0.05em",
    "textTransform": "uppercase"
}
```

**With:**
```json
"typography": {
    "fontFamily": "var(--wp--preset--font-family--league-spartan)",
    "fontSize": "var(--wp--preset--font-size--medium)",
    "fontWeight": "700",
    "letterSpacing": "0.05em",
    "textTransform": "uppercase"
}
```

---

## Phase 3: SCSS Typography Purge

### Step 3.1: Delete Google Fonts Import

**File:** `sass/theme.scss`
**Line:** 337

**DELETE this line:**
```scss
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@600;800&display=swap');
```

### Step 3.2: Delete Hardcoded Heading Typography

**File:** `sass/theme.scss`
**Lines:** 564-568

**DELETE these lines:**
```scss
h1 { font-size: 2.5em !important; }
h2 { font-size: 2em !important; }
h3 { font-size: 1.6em !important; margin-top: 0 !important; margin-bottom: 0 !important; }
h4 { font-size: 1.2em !important; margin-top: 0 !important; margin-bottom: 0 !important; }
h5 { font-size: 1em !important; margin-top: 0 !important; margin-bottom: 0 !important; }
```

### Step 3.3: Refactor .intro-block

**File:** `sass/theme.scss`
**Lines:** 571-577

**Replace existing:**
```scss
.intro-block {
    font-family: 'League Spartan', sans-serif !important;
    font-weight: 500 !important;
    line-height: 1.2 !important;
    color: white !important;
    padding: 0.48rem 0;
}
```

**With:**
```scss
.intro-block {
    font-family: var(--wp--preset--font-family--league-spartan) !important;
    font-weight: 500 !important;
    line-height: 1.2 !important;
    color: white !important;
    padding: var(--wp--custom--gap--baseline) 0;
}
```

### Step 3.4: Refactor .site-main p

**File:** `sass/theme.scss`
**Lines:** 580-584

**DELETE these lines:**
```scss
.site-main p {
    font-size: 1.3rem;
    line-height: 1.6;
    padding: 5px 0;
}
```

**Rationale:** Body typography is now controlled by theme.json. The padding was arbitrary and breaks vertical rhythm.

### Step 3.5: Refactor .hero-section Typography

**File:** `sass/theme.scss`
**Lines:** 587-614

**Replace existing:**
```scss
.hero-section p,
.hero-section h3,
.hero-section h5,
.hero-section .intro-block,
.hero-section li {
    font-family: 'Inter', sans-serif;
    text-shadow:
        0 0 20px rgba(0, 0, 0, 0.8),
        0 0 40px rgba(0, 0, 0, 0.6),
        0 2px 4px rgba(0, 0, 0, 0.9);
}

.hero-section p,
.hero-section li {
    font-weight: 500;
    font-size: 25px;
    line-height: 1.2;
    padding: 6px 0;
}

.hero-section p strong,
.hero-section li strong {
    font-weight: 800;
}

@media (min-width: 769px) {
    .site-main p { font-size: 1.5rem; }
    .hero-section p, .hero-section li { font-size: 1.5rem; }
}
```

**With:**
```scss
.hero-section p,
.hero-section h3,
.hero-section h5,
.hero-section .intro-block,
.hero-section li {
    text-shadow:
        0 0 20px rgba(0, 0, 0, 0.8),
        0 0 40px rgba(0, 0, 0, 0.6),
        0 2px 4px rgba(0, 0, 0, 0.9);
}

.hero-section p,
.hero-section li {
    font-weight: 500;
    line-height: 1.2;
}

.hero-section p strong,
.hero-section li strong {
    font-weight: 700;
}
```

**Rationale:** 
- Removed `font-family: 'Inter'` - now uses theme.json fonts
- Removed hardcoded `font-size: 25px` and `font-size: 1.5rem` - let theme.json fluid typography work
- Removed `padding: 6px 0` - breaks vertical rhythm
- Changed `font-weight: 800` to `700` (League Spartan weight range is 400-700)

### Step 3.6: Refactor Navigation Font Family

**File:** `sass/theme.scss`
**Lines:** 687-689

**Replace existing:**
```scss
.mega-menu-item > a {
    display: flex !important;
    align-items: center !important;
    height: 100% !important;
}

/* Font styling for all menu items */
#mega-menu-wrap a,
.mega-menu-link,
.mega-menu-item a,
.mega-menu-item:hover a,
a.mega-menu-link:hover,
a.mega-menu-link:focus {
    font-family: 'League Spartan', sans-serif !important;
}
```

**With:**
```scss
.mega-menu-item > a {
    display: flex !important;
    align-items: center !important;
    height: 100% !important;
}

/* Font styling for all menu items - uses theme.json font */
#mega-menu-wrap a,
.mega-menu-link,
.mega-menu-item a,
.mega-menu-item:hover a,
a.mega-menu-link:hover,
a.mega-menu-link:focus {
    font-family: var(--wp--preset--font-family--league-spartan) !important;
}
```

### Step 3.7: Refactor Action Network Form Font Families

**File:** `sass/theme.scss`
**Lines:** 787-789, 862-864, 1261-1263, 1410-1412, 1622-1624, 1658-1660

**Find all instances of:**
```scss
font-family: 'League Spartan', sans-serif !important;
```

**Replace with:**
```scss
font-family: var(--wp--preset--font-family--league-spartan) !important;
```

**Find all instances of:**
```scss
font-family: 'Inter', sans-serif !important;
```

**Replace with:**
```scss
font-family: var(--wp--preset--font-family--glacial-indifference) !important;
```

---

## Phase 4: Spacing & Padding Refactor

### Step 4.1: Refactor Section Style Padding

**File:** `sass/theme.scss`
**Lines:** 224-235, 238-249, 252-263

**Replace all three section styles (dark-section, light-section, pink-section):**

**Existing:**
```scss
.wp-block-group.is-style-dark-section,
.wp-block-cover.is-style-dark-section {
    background-color: var(--wp--preset--color--ash-grey, #2D2A2E) !important;
    color: var(--wp--preset--color--white, #FFFFFF) !important;
    padding: 60px 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    ...
}
```

**With:**
```scss
.wp-block-group.is-style-dark-section,
.wp-block-cover.is-style-dark-section {
    background-color: var(--wp--preset--color--ash-grey, #2D2A2E) !important;
    color: var(--wp--preset--color--white, #FFFFFF) !important;
    padding: var(--wp--custom--spacing--medium) var(--wp--custom--spacing--outer) !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    ...
}
```

**Apply same change to:**
- `.is-style-light-section` (lines 238-249)
- `.is-style-pink-section` (lines 252-263)

### Step 4.2: Refactor Full-Width Homepage Padding

**File:** `sass/theme.scss`
**Lines:** 377-385

**Replace existing:**
```scss
main .full-width-homepage:first-child {
    margin-top: 0 !important;
    padding-top: 60px !important;
}

main .full-width-homepage:last-child {
    margin-bottom: 0 !important;
    padding-bottom: 60px !important;
}
```

**With:**
```scss
main .full-width-homepage:first-child {
    margin-top: 0 !important;
    padding-top: var(--wp--custom--spacing--medium) !important;
}

main .full-width-homepage:last-child {
    margin-bottom: 0 !important;
    padding-bottom: var(--wp--custom--spacing--medium) !important;
}
```

### Step 4.3: Refactor Content Section Padding

**File:** `sass/theme.scss`
**Lines:** 402-405

**Replace existing:**
```scss
.content-section {
    padding-top: 40px;
    padding-bottom: 40px;
}
```

**With:**
```scss
.content-section {
    padding-block: var(--wp--custom--spacing--small);
}
```

### Step 4.4: Refactor Desktop Content Section Padding

**File:** `sass/theme.scss`
**Lines:** 537-540

**Replace existing:**
```scss
@media (min-width: 769px) {
    ...
    .content-section {
        padding-top: 60px;
        padding-bottom: 60px;
    }
    ...
}
```

**With:**
```scss
@media (min-width: 769px) {
    ...
    .content-section {
        padding-block: var(--wp--custom--spacing--medium);
    }
    ...
}
```

### Step 4.5: Refactor Column Gaps

**File:** `sass/theme.scss`
**Lines:** 408-410

**Replace existing:**
```scss
.wp-block-columns {
    gap: 20px;
}
```

**With:**
```scss
.wp-block-columns {
    gap: var(--wp--style--block-gap, 0.5em);
}
```

### Step 4.6: Refactor Desktop Column Gaps

**File:** `sass/theme.scss`
**Lines:** 550-552

**Replace existing:**
```scss
@media (min-width: 769px) {
    ...
    .wp-block-columns {
        gap: 40px;
    }
    ...
}
```

**With:**
```scss
@media (min-width: 769px) {
    ...
    .wp-block-columns {
        gap: var(--wp--custom--gap--horizontal, 30px);
    }
    ...
}
```

### Step 4.7: Refactor Column Padding

**File:** `sass/theme.scss`
**Lines:** 412-415

**Replace existing:**
```scss
.wp-block-column {
    padding-left: 10px;
    padding-right: 10px;
}
```

**With:**
```scss
.wp-block-column {
    padding-inline: var(--wp--custom--gap--baseline);
}
```

### Step 4.8: Refactor Desktop Column Padding

**File:** `sass/theme.scss`
**Lines:** 554-557

**Replace existing:**
```scss
@media (min-width: 769px) {
    ...
    .wp-block-column {
        padding-left: 20px;
        padding-right: 20px;
    }
}
```

**With:**
```scss
@media (min-width: 769px) {
    ...
    .wp-block-column {
        padding-inline: var(--wp--custom--gap--horizontal);
    }
}
```

---

## Phase 5: Verification Steps

### Step 5.1: Rebuild CSS

After making all SCSS changes:
```bash
# If using a build tool
npm run build
# or
sass sass/theme.scss assets/theme.css
```

### Step 5.2: Clear Caches

- Clear WordPress cache
- Clear browser cache
- Clear any CDN caches

### Step 5.3: Test Pages

Test the following pages for typography consistency:
1. Homepage - Check hero section headings and body text
2. Standard Page (Hoarding 101) - Check content typography
3. Event Page - Check RSVP form typography
4. Action Page - Check letter form typography

### Step 5.4: Verify Computed Styles

After implementation, verify:
- [ ] All headings use League Spartan
- [ ] Body text uses Glacial Indifference
- [ ] Font sizes are fluid (responsive)
- [ ] Margins use CSS variables
- [ ] Padding uses spacing variables
- [ ] No hardcoded pixel values for spacing

---

## Summary of Changes

| File | Lines | Action |
|------|-------|--------|
| `functions.php` | 198-265 | ADD font-face declarations for League Spartan and Glacial Indifference |
| `functions.php` | 285+ | ADD preload links for new fonts |
| `theme.json` | 282-287 | REPLACE fontFamilies array |
| `theme.json` | 581-586 | UPDATE body fontFamily |
| `theme.json` | 491-574 | ADD fontFamily to all heading elements |
| `theme.json` | 376-385 | UPDATE navigation typography |
| `theme.json` | 477-484 | UPDATE site title typography |
| `sass/theme.scss` | 337 | DELETE Google Fonts import |
| `sass/theme.scss` | 564-568 | DELETE hardcoded heading sizes |
| `sass/theme.scss` | 571-577 | REFACTOR .intro-block |
| `sass/theme.scss` | 580-584 | DELETE .site-main p overrides |
| `sass/theme.scss` | 587-614 | REFACTOR .hero-section typography |
| `sass/theme.scss` | 687-689 | REFACTOR navigation font |
| `sass/theme.scss` | 787+ | REPLACE font-family with CSS variables |
| `sass/theme.scss` | 224-263 | REFACTOR section padding |
| `sass/theme.scss` | 377-385 | REFACTOR full-width padding |
| `sass/theme.scss` | 402-405 | REFACTOR content-section padding |
| `sass/theme.scss` | 537-540 | REFACTOR desktop content-section padding |
| `sass/theme.scss` | 408-410 | REFACTOR column gap |
| `sass/theme.scss` | 550-552 | REFACTOR desktop column gap |
| `sass/theme.scss` | 412-415 | REFACTOR column padding |
| `sass/theme.scss` | 554-557 | REFACTOR desktop column padding |

---

*Implementation Plan Generated: March 10, 2026*
*Based on: CSS/DOM Inconsistency Report*