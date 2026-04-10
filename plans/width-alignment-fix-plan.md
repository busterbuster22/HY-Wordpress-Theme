# Width Alignment Fix Plan - Option B

## Objective
Synchronize the maximum widths of the Header, Footer, and Main Content area to **1400px** (wideSize) using WordPress Block Theme best practices.

---

## Current State Analysis

### theme.json Settings (Current)
| Setting | Current Value | Target Value |
|---------|---------------|--------------|
| `contentSize` | 1160px | **1400px** |
| `wideSize` | 1400px | 1400px (unchanged) |

### SCSS Overrides (Current Problem)
The following hard-coded rules in [`sass/theme.scss`](../sass/theme.scss) bypass the WordPress layout system:

| Line(s) | Selector | Current Value | Issue |
|---------|----------|---------------|-------|
| 333-340 | `.content-container` | 1800px | Bypasses theme.json |
| 406-414 | `header.wp-block-template-part .wp-block-columns.header-columns` | 1800px | Bypasses theme.json |
| 440-448 | `footer.wp-block-template-part .wp-block-columns, .wp-block-paragraph` | 1800px | Bypasses theme.json |
| 469-475 | `footer.site-footer-container > .wp-block-group` | 1800px | Bypasses theme.json |
| 363-370 | `.full-width-homepage` children | 1800px | Bypasses theme.json |

---

## Implementation Plan

### Phase 1: Update theme.json

**File:** [`theme.json`](../theme.json)

**Change:** Update `contentSize` from 1160px to 1400px

**Locations to update:**
1. Line ~252: `settings.layout.contentSize`
2. Line ~266: `custom.layout.contentSize` (if exists - need to verify)

```json
// Before
"layout": {
    "contentSize": "1160px",
    "wideSize": "1400px"
}

// After
"layout": {
    "contentSize": "1400px",
    "wideSize": "1400px"
}
```

**Note:** Setting both to 1400px means all constrained content will use 1400px as the maximum width.

---

### Phase 2: Remove SCSS Width Overrides

**File:** [`sass/theme.scss`](../sass/theme.scss)

#### 2.1 Update `.content-container` class (Lines 333-340)

**Before:**
```scss
.content-container {
    max-width: 1800px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
    box-sizing: border-box !important;
}
```

**After:**
```scss
.content-container {
    max-width: var(--wp--style--global--wide-size, 1400px);
    margin-left: auto !important;
    margin-right: auto !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
    box-sizing: border-box !important;
}
```

#### 2.2 Update header columns (Lines 406-414)

**Before:**
```scss
header.wp-block-template-part .wp-block-columns.header-columns {
    max-width: 1800px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
    box-sizing: border-box !important;
    width: 100% !important;
}
```

**After:**
```scss
header.wp-block-template-part .wp-block-columns.header-columns {
    max-width: var(--wp--style--global--wide-size, 1400px);
    margin-left: auto !important;
    margin-right: auto !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
    box-sizing: border-box !important;
    width: 100% !important;
}
```

#### 2.3 Update footer content (Lines 440-448)

**Before:**
```scss
footer.wp-block-template-part .wp-block-columns,
footer.wp-block-template-part .wp-block-paragraph {
    max-width: 1800px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
    box-sizing: border-box !important;
}
```

**After:**
```scss
footer.wp-block-template-part .wp-block-columns,
footer.wp-block-template-part .wp-block-paragraph {
    max-width: var(--wp--style--global--wide-size, 1400px);
    margin-left: auto !important;
    margin-right: auto !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
    box-sizing: border-box !important;
}
```

#### 2.4 Update footer group (Lines 469-475)

**Before:**
```scss
footer.site-footer-container > .wp-block-group {
    max-width: 1800px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
}
```

**After:**
```scss
footer.site-footer-container > .wp-block-group {
    max-width: var(--wp--style--global--wide-size, 1400px);
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
}
```

#### 2.5 Update full-width-homepage children (Lines 363-370)

**Before:**
```scss
.full-width-homepage .wp-block-columns,
.full-width-homepage > .wp-block-heading,
.full-width-homepage > .wp-block-paragraph,
.full-width-homepage > .petition-row,
.full-width-homepage > .content-container {
    max-width: 1800px !important;
    ...
}
```

**After:**
```scss
.full-width-homepage .wp-block-columns,
.full-width-homepage > .wp-block-heading,
.full-width-homepage > .wp-block-paragraph,
.full-width-homepage > .petition-row,
.full-width-homepage > .content-container {
    max-width: var(--wp--style--global--wide-size, 1400px);
    ...
}
```

---

### Phase 3: Update Template Parts (Optional Enhancement)

Consider updating the header and footer template parts to use WordPress's native layout system instead of relying on SCSS overrides.

#### 3.1 Header Template Part

**File:** [`block-template-parts/header.html`](../block-template-parts/header.html)

**Current:**
```html
<!-- wp:group {"align":"full","backgroundColor":"ash-grey","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull has-ash-grey-background-color has-background">
    <!-- wp:columns {"isStackedOnMobile":false,"className":"header-columns"} -->
    ...
```

**Recommended:**
```html
<!-- wp:group {"align":"full","backgroundColor":"ash-grey","layout":{"type":"constrained","contentSize":"1400px"}} -->
<div class="wp-block-group alignfull has-ash-grey-background-color has-background is-layout-constrained">
    <!-- wp:columns {"isStackedOnMobile":false,"className":"header-columns","align":"wide"} -->
    ...
```

This would apply the constrained layout natively, potentially eliminating the need for SCSS max-width rules entirely.

#### 3.2 Footer Template Part

**File:** [`block-template-parts/footer.html`](../block-template-parts/footer.html)

Apply similar layout attributes to the footer groups.

---

## Testing Checklist

After implementation, verify the following:

- [ ] Header inner content max-width = 1400px
- [ ] Footer inner content max-width = 1400px
- [ ] Main content area max-width = 1400px
- [ ] All three areas align vertically on the left and right edges
- [ ] Responsive behavior works correctly on mobile/tablet
- [ ] No visual regressions on other pages using `.content-container`
- [ ] Full-width homepage sections still work correctly
- [ ] Compile SCSS and clear any caches

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Content appears wider than intended | Low | 1400px is only 240px wider than current 1160px |
| Some pages may rely on 1800px width | Medium | Test all page templates after change |
| SCSS variable fallback needed | Low | Using CSS variable with px fallback |

---

## Files to Modify

1. [`theme.json`](../theme.json) - Update contentSize
2. [`sass/theme.scss`](../sass/theme.scss) - Replace hard-coded 1800px with CSS variable
3. [`block-template-parts/header.html`](../block-template-parts/header.html) - Optional: Add layout attributes
4. [`block-template-parts/footer.html`](../block-template-parts/footer.html) - Optional: Add layout attributes

---

## Execution Order

1. Update `theme.json` contentSize to 1400px
2. Update SCSS max-width values to use CSS variable
3. Compile SCSS to CSS
4. Test on contact-us page
5. Test on other page templates
6. Deploy to staging for final verification
