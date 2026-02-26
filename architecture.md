# House You Theme - Architecture Documentation

## Overview

This document records architectural decisions, learnings, and changes made to the House You WordPress theme.

---

## Issue: Black Bar on Right Side of Pages

### Date: 2026-02-26

### Problem Description

A black/dark grey vertical bar appeared on the right side of every page, including headers and footers. The bar:
- Appeared on all pages
- Was visible even when groups had 100% width backgrounds or hero images
- Allowed horizontal scrolling to reveal more of the bar
- Matched the ash-grey background color (`#141414` / `#2D2A2E`)

### Root Cause

The issue was caused by the CSS technique used to create full-width elements that break out of their containers:

```css
/* OLD PROBLEMATIC CODE */
.element {
  width: 100vw;
  max-width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
```

**Why this caused the problem:**

1. **`100vw` includes scrollbar width**: When a vertical scrollbar is present, `100vw` calculates the width as 100% of the viewport width INCLUDING the scrollbar width (typically 15-17px).

2. **Content alignment**: Content is left-aligned by default, so the left edge aligns with the viewport, but the right edge extends beyond by the scrollbar width.

3. **Horizontal overflow**: This creates horizontal overflow, allowing users to scroll right and see the body background color (ash-grey/black) in the overflow area.

4. **WordPress layout constraints**: The theme.json had narrow layout constraints (`contentSize: 684px`, `wideSize: 1160px`) which conflicted with the CSS trying to make elements full-width.

### Solution

#### 1. CSS Changes (`assets/theme.css`)

**Added overflow prevention and layout fixes:**

```css
/* Prevent horizontal overflow */
html, body {
  overflow-x: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* Ensure body has white background */
body {
  background-color: var(--wp--preset--color--white, #FFFFFF) !important;
}

/* Ensure site blocks container fills the viewport */
.wp-site-blocks {
  background-color: var(--wp--preset--color--white, #FFFFFF);
  width: 100%;
  max-width: 100%;
}

/* Override WordPress layout constraints */
.is-layout-constrained {
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
```

**Changed all `100vw` instances to `100%`:**

| Selector | Before | After |
|----------|--------|-------|
| `.wp-block-group.is-style-full-width` | `width: 100vw` + negative margins | `width: 100%` |
| `.full-width-homepage` | `width: 100vw` + negative margins | `width: 100%` |
| `header.wp-block-template-part` | `width: 100vw` + negative margins | `width: 100%` |
| `footer.wp-block-template-part .wp-block-group.alignfull.pre-footer` | `width: 100vw` + negative margins | `width: 100%` |

#### 2. Theme Configuration Changes (`theme.json`)

**Updated layout constraints:**

```json
// Before
"layout": {
  "contentSize": "684px",
  "wideSize": "1160px"
}

// After
"layout": {
  "contentSize": "1800px",
  "wideSize": "100%"
}
```

This was updated in both the root `settings.layout` and `settings.custom.layout` sections.

### Key Learnings

1. **Avoid `100vw` for full-width layouts**: The `100vw` unit includes scrollbar width and causes horizontal overflow. Use `width: 100%` instead.

2. **The negative margin technique is problematic**: Using `margin-left: -50vw` to break elements out of containers relies on `100vw` and inherits the same scrollbar issue.

3. **WordPress layout constraints matter**: The `theme.json` layout settings (`contentSize`, `wideSize`) affect how WordPress renders blocks and can conflict with custom CSS.

4. **Always set explicit body background**: Without an explicit white background on the body, the default or inherited background color shows in overflow areas.

5. **Use `overflow-x: hidden` as a safety net**: Even with proper width settings, adding `overflow-x: hidden` to `html` and `body` prevents accidental horizontal scrolling.

### Best Practices for Future Development

1. **Full-width sections**: Use `width: 100%` with proper container structure, not `100vw` with negative margins.

2. **Content containers**: Use `max-width: 1800px` (or desired width) with `margin: 0 auto` for centered content within full-width sections.

3. **Layout testing**: Always test pages with and without scrollbars, and at various zoom levels.

4. **WordPress block themes**: Be aware of `theme.json` layout constraints and ensure CSS aligns with these settings.

---

## Theme Structure

### Key Files

- `theme.json` - Theme configuration, color palette, typography, layout settings
- `assets/theme.css` - Custom CSS styles
- `block-templates/` - Page templates (HTML block templates)
- `block-template-parts/` - Reusable template parts (header, footer)

### Color Palette

| Slug | Color | Name |
|------|-------|------|
| `ash-grey` | `#141414` | Ash Grey Background |
| `house-you-pink` | `#CB1EAA` | House You Pink |
| `white` | `#FFFFFF` | White |
| `hot-pink` | `#E64BC8` | Hot Pink |
| `orange` | `#FB903A` | Orange |

### Layout Constants

- **Max content width**: `1800px`
- **Mobile breakpoint**: `768px` (styles use `769px` for desktop)
- **Default padding (mobile)**: `20px`
- **Default padding (desktop)**: `40px`

---

## Changelog

### 2026-02-26
- Fixed black bar issue on right side of pages
- Changed all `100vw` width values to `100%`
- Updated `theme.json` layout constraints
- Added overflow prevention CSS
- Added explicit body background color
