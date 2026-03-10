# Layout Migration: Root Padding Aware Alignments

**Completed:** 2026-03-10
**Migration type:** Layout architecture overhaul — legacy CSS hacks → WordPress native `useRootPaddingAwareAlignments`

---

## What Changed (Summary)

The theme previously used classic-theme CSS hacks (100vw breakouts, negative margins, `overflow-x: hidden`) borrowed from TwentyTwentyTwo to achieve full-width sections inside constrained layouts. These have been replaced with WordPress's native `useRootPaddingAwareAlignments` system, which handles root padding and `alignfull` breakouts automatically.

### Before
- Full-width achieved via `width: 100vw; margin-left: -50vw` hacks
- TwentyTwentyTwo padding/negative-margin pair for alignment
- `overflow-x: hidden` on `html, body` to mask scrollbar overflow
- Hardcoded `40px` padding throughout
- `contentSize: 684px`, `wideSize: 1160px`

### After
- Full-width achieved via native `align: full` on Group blocks
- Root padding applied automatically by WordPress via `useRootPaddingAwareAlignments`
- No `overflow-x: hidden` needed
- Padding uses `var(--wp--custom--spacing--outer)` CSS variable
- `contentSize: 1160px`, `wideSize: 1400px`

---

## Execution Order

The migration was executed in strict sequential phases to prevent site breakage. CSS hacks were removed **before** enabling the native system.

---

## Phase 1: CSS Purge & Prep

**File:** `sass/theme.scss` → compiled to `assets/theme.css`

### 1A. Deleted TwentyTwentyTwo Alignment System (~50 lines)

Removed the entire matched pair:
- **Padding block** — applied `padding-left/right: var(--wp--custom--spacing--outer)` to `.wp-site-blocks`, `.alignfull`, `.has-background`, etc.
- **Negative margin block** — applied `margin-left/right: calc(-1 * var(--wp--custom--spacing--outer))` to `.alignfull` elements
- **Column exception** — reset margins for blocks inside columns

These were a TwentyTwentyTwo workaround that predated `useRootPaddingAwareAlignments`. Leaving the padding block would have caused **double padding** once the native system was enabled.

### 1B. Deleted All 100vw / -50vw Breakout Hacks

| Selector | Lines removed |
|----------|--------------|
| `.wp-block-group.is-style-full-width` | ~27 lines (including inner child constraints) |
| `.full-width-homepage` | ~14 lines (breakout + box-sizing) |
| `.wp-site-blocks .full-width-homepage` (override) | ~6 lines |
| `header.wp-block-template-part` | 7 properties removed (kept background-color, color) |
| `footer .wp-block-group.alignfull.pre-footer` | ~10 lines |
| `.events-grid` | 10 properties removed (kept flex layout: display, flex-wrap, gap, justify-content) |

The `.events-grid` hack was caught in the pre-flight audit — the original plan missed it. Without removal, every page with `[events_listing]` would have had horizontal scrollbars once `overflow-x: hidden` was removed.

### 1C. Deleted `.is-layout-constrained` Overrides

| Selector | What it did |
|----------|------------|
| `header.wp-block-template-part > .wp-block-group.is-layout-constrained` | Forced `max-width: 100%`, zeroed padding, set colors |
| `footer.wp-block-template-part > .wp-block-group.is-layout-constrained` | Forced `max-width: 100%`, zeroed padding |

These overrode WordPress's constrained layout system. No longer needed — the native layout handles header/footer width correctly.

### 1C-2. Removed `padding: 0; margin: 0` from `.wp-site-blocks`

**Before:**
```css
.wp-site-blocks {
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin: 0;
}
```

**After:**
```css
.wp-site-blocks {
    width: 100%;
    max-width: 100%;
}
```

The `padding: 0` would have **nullified the entire root padding system** since WordPress applies root padding to `.wp-site-blocks`. This was caught in the pre-flight audit.

### 1D. Removed `overflow-x: hidden`

This rule was only present in the compiled `assets/theme.css` (manually injected after compilation), not in the SCSS source. Recompilation naturally removed it.

It was originally needed to hide the ~15px scrollbar overflow from `100vw` elements. No longer needed since no 100vw hacks remain.

### 1E. Updated Header/Footer Padding to CSS Variables

Changed all hardcoded `40px` padding values to `var(--wp--custom--spacing--outer)`:

| Location | Selector |
|----------|----------|
| Header desktop padding | `header.wp-block-template-part > .wp-block-group` |
| Header columns desktop | `header .wp-block-columns.header-columns` |
| Footer desktop padding | `footer .wp-block-columns`, `footer .wp-block-paragraph` |

### 1F. Updated `.content-container` Padding

Changed `padding-left/right: 40px` → `var(--wp--custom--spacing--outer)` in the desktop media query.

### 1G. Updated `.full-width-homepage` Child Padding

Changed `padding-left/right: 40px` → `var(--wp--custom--spacing--outer)` for:
- `.full-width-homepage .wp-block-columns`
- `.full-width-homepage > .wp-block-heading`
- `.full-width-homepage > .wp-block-paragraph`
- `.full-width-homepage > .petition-row`
- `.full-width-homepage > .content-container`

---

## Phase 2: Template Cleanup

### 2A. `block-templates/page.html`

Removed hardcoded `margin-right` and `margin-left` (`var:preset|spacing|80`) from the `<main>` group. White background retained.

**Before:**
```html
<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"},"margin":{"right":"var:preset|spacing|80","left":"var:preset|spacing|80"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
```

**After:**
```html
<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
```

### 2B. `block-templates/contact-us.html`

Same change as page.html — removed hardcoded side margins from `<main>` group. White background retained.

