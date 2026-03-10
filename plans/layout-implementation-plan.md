# Final Implementation Plan: Consistent Margins with Root Padding Aware Alignments

## Overview

This plan implements consistent margins across all pages using WordPress's native `useRootPaddingAwareAlignments` feature. The execution order is critical to prevent site breakage during the transition.

## Pre-Flight Audit Status

**Audit completed:** 2026-03-10. Five critical issues were identified and incorporated into this plan (marked with **[AUDIT FIX]**).

## Critical Execution Order

**The CSS hacks MUST be removed BEFORE enabling `useRootPaddingAwareAlignments`.** Failure to follow this order will cause:
- Double-breakout (native + CSS hack)
- Massive horizontal scrollbars
- Complete layout failure

**Phases 1 and 2** execute together (CSS purge + template cleanup). **Phase 3** (theme.json migration) executes ONLY after Phases 1 and 2 are complete and deployed.

---

## Phase 1: The Great CSS Purge & Prep

**File:** [`sass/theme.scss`](../sass/theme.scss)

All changes in this phase are safe to deploy before enabling root padding aware alignments. Execute simultaneously with Phase 2.

### 1A. Delete TwentyTwentyTwo Alignment Padding AND Negative Margins

**[AUDIT FIX]** These two blocks are a matched pair from TwentyTwentyTwo. Both must be deleted together. The original plan only deleted the negative margins (lines 225-248) but missed the paired padding block (lines 213-223). Leaving the padding block would cause double padding when `useRootPaddingAwareAlignments` is enabled.

**Lines 201-249** - DELETE the entire alignment system (comment + padding + negative margins):

```scss
/*
* Alignment styles, borrowed from Twenty Twenty-Two.
* These rules are temporary, and should not be relied on or
* modified too heavily by themes or plugins that build on
* Twenty Twenty-Two. These are meant to be a precursor to
* a global solution provided by the Block Editor.
*
* Relevant issues:
* https://github.com/WordPress/gutenberg/issues/35607
* https://github.com/WordPress/gutenberg/issues/35884
*/

.wp-site-blocks,
body > .is-root-container,
.edit-post-visual-editor__post-title-wrapper,
.wp-block-group.alignfull,
.wp-block-group.has-background,
.wp-block-cover.alignfull,
.is-root-container .wp-block[data-align="full"] > .wp-block-group,
.is-root-container .wp-block[data-align="full"] > .wp-block-cover {
    padding-left: var(--wp--custom--spacing--outer);
    padding-right: var(--wp--custom--spacing--outer);
}

.wp-site-blocks .alignfull,
.wp-site-blocks > .wp-block-group.has-background,
.wp-site-blocks > .wp-block-cover,
.wp-site-blocks > .wp-block-template-part > .wp-block-group.has-background,
.wp-site-blocks > .wp-block-template-part > .wp-block-cover,
body > .is-root-container > .wp-block-cover,
body > .is-root-container > .wp-block-template-part > .wp-block-group.has-background,
body > .is-root-container > .wp-block-template-part > .wp-block-cover,
.is-root-container .wp-block[data-align="full"] {
    margin-left: calc(-1 * var(--wp--custom--spacing--outer)) !important;
    margin-right: calc(-1 * var(--wp--custom--spacing--outer)) !important;
    max-width: unset;
    width: unset;
}

/* Blocks inside columns don't have negative margins. */
.wp-site-blocks .wp-block-columns .wp-block-column .alignfull,
.is-root-container .wp-block-columns .wp-block-column .wp-block[data-align="full"],
/* We also want to avoid stacking negative margins. */
.wp-site-blocks .alignfull:not(.wp-block-group) .alignfull,
.is-root-container .wp-block[data-align="full"] > *:not(.wp-block-group) .wp-block[data-align="full"] {
    margin-left: auto !important;
    margin-right: auto !important;
    width: inherit;
}
```

### 1B. Delete 100vw and -50vw Margin Hacks

**Lines 314-340** - DELETE `.is-style-full-width` 100vw hack (entire block including inner child constraints):

```scss
// Full Width Section (breaks out of container)
.wp-block-group.is-style-full-width {
    width: 100vw !important;
    max-width: 100vw !important;
    position: relative !important;
    left: 50% !important;
    right: 50% !important;
    margin-left: -50vw !important;
    margin-right: -50vw !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    box-sizing: border-box !important;

    // Constrain inner content
    > * {
        max-width: 1800px;
        margin-left: auto;
        margin-right: auto;
        padding-left: 20px;
        padding-right: 20px;

        @media (min-width: 769px) {
            padding-left: 40px;
            padding-right: 40px;
        }
    }
}
```

