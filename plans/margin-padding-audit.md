# Margin & Padding Consistency Audit

**Audit Date:** March 10, 2026  
**Pages Audited:**
- Homepage: `https://staging-ba32-houseyouorg.wpcomstaging.com/`
- Standard Page: `https://staging-ba32-houseyouorg.wpcomstaging.com/hoarding-101/`
- Action Page: `https://staging-ba32-houseyouorg.wpcomstaging.com/actions/tax-breaks/`
- Contact Us: `https://staging-ba32-houseyouorg.wpcomstaging.com/2019-2/contact-us/`

---

## Executive Summary

The audit reveals **critical inconsistencies** in how margins and padding are applied across different page templates:

1. **Homepage** uses a different architecture - content blocks have their own padding (100px top/bottom)
2. **Standard Pages** use main wrapper padding (80px top, 50px bottom) + 10px margin
3. **Action Page** has minimal padding (25px) and no main wrapper padding
4. **Left/Right padding** varies between 0px and 57.6px across pages

---

## 1. Header-to-Content Gap Analysis

### Computed Gap from Header to First Content

| Page | Header Height | Main Top Position | Gap | Source of Gap |
|------|---------------|-------------------|-----|---------------|
| **Homepage** | 203px | 203px | **0px** | Content blocks have internal padding |
| **Standard Page** | 203px | 213px | **10px** | Main margin-top: 10px |
| **Contact Us** | 203px | 213px | **10px** | Main margin-top: 10px |
| **Action Page** | 203px | 203px | **0px** | No main wrapper margin |

### Actual Visible Gap (Header to Content)

| Page | First Block Padding | Total Visible Gap |
|------|--------------------|--------------------|
| **Homepage** | 100px (hero section) | **100px** |
| **Standard Page** | 80px (main wrapper) | **90px** (80px + 10px margin) |
| **Contact Us** | 80px (main wrapper) | **90px** (80px + 10px margin) |
| **Action Page** | 25px (content wrapper) | **25px** |

**Issue:** The Action Page has significantly less gap (25px) compared to other pages (90-100px).

---

## 2. Main Content Area Padding Comparison

### Desktop (1440px)

| Page | Main Element | padding-top | padding-bottom | padding-left | padding-right | margin-top |
|------|--------------|-------------|----------------|--------------|---------------|------------|
| **Homepage** | `<main>` | 0px | 0px | 0px | 0px | 0px |
| **Standard Page** | `<main>` | 80px | 50px | 57.6px | 57.6px | 10px |
| **Contact Us** | `<main>` | 80px | 50px | 57.6px | 57.6px | 10px |
| **Action Page** | `<div>` wrapper | 25px | 25px | 0px | 0px | 0px |

### Key Findings

1. **Homepage** - No padding on main, content blocks manage their own spacing
2. **Standard/Contact Pages** - Consistent 80px/50px padding with 57.6px horizontal
3. **Action Page** - Uses different structure with only 25px padding

---

## 3. Footer Spacing Analysis

| Page | Footer margin-top | Footer padding |
|------|-------------------|----------------|
| **Homepage** | 10px | 0px |
| **Standard Page** | 10px | 0px |
| **Contact Us** | 10px | 0px |
| **Action Page** | 10px | 0px |

**Footer spacing is consistent** across all pages with 10px margin-top.

---

## 4. Block Template Structure Analysis

### Homepage ([`block-templates/home.html`](block-templates/home.html))

```html
<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"}}}} -->
<main class="wp-block-group" style="padding-top:4em;padding-bottom:2.5em">
```

**Issue:** Template defines 4em/2.5em padding but computed values show 0px. This suggests:
- The homepage uses full-width sections that override the main padding
- First content block (`.hero-section`) has `padding-top: 100px`

### Standard Page ([`block-templates/page.html`](block-templates/page.html))

```html
<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"}}},...} -->
<main class="wp-block-group has-white-background-color has-background" style="padding-top:4em;padding-bottom:2.5em">
```

**Computed:** 4em = 80px (at 20px base), 2.5em = 50px ✓

### Contact Us ([`block-templates/contact-us.html`](block-templates/contact-us.html))

```html
<!-- wp:group {"tagName":"main","className":"site-main","style":{"spacing":{"padding":{"top":"4em","bottom":"2.5em"}}},...} -->
<main class="wp-block-group site-main has-white-background-color has-background" style="padding-top:4em;padding-bottom:2.5em">
```

**Computed:** Same as Standard Page ✓

### Action Page ([`block-templates/action.html`](block-templates/action.html))

```html
<!-- wp:group {"className":"site-main","backgroundColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group site-main has-white-background-color has-background">
  <!-- wp:group {"className":"full-width-homepage",...} -->
  <div class="wp-block-group full-width-homepage has-white-background-color has-background">
```