### 2C. `block-templates/an-events.html`

Removed `"contentSize":"100%"` from the inner `.full-width-homepage` group. Added `"backgroundColor":"white"` to the outer `.site-main` wrapper.

### 2D. `block-templates/action.html`

Same changes as an-events.html — removed `contentSize: 100%`, added white background to outer wrapper.

### 2E. `block-templates/home-2026.html`

Converted all 4 full-width sections from CSS-hack breakout to native `alignfull`:

| Section | Before | After |
|---------|--------|-------|
| Hero (dark) | `"align":"wide"` + `.full-width-homepage` CSS hack | `"align":"full"` + `alignfull` class |
| Light section | No align + `.full-width-homepage` CSS hack | `"align":"full"` + `alignfull` class |
| Pink section | No align + `.full-width-homepage` CSS hack | `"align":"full"` + `alignfull` class |
| Dark section | No align + `.full-width-homepage` CSS hack | `"align":"full"` + `alignfull` class |

**Structural fix:** Moved the `<!-- wp:template-part {"slug":"footer"} -->` from inside the last dark section group to the root level, consistent with all other templates.

The `full-width-homepage` class was kept on all sections for any remaining child-padding CSS rules. Can be removed in a future cleanup pass once those rules are also refactored.

---

## Phase 3: theme.json Migration

**File:** `theme.json`

### 3A. Updated Layout Sizes

```json
"settings": {
    "layout": {
        "contentSize": "1160px",  // was 684px
        "wideSize": "1400px"      // was 1160px
    }
}
```

### 3A-2. Updated Custom Layout Sizes (Audit Fix)

```json
"settings": {
    "custom": {
        "layout": {
            "contentSize": "1160px",  // was 684px
            "wideSize": "1400px"      // was 1160px
        }
    }
}
```

This duplicate definition generates CSS custom properties (`--wp--custom--layout--content-size`, `--wp--custom--layout--wide-size`). It was stale and would have produced incorrect values.

### 3B. Enabled Root Padding Aware Alignments

```json
"settings": {
    "useRootPaddingAwareAlignments": true
}
```

This tells WordPress to:
1. Apply root padding (from `styles.spacing.padding`) to `.wp-site-blocks`
2. Automatically remove that padding on `alignfull` elements so they break out to full width
3. Handle the padding/negative-margin dance natively

### 3C. Added Root Padding to Styles

```json
"styles": {
    "spacing": {
        "blockGap": "0.5em",
        "padding": {
            "right": "var(--wp--custom--spacing--outer)",
            "left": "var(--wp--custom--spacing--outer)"
        }
    }
}
```

This uses the same `--wp--custom--spacing--outer` variable (`min(4vw, 90px)`) that the old TwentyTwentyTwo hack used, so the visual padding is identical.

---

## Post-Migration Visual Fix

After Phase 2, templates `page.html`, `contact-us.html`, `an-events.html`, and `action.html` showed a dark background because the initial plan removed `"backgroundColor":"white"` along with the margins. This was restored as a hotfix before Phase 3 was executed.

---

## Files Modified

| File | Type of change |
|------|---------------|
| `sass/theme.scss` | ~130 lines of CSS hacks deleted, 6 padding values changed to CSS variable |
| `assets/theme.css` | Recompiled (overflow-x: hidden removed, all hacks removed) |
| `block-templates/page.html` | Margins removed, white background retained |
| `block-templates/contact-us.html` | Margins removed, white background retained |
| `block-templates/an-events.html` | contentSize removed, white background added to outer wrapper |
| `block-templates/action.html` | contentSize removed, white background added to outer wrapper |
| `block-templates/home-2026.html` | 4 sections converted to alignfull, footer moved to root level |
| `theme.json` | Layout sizes updated, root padding enabled, padding styles added |

---

## How Full-Width Works Now

**Before (legacy):**
1. Content constrained by WordPress `is-layout-constrained`
2. Full-width sections use `width: 100vw; margin-left: -50vw` to break out
3. `overflow-x: hidden` masks the scrollbar overflow
4. Inner content re-constrained with `max-width: 1800px` and padding

**After (native):**
1. Root padding applied to `.wp-site-blocks` via `useRootPaddingAwareAlignments`
2. Full-width sections use `align: full` in block markup
3. WordPress automatically removes root padding on `alignfull` elements
4. Inner content constrained by the layout system (`contentSize: 1160px`, `wideSize: 1400px`)

To make a Group block full-width:
1. Select the Group block in the editor
2. Set alignment to "Full Width" in the toolbar
3. WordPress handles the rest — no CSS hacks needed

---

## Rollback Plan

### Revert Phases 1 & 2
```bash
git checkout HEAD~1 -- sass/theme.scss block-templates/
npm run build
```

### Revert Phase 3
```bash
git checkout HEAD~1 -- theme.json
```

Or manually: set `useRootPaddingAwareAlignments: false`, remove `styles.spacing.padding`, revert contentSize to `684px` and wideSize to `1160px` in both layout locations.

---

## Remaining Cleanup (Non-urgent)

1. **`.full-width-homepage` class** — Still present on home-2026.html sections and in CSS child-padding rules (step 1G). Can be removed once all content is verified working with native alignment only.
2. **`architecture.md`** — Section 3 (Layout System) and Section 10 (Known Constraints) reference the old 100vw system and need updating.
3. **`archive.html` and `404.html`** — Still reference `skatepark/` pattern slugs instead of `house-you/`.
4. **`.content-container` class** — May be redundant now that contentSize is 1160px. Audit usage before removing.
5. **`.site-main` class** — Used on some templates but not others. Consider standardising.