**Lines 455-478** - DELETE `.full-width-homepage` 100vw hack:

```scss
.full-width-homepage {
    width: 100vw !important;
    max-width: 100vw !important;
    position: relative !important;
    left: 50% !important;
    right: 50% !important;
    margin-left: -50vw !important;
    margin-right: -50vw !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    box-sizing: border-box !important;
}

/* Ensure full-width sections break out of constrained layouts */
.wp-site-blocks .full-width-homepage,
.wp-block-group.has-background .full-width-homepage,
.is-layout-constrained .full-width-homepage {
    margin-left: -50vw !important;
    margin-right: -50vw !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}
```

**Lines 522-530** - DELETE header 100vw hack:

```scss
header.wp-block-template-part {
    width: 100vw;
    max-width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
}
```

**Lines 594-601** - DELETE footer 100vw hack:

```scss
footer.wp-block-template-part .wp-block-group.alignfull.pre-footer {
    width: 100vw !important;
    max-width: 100vw !important;
    position: relative !important;
    left: 50% !important;
    right: 50% !important;
    margin-left: -50vw !important;
    margin-right: -50vw !important;
}
```

### 1B-2. Delete `.events-grid` 100vw Hack

**[AUDIT FIX]** This was completely missed in the original plan. The events listing shortcode output uses the same 100vw/-50vw breakout hack. If `overflow-x: hidden` is removed and this stays, every page with `[events_listing]` gets horizontal scrollbars.

**Lines 1895-1910** - DELETE the 100vw hack from `.events-grid`:

```scss
/* BEFORE */
.events-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    justify-content: center;
    width: 100vw;
    max-width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw !important;
    margin-right: -50vw !important;
    padding-left: var(--wp--custom--spacing--outer);
    padding-right: var(--wp--custom--spacing--outer);
    box-sizing: border-box;
}

/* AFTER — rely on native alignment instead */
.events-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    justify-content: center;
}
```

**Note:** The events listing shortcode output (`functions.php`) wraps cards in `<div class="events-grid">`. To make this full-width natively, the shortcode should be placed inside an `alignfull` Group block in the editor, or the shortcode wrapper can be updated to output an `alignfull` class. This is addressed in Phase 2 (step 2E).

### 1C. Delete `.is-layout-constrained` Overrides

**Lines 536-540** - DELETE header override:

```scss
/* Override WordPress's .is-layout-constrained in header */
header.wp-block-template-part > .wp-block-group.is-layout-constrained {
    max-width: 100% !important;
}
```

**Lines 588-591** - DELETE footer override:

```scss
footer.wp-block-template-part > .wp-block-group.is-layout-constrained {
    max-width: 100% !important;
}
```

### 1C-2. Remove `padding: 0` from `.wp-site-blocks`

**[AUDIT FIX]** When `useRootPaddingAwareAlignments` is enabled, WordPress applies root padding to `.wp-site-blocks`. This existing rule zeroes out all padding, which would nullify the entire root padding system.

**Lines 438-444** - CHANGE to remove padding/margin override:

```scss
/* BEFORE */
.wp-site-blocks {
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin: 0;
}

/* AFTER — delete the entire rule. The native layout system handles .wp-site-blocks.
   If width/max-width constraints are still needed, keep only those: */
.wp-site-blocks {
    width: 100%;
    max-width: 100%;
}
```

**Also review** `.site-main` immediately below (lines 446-452) — the `padding: 0` there may also conflict, but `.site-main` is not a WordPress layout container so it's lower risk. Keep it for now and test.

### 1D. Remove `overflow-x: hidden`

