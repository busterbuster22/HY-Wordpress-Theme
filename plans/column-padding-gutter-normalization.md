# Column Padding & Gutter Normalization Plan

**Audit Date:** March 11, 2026  
**Pages Audited:**
- Homepage: `https://staging-ba32-houseyouorg.wpcomstaging.com/`
- Contact Us: `https://staging-ba32-houseyouorg.wpcomstaging.com/2019-2/contact-us/`
- Hoarding 101: `https://staging-ba32-houseyouorg.wpcomstaging.com/hoarding-101-19/`
- Action Page: `https://staging-ba32-houseyouorg.wpcomstaging.com/actions/tax-breaks/`

---

## Executive Summary

The audit reveals **inconsistent column padding** across two-column layouts. The root cause is a combination of:

1. **SCSS rules applying `padding-inline` to ALL columns** - creating 30px internal padding
2. **Editor-defined inline styles** - some columns have custom widths/flex-basis that override defaults
3. **Action Network embed containers** - adding their own 20px padding, creating "double padding"

---

## Task 1: Padding Disconnect Analysis

### Current SCSS Rules

**Location:** [`sass/theme.scss`](sass/theme.scss:377-384) (Mobile-first)

```scss
.wp-block-columns {
    gap: var(--wp--style--block-gap, 0.5em);
}

.wp-block-column {
    padding-inline: var(--wp--custom--gap--baseline);  // 10px
}
```

**Location:** [`sass/theme.scss`](sass/theme.scss:518-525) (Desktop override)

```scss
@media (min-width: 769px) {
    .wp-block-columns {
        gap: var(--wp--custom--gap--horizontal, 30px);
    }

    .wp-block-column {
        padding-inline: var(--wp--custom--gap--horizontal);  // 30px
    }
}
```

### :first-child/:last-child Rules

**Finding:** NO `:first-child` or `:last-child` rules affecting `.wp-block-column` were found in the SCSS. This is NOT the cause of the inconsistency.

### Live Page Measurements

| Page | Columns Block | Left Column Padding | Right Column Padding | Consistent? |
|------|---------------|---------------------|----------------------|-------------|
| **Homepage** | Block 1 | 0px | 0px | ✅ |
| | Block 2 | 0px | **30px** | ❌ |
| | Block 3 | 0px | 0px | ✅ |
| | Block 4 | 0px | 0px | ✅ |
| | Block 5 | 30px | 30px | ✅ |
| | Block 6 (3-col) | 30px each | 30px each | ✅ |
| **Action Page** | Block 1 | 0px | 0px | ✅ |
| | Block 2 | 0px | 0px | ✅ |
| | Block 3 (3-col) | 30px each | 30px each | ✅ |
| **Contact Us** | Block 1 | 0px | 0px | ✅ |
| | Block 2 | 30px | 30px | ✅ |
| | Block 3 (3-col) | 30px each | 30px each | ✅ |
| **Hoarding 101** | Block 1 | 0px | 0px | ✅ |
| | Block 2 | 0px | 0px | ✅ |
| | Block 3 (3-col) | 30px each | 30px each | ✅ |

### Root Cause

The inconsistency on Homepage Block 2 is caused by:
1. The right column has class `home-block` which may have specific overrides
2. The right column has `flex-basis: 45%` set inline, suggesting editor-defined width
3. The SCSS rule applies padding to ALL columns, but some columns have editor overrides

---

## Task 2: Action Network Double Padding

### Current AN Embed Padding

**Finding:** The `#can_embed_form` container has `padding: 20px` applied by Action Network's default stylesheet.

**Impact:** When a column already has `padding-inline: 30px`, the form adds another 20px, creating:
- **Left side:** 30px (column) + 20px (AN) = 50px total
- **Right side:** 30px (column) + 20px (AN) = 50px total

This reduces the effective content width and creates visual inconsistency.

### AN Embed Container Structure

```html
<div class="wp-block-column home-block">
    <div id="can_embed_form" style="padding: 20px;">
        <!-- Form content -->
    </div>
</div>
```

---

## Task 3: Implementation Plan

### Strategy: "Zero-Padding Columns with Inner Spacing"

The best practice approach is:
1. **Reset column padding to 0** - columns should be pure layout containers
2. **Use gap for column separation** - the `gap` property handles spacing between columns
3. **Inner Group blocks handle content padding** - if content needs breathing room, wrap it in a Group with padding

### Proposed CSS Changes

#### Change 1: Reset Column Padding (sass/theme.scss)

**Replace lines 382-384:**

```scss
// OLD
.wp-block-column {
    padding-inline: var(--wp--custom--gap--baseline);
}
```

**With:**

```scss
.wp-block-column {
    // Reset padding - columns are layout containers only
    // Content spacing should be handled by inner Group blocks or gap property
    padding-inline: 0;
}
```

#### Change 2: Update Desktop Override (sass/theme.scss)

