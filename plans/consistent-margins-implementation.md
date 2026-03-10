# Implementation Plan: Consistent Margins Across All Pages

## Overview

This plan addresses the inconsistent margin/padding across different page templates in the House You theme. The goal is to ensure all pages have consistent margins that match the header and footer (57px padding on each side).

## Current State Analysis

### Problem Summary

| Template | Current Content Width | Issue |
|----------|----------------------|-------|
| `home.html` | ~1297px (full-width) | Works correctly |
| `page.html` | 684px | Too narrow due to 373px margins |
| `an-events.html` | 813px | Narrower than header/footer |
| `action.html` | 813px | Narrower than header/footer |

### Root Causes

1. **`theme.json` has `contentSize: 684px`** - too narrow
2. **`page.html` has hardcoded margins** - `margin-right/left: var(--wp--preset--spacing--80)`
3. **Inconsistent layout types** across templates

---

## Implementation Steps

### Phase 1: Update theme.json Layout Settings

**File:** [`theme.json`](theme.json:264-267)

**Current:**
```json
"layout": {
    "contentSize": "684px",
    "wideSize": "1160px"
}
```

**Change to:**
```json
"layout": {
    "contentSize": "1160px",
    "wideSize": "1400px"
}
```

**Rationale:** 
- `contentSize` should match the desired content width
- `wideSize` provides a wider option for `alignwide` blocks
- 1160px matches the current `wideSize` which works well with header/footer

---

### Phase 2: Update page.html Template

**File:** [`block-templates/page.html`](block-templates/page.html:1-7)

**Current:**
```html
<!-- wp:template-part {"slug":"header","theme":"house-you","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"},"margin":{"right":"var:preset|spacing|80","left":"var:preset|spacing|80"}}},"backgroundColor":"white","layout":{"type":"constrained"}} -->
<main class="wp-block-group has-white-background-color has-background" style="padding-top:4em;padding-bottom:2.5em;margin-right:var(--wp--preset--spacing--80);margin-left:var(--wp--preset--spacing--80)"><!-- wp:post-content {"style":{"spacing":{"blockGap":"0"},"elements":{"link":{"color":{"text":"var:preset|color|primary"}}}},"textColor":"black"} /--></main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","theme":"house-you","tagName":"footer","className":"site-footer-container"} /-->
```

**Change to:**
```html
<!-- wp:template-part {"slug":"header","theme":"house-you","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group" style="padding-top:4em;padding-bottom:2.5em">
    <!-- wp:post-content {"style":{"spacing":{"blockGap":"0"},"elements":{"link":{"color":{"text":"var:preset|color|primary"}}}},"textColor":"black"} /-->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","theme":"house-you","tagName":"footer","className":"site-footer-container"} /-->
```

**Changes:**
- Remove `margin":{"right":"var:preset|spacing|80","left":"var:preset|spacing|80"`
- Remove `backgroundColor":"white"`
- Keep `layout":{"type":"constrained"}` to respect theme.json contentSize

---

### Phase 3: Update an-events.html Template

**File:** [`block-templates/an-events.html`](block-templates/an-events.html:1-31)

**Current structure uses:**
- `site-main` class with `layout":{"type":"constrained"}`
- `full-width-homepage` class with `layout":{"type":"constrained","contentSize":"100%"}`

**Change to:**
```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
    <!-- wp:group {"className":"full-width-homepage","backgroundColor":"white","layout":{"type":"constrained"}} -->
    <div class="wp-block-group full-width-homepage has-white-background-color has-background">
        <!-- wp:columns {"className":"home-block","backgroundColor":"white"} -->
        <div class="wp-block-columns home-block has-white-background-color has-background">
            <!-- wp:column {"className":"home-block"} -->
            <div class="wp-block-column home-block">
                <!-- wp:post-title /-->
                <!-- wp:post-content {"style":{"elements":{"link":{"color":{"text":"var:preset|color|primary"}},"h1":{"color":{"text":"var:preset|color|black"}},"h2":{"color":{"text":"var:preset|color|black"}}}},"textColor":"black"} /-->
            </div>
            <!-- /wp:column -->

            <!-- wp:column {"verticalAlignment":"top","width":"35%","className":"home-block","style":{"spacing":{"padding":{"top":"var:preset|spacing|70"}}},"textColor":"primary"} -->
            <div class="wp-block-column is-vertically-aligned-top home-block has-primary-color has-text-color" style="padding-top:var(--wp--preset--spacing--70);flex-basis:35%">
                <!-- wp:post-featured-image {"width":"100%","height":"","scale":"contain","align":"center"} /-->
                <!-- wp:shortcode -->[event_meta_display]<!-- /wp:shortcode -->
                <!-- wp:heading {"level":3,"style":{"border":{"top":{"width":"10px"}}}} -->
                <h3 class="wp-block-heading" style="border-top-width:10px">RSVP HERE</h3>
                <!-- /wp:heading -->
                <!-- wp:shortcode -->[action_network_embed]<!-- /wp:shortcode -->
            </div>
            <!-- /wp:column -->
        </div>
        <!-- /wp:columns -->
    </div>
    <!-- /wp:group -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer","className":"site-footer-container"} /-->
```