**Search for and DELETE** (in compiled `assets/theme.css` it's at lines 4-7, and the source is generated from an `overflow-x: hidden` rule not visible in the SCSS — it may be in the compiled CSS only or in a separate import):

```scss
html, body {
    overflow-x: hidden;
}
```

**Note:** This was added to hide the scrollbar overflow caused by 100vw. It is no longer needed after the purge. Pre-flight audit confirmed no JS files depend on this constraint.

### 1E. Update Header/Footer Padding to Use CSS Variables

**Lines 646-649** - CHANGE from hardcoded to variable:

```scss
/* BEFORE */
@media (min-width: 769px) {
    header.wp-block-template-part > .wp-block-group {
        padding-left: 40px !important;
        padding-right: 40px !important;
    }
}

/* AFTER */
@media (min-width: 769px) {
    header.wp-block-template-part > .wp-block-group {
        padding-left: var(--wp--custom--spacing--outer) !important;
        padding-right: var(--wp--custom--spacing--outer) !important;
    }
}
```

**Lines 679-683** - CHANGE footer padding:

```scss
/* BEFORE */
@media (min-width: 769px) {
    footer.wp-block-template-part .wp-block-columns,
    footer.wp-block-template-part .wp-block-paragraph {
        padding-left: 40px !important;
        padding-right: 40px !important;
    }
}

/* AFTER */
@media (min-width: 769px) {
    footer.wp-block-template-part .wp-block-columns,
    footer.wp-block-template-part .wp-block-paragraph {
        padding-left: var(--wp--custom--spacing--outer) !important;
        padding-right: var(--wp--custom--spacing--outer) !important;
    }
}
```

### 1F. Update `.content-container` Padding

**Lines 427-431** - CHANGE to use variable:

```scss
/* BEFORE */
@media (min-width: 769px) {
    .content-container {
        padding-left: 40px !important;
        padding-right: 40px !important;
    }
}

/* AFTER */
@media (min-width: 769px) {
    .content-container {
        padding-left: var(--wp--custom--spacing--outer) !important;
        padding-right: var(--wp--custom--spacing--outer) !important;
    }
}
```

### 1G. Update Full-Width Homepage Child Padding

**Lines 664-671** - CHANGE to use variable:

```scss
/* BEFORE */
@media (min-width: 769px) {
    .full-width-homepage .wp-block-columns,
    .full-width-homepage > .wp-block-heading,
    .full-width-homepage > .wp-block-paragraph,
    .full-width-homepage > .petition-row,
    .full-width-homepage > .content-container {
        padding-left: 40px !important;
        padding-right: 40px !important;
    }
}

/* AFTER */
@media (min-width: 769px) {
    .full-width-homepage .wp-block-columns,
    .full-width-homepage > .wp-block-heading,
    .full-width-homepage > .wp-block-paragraph,
    .full-width-homepage > .petition-row,
    .full-width-homepage > .content-container {
        padding-left: var(--wp--custom--spacing--outer) !important;
        padding-right: var(--wp--custom--spacing--outer) !important;
    }
}
```

---

## Phase 2: Template Cleanup

Execute simultaneously with Phase 1.

### 2A. Update [`block-templates/page.html`](../block-templates/page.html)

**Lines 3-4** - REMOVE hardcoded margins:

```html
<!-- BEFORE -->
<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"},"margin":{"right":"var:preset|spacing|80","left":"var:preset|spacing|80"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<main class="wp-block-group has-white-background-color has-background" style="padding-top:4em;padding-bottom:2.5em;margin-right:var(--wp--preset--spacing--80);margin-left:var(--wp--preset--spacing--80)">

<!-- AFTER -->
<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group" style="padding-top:4em;padding-bottom:2.5em">
```

### 2B. Update [`block-templates/contact-us.html`](../block-templates/contact-us.html)

**Lines 3-4** - REMOVE hardcoded margins:

```html
<!-- BEFORE -->
<!-- wp:group {"tagName":"main","className":"site-main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"},"margin":{"right":"var:preset|spacing|80","left":"var:preset|spacing|80"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<main class="wp-block-group site-main has-white-background-color has-background" style="padding-top:4em;padding-bottom:2.5em;margin-right:var(--wp--preset--spacing--80);margin-left:var(--wp--preset--spacing--80)">

<!-- AFTER -->
<!-- wp:group {"tagName":"main","className":"site-main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group site-main" style="padding-top:4em;padding-bottom:2.5em">
```

### 2C. Update [`block-templates/an-events.html`](../block-templates/an-events.html)

**Line 4** - REMOVE nested `contentSize: 100%`:

```html
<!-- BEFORE -->
<!-- wp:group {"className":"full-width-homepage","backgroundColor":"white","layout":{"type":"constrained","contentSize":"100%"}} -->

<!-- AFTER -->
<!-- wp:group {"className":"full-width-homepage","backgroundColor":"white","layout":{"type":"constrained"}} -->
```

### 2D. Update [`block-templates/action.html`](../block-templates/action.html)

**Line 4** - REMOVE nested `contentSize: 100%`:

```html
<!-- BEFORE -->
<!-- wp:group {"className":"full-width-homepage","backgroundColor":"white","layout":{"type":"constrained","contentSize":"100%"}} -->

<!-- AFTER -->
<!-- wp:group {"className":"full-width-homepage","backgroundColor":"white","layout":{"type":"constrained"}} -->
```

### 2E. Update [`block-templates/home-2026.html`](../block-templates/home-2026.html) — Convert `.full-width-homepage` to `alignfull`

**[AUDIT FIX]** This template uses `className: "full-width-homepage"` on 4 sections (hero, light section, pink section, dark section). Phase 1 deletes the `.full-width-homepage` CSS hack, so these sections will lose their full-width breakout unless they are converted to use WordPress's native `"align":"full"` attribute instead.

For each group block that currently uses `className: "full-width-homepage"`, add `"align":"full"` and add `alignfull` to the HTML class list:

**Section 1 (Hero):** Already has `"align":"wide"` — change to `"align":"full"`:

```html
<!-- BEFORE -->
<!-- wp:group {"align":"wide","className":"full-width-homepage hero-section is-style-dark-section",...} -->
<div class="wp-block-group alignwide full-width-homepage hero-section is-style-dark-section" ...>

<!-- AFTER -->
<!-- wp:group {"align":"full","className":"full-width-homepage hero-section is-style-dark-section",...} -->
<div class="wp-block-group alignfull full-width-homepage hero-section is-style-dark-section" ...>
```

**Sections 2, 3, 4** (light, pink, dark sections): Add `"align":"full"` and `alignfull` class:

```html
<!-- BEFORE (example — light section) -->
<!-- wp:group {"className":"full-width-homepage content-section is-style-light-section"} -->
<div class="wp-block-group full-width-homepage content-section is-style-light-section">

<!-- AFTER -->
<!-- wp:group {"align":"full","className":"full-width-homepage content-section is-style-light-section"} -->
<div class="wp-block-group alignfull full-width-homepage content-section is-style-light-section">
```

Repeat for all 4 sections. The `full-width-homepage` class can be kept temporarily for any remaining child-padding CSS rules (step 1G) until those are also refactored in a later cleanup pass.

**Also fix structural bug:** The footer `<!-- wp:template-part -->` is currently nested inside the last dark section group. Move it to the root level after closing the `</main>` tag, consistent with all other templates.

---

## Phase 3: The theme.json Migration

**Execute ONLY after Phases 1 and 2 are complete and deployed.**

**File:** [`theme.json`](../theme.json)

### 3A. Update Layout Settings

**Lines 264-267** (`settings.layout`) - CHANGE contentSize:

```json
// BEFORE
"layout": {
    "contentSize": "684px",
    "wideSize": "1160px"
}

// AFTER
"layout": {
    "contentSize": "1160px",
    "wideSize": "1400px"
}
```

### 3A-2. Update Custom Layout Settings

**[AUDIT FIX]** There is a duplicate layout definition under `settings.custom.layout` (lines 250-252) that generates CSS custom properties (`--wp--custom--layout--content-size`, `--wp--custom--layout--wide-size`). These should be updated to match, or removed if unused.

**Lines 250-253** (`settings.custom.layout`) - UPDATE to match:

```json
// BEFORE
"layout": {
    "contentSize": "684px",
    "wideSize": "1160px"
}

// AFTER
"layout": {
    "contentSize": "1160px",
    "wideSize": "1400px"
}
```

### 3B. Enable Root Padding Aware Alignments

**Add to `settings` object (around line 46):**

```json
"settings": {
    "useRootPaddingAwareAlignments": true,
    "appearanceTools": true,
    ...rest of settings...
}
```

### 3C. Add Root Padding to Styles

**Add to `styles` object (around line 312):**

```json
"styles": {
    "spacing": {
        "padding": {
            "right": "var(--wp--custom--spacing--outer)",
            "left": "var(--wp--custom--spacing--outer)"
        }
    },
    "blocks": {
        ...existing block styles...
    },
    ...rest of styles...
}
```

---

## Deployment Checklist

### Pre-Deployment (Phases 1 & 2)

- [ ] **[AUDIT FIX]** TwentyTwentyTwo alignment padding block deleted (lines 213-223)
- [ ] TwentyTwentyTwo negative margin block deleted (lines 225-249)
- [ ] `.is-style-full-width` 100vw hack deleted
- [ ] `.full-width-homepage` 100vw hack deleted
- [ ] Header 100vw hack deleted
- [ ] Footer 100vw hack deleted
- [ ] **[AUDIT FIX]** `.events-grid` 100vw hack deleted (lines 1895-1910)
- [ ] `.is-layout-constrained` overrides deleted
- [ ] **[AUDIT FIX]** `.wp-site-blocks { padding: 0; }` removed (lines 438-444)
- [ ] `overflow-x: hidden` removed
- [ ] Header/footer padding updated to use CSS variable
- [ ] `.content-container` padding updated
- [ ] `.full-width-homepage` child padding updated
- [ ] `page.html` margins removed
- [ ] `contact-us.html` margins removed
- [ ] `an-events.html` nested contentSize removed
- [ ] `action.html` nested contentSize removed
- [ ] **[AUDIT FIX]** `home-2026.html` sections converted to `alignfull`
- [ ] **[AUDIT FIX]** `home-2026.html` footer moved to root level
- [ ] Compile SCSS to CSS (`npm run build`)
- [ ] Deploy to staging
- [ ] Test all page types on staging
- [ ] Verify no horizontal scrollbars
- [ ] Verify full-width sections still work
- [ ] Test events listing page specifically

### Final Deployment (Phase 3)

- [ ] `theme.json` `settings.layout` contentSize updated to 1160px
- [ ] **[AUDIT FIX]** `theme.json` `settings.custom.layout` updated to match
- [ ] `useRootPaddingAwareAlignments: true` added
- [ ] Root padding added to styles
- [ ] Deploy to staging
- [ ] Test all page types on staging
- [ ] Verify consistent margins across all pages
- [ ] Verify header/footer alignment
- [ ] Test mobile responsiveness
- [ ] Test Max Mega Menu on mobile (visual check for overflow)
- [ ] Push to production

---

## Testing Matrix

| Page Type | Template | Before | After Phase 1&2 | After Phase 3 |
|-----------|----------|--------|-----------------|---------------|
| Homepage (2026) | `home-2026.html` | Full-width (100vw hacks) | Full-width (alignfull) | Full-width (native root padding) |
| Homepage (legacy) | `home.html` | 684px (inherit) | 684px (inherit) | 1160px (inherit) |
| Standard Page | `page.html` | 684px (constrained + margins) | 684px (constrained, no margins) | 1160px (constrained) |
| Contact Us | `contact-us.html` | 684px (constrained + margins) | 684px (constrained, no margins) | 1160px (constrained) |
| Action Page | `action.html` | Two-column (100% inner) | Two-column (constrained) | Two-column (constrained at 1160px) |
| Event Page | `an-events.html` | Two-column (100% inner) | Two-column (constrained) | Two-column (constrained at 1160px) |
| Archive | `archive.html` | 684px (inherit) | 684px (inherit) | 1160px (inherit) |
| Single Post | `single.html` | 684px (inherit) | 684px (inherit) | 1160px (inherit) |
| Search | `search.html` | 684px (inherit) | 684px (inherit) | 1160px (inherit) |
| 404 | `404.html` | 684px (inherit) | 684px (inherit) | 1160px (inherit) |
| Events Listing | (shortcode) | Full-width (100vw hack) | Standard flow | Full-width via alignfull wrapper |

---

## Rollback Plan

### If Phase 1 & 2 Cause Issues

1. Revert SCSS changes via git
2. Revert template changes via git
3. Recompile CSS
4. Deploy

### If Phase 3 Causes Issues

1. Set `useRootPaddingAwareAlignments: false`
2. Remove root padding from styles
3. Revert contentSize to 684px
4. Revert custom.layout contentSize to 684px
5. Deploy

---

## Post-Implementation Tasks

1. Update [`architecture.md`](../architecture.md):
   - Section 3 (Layout System) - Document new native approach
   - Section 10 (Known Constraints) - Remove obsolete constraints

2. Remove any remaining legacy CSS that's no longer needed (e.g., `.full-width-homepage` child padding rules from 1G once all templates use `alignfull`)

3. Test in Site Editor to verify editing experience

4. Document the new layout approach for future developers

5. Fix `archive.html` and `404.html` pattern slugs (still reference `skatepark/` instead of `house-you/`)

---

## Appendix: Pre-Flight Audit Findings Summary

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| 1 | TwentyTwentyTwo padding block (lines 213-223) not deleted — would cause double padding | CRITICAL | Added as 1A |
| 2 | `.events-grid` 100vw hack (lines 1895-1910) completely missed | CRITICAL | Added as 1B-2 |
| 3 | `.wp-site-blocks { padding: 0; }` would override root padding | CRITICAL | Added as 1C-2 |
| 4 | `home-2026.html` uses `.full-width-homepage` but CSS hack being deleted | CRITICAL | Added as 2E |
| 5 | `settings.custom.layout` has stale values | IMPORTANT | Added as 3A-2 |
| 6 | No JS files depend on `overflow-x: hidden` | CLEAR | Confirmed safe |
| 7 | Testing matrix inaccurate for Single Post and other inherit templates | MINOR | Fixed |
| 8 | `archive.html`/`404.html` still use `skatepark/` pattern slugs | MINOR | Added to post-implementation |
| 9 | `home-2026.html` footer nested inside last group block | MINOR | Added to 2E |