**Issue:** 
- No `<main>` element - uses `<div>` instead
- No padding defined in template
- Relies on `.full-width-homepage` class which only has 25px padding

---

## 5. Horizontal Padding Inconsistency

### Left/Right Padding Comparison

| Page | padding-left | padding-right | Content Width |
|------|--------------|---------------|---------------|
| **Homepage** | 0px | 0px | Full-width sections |
| **Standard Page** | 57.6px | 57.6px | Constrained |
| **Contact Us** | 57.6px | 57.6px | Constrained |
| **Action Page** | 0px | 0px | Full-width |

**The 57.6px comes from:** `var(--wp--custom--spacing--outer)` = `min(4vw, 90px)` = 4% of 1440px = 57.6px

---

## 6. Offender List - Source Code Locations

### Block Template Issues

| File | Line | Issue |
|------|------|-------|
| [`block-templates/action.html`](block-templates/action.html:3) | 3-4 | No `<main>` element, no padding defined |
| [`block-templates/home.html`](block-templates/home.html:3) | 3-4 | Padding defined but overridden by content blocks |

### SCSS Issues

| File | Line | Code | Issue |
|------|------|------|-------|
| [`sass/theme.scss`](sass/theme.scss:374) | 374-376 | `.full-width-homepage:first-child { margin-top: 0 !important; }` | Removes top margin |
| [`sass/theme.scss`](sass/theme.scss:523) | 523-525 | Media query overrides for homepage | Inconsistent mobile handling |

---

## 7. Root Cause Analysis

### Problem 1: Inconsistent Header-to-Content Gap

**Cause:** Different page templates use different approaches:
- Homepage: Content blocks self-manage padding (100px)
- Standard Pages: Main wrapper has 4em padding (80px) + 10px margin
- Action Page: Only 25px from `.full-width-homepage` class

**Impact:** Action Page looks "cramped" compared to other pages.

### Problem 2: Missing Main Element on Action Page

**Cause:** [`block-templates/action.html`](block-templates/action.html:3) uses `<div>` instead of `<main>`.

**Impact:** 
- Semantic HTML issue (accessibility)
- Different CSS rules apply to div vs main

### Problem 3: Horizontal Padding Variance

**Cause:** Some templates use `layout: {type: "constrained"}` which applies `has-global-padding`, while others don't.

**Impact:** Content width varies between pages.

---

## 8. Recommended Standardization

### Best Practice Margin Structure

All pages should follow this consistent pattern:

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (height: ~203px, no padding)                         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ MAIN CONTENT                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ padding-top: var(--wp--custom--spacing--medium)         │ │
│ │             = clamp(30px, 8vw, 100px)                   │ │
│ │                                                         │ │
│ │ padding-bottom: var(--wp--custom--spacing--medium)      │ │
│ │               = clamp(30px, 8vw, 100px)                 │ │
│ │                                                         │ │
│ │ padding-left: var(--wp--custom--spacing--outer)         │ │
│ │             = min(4vw, 90px)                            │ │
│ │                                                         │ │
│ │ padding-right: var(--wp--custom--spacing--outer)        │ │
│ │              = min(4vw, 90px)                           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ FOOTER (margin-top: 10px)                                   │
└─────────────────────────────────────────────────────────────┘
```

### Recommended Template Structure

All templates should use:

```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group has-global-padding is-layout-constrained">
  <!-- Content here -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer","className":"site-footer-container"} /-->
```

---

## 9. Implementation Checklist

### Immediate Fixes Required

- [ ] **Action Page:** Add `<main>` element with proper padding
- [ ] **Action Page:** Increase top padding from 25px to match standard (80px)
- [ ] **Homepage:** Ensure main wrapper has consistent padding structure
- [ ] **All Pages:** Use CSS variables for spacing instead of hardcoded values

### CSS Variables to Use

```css
--wp--custom--spacing--medium: clamp(30px, 8vw, 100px);  /* Vertical spacing */
--wp--custom--spacing--outer: min(4vw, 90px);            /* Horizontal padding */
--wp--custom--gap--baseline: 10px;                        /* Footer margin-top */
```

---

## 10. Visual Comparison

### Current State

```
Homepage:     Header ──[100px]── Content
Standard:     Header ──[90px]─── Content  
Contact:      Header ──[90px]─── Content
Action:       Header ──[25px]─── Content  ← INCONSISTENT
```

### Target State

```
All Pages:    Header ──[80-100px]── Content (consistent)
```

---

**Report Generated:** March 10, 2026  
**Auditor:** Claude (Architect Mode)