**Replace lines 523-525:**

```scss
// OLD
.wp-block-column {
    padding-inline: var(--wp--custom--gap--horizontal);
}
```

**With:**

```scss
.wp-block-column {
    // Maintain zero padding on desktop
    // Gap property handles column separation
    padding-inline: 0;
}
```

#### Change 3: Action Network Override (sass/theme.scss)

Add new section after line 725 (before Action Network form styles):

```scss
/* =========================================================================
   ACTION NETWORK EMBED CONTAINER - REMOVE DEFAULT PADDING
   ========================================================================= */

/* Remove Action Network's default padding to prevent double-padding effect */
#can_embed_form {
    padding: 0 !important;
    background: transparent !important;
}

/* Ensure the form inner content has proper spacing */
#can_embed_form .can_embed_form_inner {
    padding: 0 !important;
}
```

#### Change 4: Optional - Add Utility Class for Padded Columns

For cases where internal column padding IS desired, add a utility class:

```scss
/* Optional: Add padding utility class for columns that need internal spacing */
.wp-block-column.has-inner-padding {
    padding-inline: var(--wp--custom--gap--horizontal, 30px);
}
```

---

## Implementation Checklist

- [ ] Update `.wp-block-column` mobile rule (line ~382)
- [ ] Update `.wp-block-column` desktop rule (line ~523)
- [ ] Add Action Network padding override
- [ ] Compile SCSS: `npm run build`
- [ ] Test Homepage - verify all columns have consistent spacing
- [ ] Test Action Page - verify AN form sits flush with column edges
- [ ] Test Contact Us - verify CF7 form alignment
- [ ] Test Hoarding 101 - verify AN form alignment
- [ ] Review mobile responsiveness (below 769px)

---

## Visual Diagram: Before vs After

### Before (Current State)

```
┌─────────────────────────────────────────────────────────────┐
│ .wp-block-columns (gap: 30px)                               │
│ ┌──────────────────────┐  ┌──────────────────────┐         │
│ │ .wp-block-column     │  │ .wp-block-column     │         │
│ │ padding: 30px        │  │ padding: 30px        │         │
│ │ ┌──────────────────┐ │  │ ┌──────────────────┐ │         │
│ │ │ #can_embed_form  │ │  │ │ Content          │ │         │
│ │ │ padding: 20px    │ │  │ │                  │ │         │
│ │ │ ┌──────────────┐ │ │  │ │                  │ │         │
│ │ │ │ Form Content │ │ │  │ │                  │ │         │
│ │ │ └──────────────┘ │ │  │ └──────────────────┘ │         │
│ │ └──────────────────┘ │  └──────────────────┘ │         │
│ └──────────────────────┘  └──────────────────────┘         │
└─────────────────────────────────────────────────────────────┘

Effective content width: column width - 30px - 30px - 20px - 20px = -100px lost
```

### After (Proposed State)

```
┌─────────────────────────────────────────────────────────────┐
│ .wp-block-columns (gap: 30px)                               │
│ ┌──────────────────────┐  ┌──────────────────────┐         │
│ │ .wp-block-column     │  │ .wp-block-column     │         │
│ │ padding: 0           │  │ padding: 0           │         │
│ │ ┌──────────────────┐ │  │ ┌──────────────────┐ │         │
│ │ │ #can_embed_form  │ │  │ │ Content          │ │         │
│ │ │ padding: 0       │ │  │ │                  │ │         │
│ │ │ ┌──────────────┐ │ │  │ │                  │ │         │
│ │ │ │ Form Content │ │ │  │ │                  │ │         │
│ │ │ └──────────────┘ │ │  │ └──────────────────┘ │         │
│ │ └──────────────────┘ │  └──────────────────┘ │         │
│ └──────────────────────┘  └──────────────────────┘         │
└─────────────────────────────────────────────────────────────┘

Effective content width: column width = full width available
Gap provides separation between columns
```

---

## Risk Assessment

### Low Risk Changes
- Resetting column padding to 0 is a safe change
- Gap property already handles column separation
- Action Network override only affects AN embed containers

### Potential Issues
1. **Existing content may rely on column padding** - if content looks cramped after change, wrap in Group block with padding
2. **Editor-defined inline styles** - some columns have inline styles that may need manual cleanup in the editor

### Mitigation
- Test all pages after deployment
- Provide `.has-inner-padding` utility class for edge cases
- Document the change for content editors

---

## Related Files

- [`sass/theme.scss`](sass/theme.scss) - Main stylesheet (edit here)
- [`assets/theme.css`](assets/theme.css) - Compiled CSS (auto-generated, do not edit)
- [`theme.json`](theme.json) - Theme configuration with gap variables
- [`block-templates/action.html`](block-templates/action.html) - Action page template
- [`block-templates/contact-us.html`](block-templates/contact-us.html) - Contact page template