**Changes:**
- Remove `layout":{"type":"constrained","contentSize":"100%"}` from full-width-homepage group
- Keep `layout":{"type":"constrained"}` on main to respect theme.json settings

---

### Phase 4: Update action.html Template

**File:** [`block-templates/action.html`](block-templates/action.html:1-27)

Apply the same changes as `an-events.html`:
- Remove `contentSize":"100%"` from layout settings
- Keep constrained layout on main wrapper

---

### Phase 5: Add Content Container Utility Class

**File:** [`sass/theme.scss`](sass/theme.scss)

Add a utility class for content that needs consistent padding:

```scss
/* Content Container - matches header/footer padding */
.content-container {
    max-width: 1160px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 57px;
    padding-right: 57px;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding-left: 20px;
        padding-right: 20px;
    }
}

/* Full-width sections - edge to edge */
.full-width-content {
    margin-left: calc(-1 * var(--wp--custom--spacing--outer, 57px));
    margin-right: calc(-1 * var(--wp--custom--spacing--outer, 57px));
    padding-left: var(--wp--custom--spacing--outer, 57px);
    padding-right: var(--wp--custom--spacing--outer, 57px);
}
```

---

### Phase 6: Update Existing CSS Rules

**File:** [`sass/theme.scss`](sass/theme.scss)

Review and update these existing rules to work with the new layout:

1. **Lines 446-452** - Site main rules:
```scss
/* Main content area - respects constrained layout */
.site-main {
    width: 100%;
    max-width: 100%;
}
```

2. **Lines 473-478** - Full-width homepage rules:
```scss
/* Full-width sections break out of constrained layout */
.is-layout-constrained .full-width-homepage,
.is-layout-constrained .alignfull {
    margin-left: calc(-1 * var(--wp--custom--spacing--outer, 57px)) !important;
    margin-right: calc(-1 * var(--wp--custom--spacing--outer, 57px)) !important;
    max-width: none !important;
    width: calc(100% + 2 * var(--wp--custom--spacing--outer, 57px)) !important;
}
```

---

## Testing Checklist

After implementation, test the following:

### Visual Consistency
- [ ] Header padding matches content padding on all pages
- [ ] Footer padding matches content padding on all pages
- [ ] Content width is consistent across all page types
- [ ] Full-width sections still break out correctly

### Pages to Test
- [ ] Home page (`/`)
- [ ] Hoarding 101 (`/hoarding-101/`)
- [ ] About Us (`/2019-2/about-us/`)
- [ ] Events page (`/events/`)
- [ ] Single event (`/hoarding-101-19/`)
- [ ] Action pages

### Responsive Testing
- [ ] Desktop (1400px+)
- [ ] Tablet (768px - 1200px)
- [ ] Mobile (< 768px)

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## Rollback Plan

If issues arise, revert changes in this order:

1. Revert `theme.json` layout settings to original values
2. Revert `page.html` template to original markup
3. Revert `an-events.html` and `action.html` templates
4. Remove new CSS utility classes

---

## Expected Outcome

After implementation:

| Page Type | Before | After |
|-----------|--------|-------|
| Home | ~1297px | ~1297px (unchanged) |
| Standard Page | 684px | ~1160px |
| Event Page | 813px | ~1160px |
| Action Page | 813px | ~1160px |

All pages will have consistent content width that matches the header and footer padding (57px each side).