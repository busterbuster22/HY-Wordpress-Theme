# Final Implementation Plan: Consistent Margins with Root Padding Aware Alignments

## Overview

This plan implements consistent margins across all pages using WordPress's native `useRootPaddingAwareAlignments` feature. The execution order is critical to prevent site breakage during the transition.

## ⚠️ Critical Execution Order

**The CSS hacks MUST be removed BEFORE enabling `useRootPaddingAwareAlignments`.** Failure to follow this order will cause:
- Double-breakout (native + CSS hack)
- Massive horizontal scrollbars
- Complete layout failure

---

## Phase 1: The Great CSS Purge & Prep

**File:** [`sass/theme.scss`](sass/theme.scss)

Execute simultaneously with Phase 2 & 3. All changes in this phase are safe to deploy before enabling root padding aware alignments.

### 1A. Delete Negative Margin Hacks for `.alignfull`

**Lines 225-248** - DELETE these rules:

```scss
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

**Lines 314-322** - DELETE `.is-style-full-width` 100vw hack:

```scss
.wp-block-group.is-style-full-width {
    width: 100vw !important;
    max-width: 100vw !important;
    position: relative !important;
    left: 50% !important;
    right: 50% !important;
    margin-left: -50vw !important;
    margin-right: -50vw !important;
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

### 1D. Remove `overflow-x: hidden`

**Search for and DELETE:**

```scss
html, body {
    overflow-x: hidden;
}
```

**Note:** This was added to hide the scrollbar overflow caused by 100vw. It should no longer be needed after the purge.

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

### 2A. Update [`block-templates/page.html`](block-templates/page.html)

**Lines 3-4** - REMOVE hardcoded margins:

```html
<!-- BEFORE -->
<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"},"margin":{"right":"var:preset|spacing|80","left":"var:preset|spacing|80"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<main class="wp-block-group has-white-background-color has-background" style="padding-top:4em;padding-bottom:2.5em;margin-right:var(--wp--preset--spacing--80);margin-left:var(--wp--preset--spacing--80)">

<!-- AFTER -->
<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group" style="padding-top:4em;padding-bottom:2.5em">
```

### 2B. Update [`block-templates/contact-us.html`](block-templates/contact-us.html)

**Lines 3-4** - REMOVE hardcoded margins:

```html
<!-- BEFORE -->
<!-- wp:group {"tagName":"main","className":"site-main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"},"margin":{"right":"var:preset|spacing|80","left":"var:preset|spacing|80"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<main class="wp-block-group site-main has-white-background-color has-background" style="padding-top:4em;padding-bottom:2.5em;margin-right:var(--wp--preset--spacing--80);margin-left:var(--wp--preset--spacing--80)">

<!-- AFTER -->
<!-- wp:group {"tagName":"main","className":"site-main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group site-main" style="padding-top:4em;padding-bottom:2.5em">
```

### 2C. Update [`block-templates/an-events.html`](block-templates/an-events.html)

**Line 4** - REMOVE nested `contentSize: 100%`:

```html
<!-- BEFORE -->
<!-- wp:group {"className":"full-width-homepage","backgroundColor":"white","layout":{"type":"constrained","contentSize":"100%"}} -->

<!-- AFTER -->
<!-- wp:group {"className":"full-width-homepage","backgroundColor":"white","layout":{"type":"constrained"}} -->
```

### 2D. Update [`block-templates/action.html`](block-templates/action.html)

**Line 4** - REMOVE nested `contentSize: 100%`:

```html
<!-- BEFORE -->
<!-- wp:group {"className":"full-width-homepage","backgroundColor":"white","layout":{"type":"constrained","contentSize":"100%"}} -->

<!-- AFTER -->
<!-- wp:group {"className":"full-width-homepage","backgroundColor":"white","layout":{"type":"constrained"}} -->
```

---

## Phase 3: The theme.json Migration

**Execute ONLY after Phases 1 and 2 are complete and deployed.**

**File:** [`theme.json`](theme.json)

### 3A. Update Layout Settings

**Lines 264-267** - CHANGE contentSize:

```json
/* BEFORE */
"layout": {
    "contentSize": "684px",
    "wideSize": "1160px"
}

/* AFTER */
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

- [ ] All CSS hacks removed from `sass/theme.scss`
- [ ] `overflow-x: hidden` removed
- [ ] Header/footer padding updated to use CSS variable
- [ ] `.content-container` padding updated
- [ ] `.full-width-homepage` child padding updated
- [ ] `page.html` margins removed
- [ ] `contact-us.html` margins removed
- [ ] `an-events.html` nested contentSize removed
- [ ] `action.html` nested contentSize removed
- [ ] Compile SCSS to CSS
- [ ] Deploy to staging
- [ ] Test all page types on staging
- [ ] Verify no horizontal scrollbars
- [ ] Verify full-width sections still work

### Final Deployment (Phase 3)

- [ ] `theme.json` contentSize updated to 1160px
- [ ] `useRootPaddingAwareAlignments: true` added
- [ ] Root padding added to styles
- [ ] Deploy to staging
- [ ] Test all page types on staging
- [ ] Verify consistent margins across all pages
- [ ] Verify header/footer alignment
- [ ] Test mobile responsiveness
- [ ] Push to production

---

## Testing Matrix

| Page Type | Before | After Phase 1&2 | After Phase 3 |
|-----------|--------|-----------------|---------------|
| Home | Full-width | Full-width | Full-width |
| Standard Page | 684px (constrained) | 684px (constrained) | 1160px (constrained) |
| Contact Us | 684px (constrained) | 684px (constrained) | 1160px (constrained) |
| Action Page | Two-column | Two-column | Two-column |
| Event Page | Two-column | Two-column | Two-column |
| Archive | Full-width | Full-width | Full-width |
| Single Post | Full-width | Full-width | Full-width |

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
4. Deploy

---

## Post-Implementation Tasks

1. Update [`architecture.md`](architecture.md):
   - Section 3 (Layout System) - Document new native approach
   - Section 10 (Known Constraints) - Remove obsolete constraints

2. Remove any remaining legacy CSS that's no longer needed

3. Test in Site Editor to verify editing experience

4. Document the new layout approach for future developers