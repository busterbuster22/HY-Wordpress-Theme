# CSS/DOM Inconsistency Report
## Typography & Spacing Audit - March 2026

### Executive Summary

A comprehensive CSS/DOM audit was performed across 4 page templates on the staging site. The audit reveals **significant conflicts** between [`theme.json`](theme.json) settings and legacy SCSS rules in [`sass/theme.scss`](sass/theme.scss:1). The primary issues are:

1. **Font Family Override** - SCSS hardcodes "League Spartan" and "Inter" instead of theme.json's "Red Hat Display"
2. **Font Size Override** - SCSS uses `!important` to override fluid responsive typography
3. **Margin Collapse** - SCSS zeros out heading margins that theme.json defines with CSS variables
4. **Arbitrary Padding** - Multiple selectors inject hardcoded pixel values instead of using spacing variables

---

## 1. Typography Inconsistencies

### 1.1 Font Family Conflicts

| Element | theme.json Expected | Computed Actual | Source |
|---------|---------------------|-----------------|--------|
| All elements | `"Red Hat Display", sans-serif` | `"League Spartan"` or `Inter` or `glacial-indifference` | SCSS override |
| h2, h3, h4 | `"Red Hat Display", sans-serif` | `"League Spartan"` | [`sass/theme.scss:564-568`](sass/theme.scss:564) |
| p (hero) | `"Red Hat Display", sans-serif` | `Inter, sans-serif` | [`sass/theme.scss:587-597`](sass/theme.scss:587) |
| p (site-main) | `"Red Hat Display", sans-serif` | `glacial-indifference` | Unknown source (possibly plugin) |

**Problematic SCSS Selectors:**

```scss
/* Line 337 - Imports fonts NOT in theme.json */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@600;800&display=swap');

/* Lines 564-568 - Override theme.json font-family */
h1 { font-size: 2.5em !important; }
h2 { font-size: 2em !important; }
h3 { font-size: 1.6em !important; margin-top: 0 !important; margin-bottom: 0 !important; }
h4 { font-size: 1.2em !important; margin-top: 0 !important; margin-bottom: 0 !important; }
h5 { font-size: 1em !important; margin-top: 0 !important; margin-bottom: 0 !important; }

/* Lines 571-577 - Intro block uses League Spartan */
.intro-block {
    font-family: 'League Spartan', sans-serif !important;
    ...
}

/* Lines 587-597 - Hero section uses Inter */
.hero-section p,
.hero-section h3,
.hero-section h5,
.hero-section .intro-block,
.hero-section li {
    font-family: 'Inter', sans-serif;
    ...
}
```

### 1.2 Font Size Conflicts

| Element | theme.json Value | Computed Value | Issue |
|---------|------------------|----------------|-------|
| h1 | `min(max(3rem, 7vw), 4.5rem)` (fluid) | `40px` (fixed) | SCSS `2.5em !important` overrides fluid sizing |
| h2 | `min(max(2.25rem, 5vw), 4rem)` (fluid) | `40px` (fixed) | SCSS `2em !important` overrides fluid sizing |
| h3 | `min(max(1.875rem, 5vw), 3rem)` (fluid) | `32px` (fixed) | SCSS `1.6em !important` overrides fluid sizing |
| h4 | `1.25rem` (via custom font-size--normal) | `24px` (fixed) | SCSS `1.2em !important` overrides |
| p | `1.25rem` (via custom font-sizes--normal) | `20-24px` (varies) | SCSS `.site-main p { font-size: 1.3rem; }` |

**theme.json Typography Settings (Lines 491-574):**
```json
"h1": {
    "typography": {
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

### 1.3 Font Weight Conflicts

| Element | theme.json | Computed | Source |
|---------|------------|----------|--------|
| h2 | `900` | `700-900` (varies) | Inconsistent across templates |
| h3 | `900` | `900` | Matches |
| h4 | `900` | `900` | Matches |
| p | `400` | `400-500` (varies) | SCSS overrides in hero sections |

### 1.4 Line Height Conflicts

| Element | theme.json | Computed | Issue |
|---------|------------|----------|-------|
| h1 | `1.2` | `48px` (fixed pixel) | Converted from fluid |
| h2 | `1.2` | `48px` (fixed pixel) | Converted from fluid |
| h3 | `1.3` | `41.6px` (fixed pixel) | Converted from fluid |
| p | `1.6` | `28.8-38.4px` (varies) | Inconsistent across templates |

---

## 2. Block Spacing Inconsistencies

### 2.1 Heading Margins

**theme.json defines responsive margins using CSS variables:**
```json
"h2": {
    "spacing": {
        "margin": {
            "top": "var(--wp--custom--gap--vertical)",
            "bottom": "var(--wp--custom--gap--vertical)"
        }
    }
}
```

**SCSS zeros these margins:**

```scss
/* Lines 566-568 */
h3 { font-size: 1.6em !important; margin-top: 0 !important; margin-bottom: 0 !important; }
h4 { font-size: 1.2em !important; margin-top: 0 !important; margin-bottom: 0 !important; }
h5 { font-size: 1em !important; margin-top: 0 !important; margin-bottom: 0 !important; }
```

**Computed Results Across Templates:**

| Element | Homepage | Standard Page | Event Page | Action Page |
|---------|----------|---------------|------------|-------------|
| h2 margin-top | `30px` | `0px` | `0px` | `0px` |
| h2 margin-bottom | `30px` | `0px` | `40px` | `40px` |
| h3 margin-top | `0px` | `0px` | `0px` | `0px` |
| h3 margin-bottom | `0px` | `0px` | `0px` | `0px` |
| h4 margin-top | `0px` | `0px` | `0px` | `0px` |
| h4 margin-bottom | `0px` | `0px` | `0px` | `15px` |

### 2.2 Paragraph Spacing

**SCSS adds arbitrary padding to paragraphs:**

```scss
/* Lines 580-584 */
.site-main p {
    font-size: 1.3rem;
    line-height: 1.6;
    padding: 5px 0;  /* Arbitrary padding instead of margin */
}
```

**Computed Results:**

| Template | p padding-top | p padding-bottom | p margin-top | p margin-bottom |
|----------|---------------|------------------|--------------|-----------------|
| Homepage | `6px` | `6px` | `0px` | `0px` |
| Standard Page | `0px` | `0px` | `0px` | `0px` |
| Event Page | `5px` | `5px` | `0px` | `0px` |
| Action Page | `5px` | `5px` | `12px` | `0px` |

### 2.3 Block Gaps

**theme.json defines:**
```json
"spacing": {
    "blockGap": "0.5em"
}
```

**SCSS overrides:**

```scss
/* Lines 408-410 */
.wp-block-columns {
    gap: 20px;  /* Mobile */
}

/* Lines 550-552 (desktop) */
@media (min-width: 769px) {
    .wp-block-columns {
        gap: 40px;
    }
}
```

**Computed Results:**
- `.wp-block-columns` gap: `40px` (hardcoded, not using `var(--wp--style--block-gap)`)
- `.wp-block-group` gap: `normal` (browser default, not theme.json's `0.5em`)

---

## 3. Container Padding Inconsistencies

### 3.1 Main Content Wrappers

**theme.json defines root padding:**
```json
"styles": {
    "spacing": {
        "padding": {
            "right": "var(--wp--custom--spacing--outer)",
            "left": "var(--wp--custom--spacing--outer)"
        }
    }
}
```

**Computed Container Padding Across Templates:**

| Container | Homepage | Standard Page | Event Page | Action Page |
|-----------|----------|---------------|------------|-------------|
| `main` padding-top | `0px` | `80px` | N/A | N/A |
| `main` padding-bottom | `0px` | `50px` | N/A | N/A |
| `main` padding-left | `0px` | `57.08px` | N/A | N/A |
| `main` padding-right | `0px` | `57.08px` | N/A | N/A |
| `.site-main` padding | `0px` all | `0px` all | `0px` all | `0px` all |
| `.wp-block-group` padding-top | `25px` | `25px` | `25px` | `25px` |
| `.wp-block-group` padding-bottom | `25px` | `25px` | `25px` | `25px` |
| `.wp-block-group` padding-left | `57.08px` | `57.08px` | `0px` | `57.08px` |
| `.wp-block-group` padding-right | `57.08px` | `57.08px` | `0px` | `57.08px` |

### 3.2 Section Style Padding

**SCSS adds hardcoded padding to section styles:**

```scss
/* Lines 224-235, 238-249, 252-263 */
.wp-block-group.is-style-dark-section,
.wp-block-cover.is-style-dark-section {
    padding: 60px 0 !important;  /* Hardcoded, not using spacing variables */
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    ...
}
```

**Should use:**
```scss
padding: var(--wp--custom--spacing--medium) var(--wp--custom--spacing--outer);
```

### 3.3 Full Width Homepage Sections

**SCSS adds arbitrary padding:**

```scss
/* Lines 377-385 */
main .full-width-homepage:first-child {
    margin-top: 0 !important;
    padding-top: 60px !important;  /* Hardcoded */
}

main .full-width-homepage:last-child {
    margin-bottom: 0 !important;
    padding-bottom: 60px !important;  /* Hardcoded */
}
```

### 3.4 Content Section

**SCSS defines:**

```scss
/* Lines 402-405 */
.content-section {
    padding-top: 40px;
    padding-bottom: 40px;
}

/* Lines 537-540 (desktop) */
@media (min-width: 769px) {
    .content-section {
        padding-top: 60px;
        padding-bottom: 60px;
    }
}
```

**Should use:**
```scss
.content-section {
    padding-top: var(--wp--custom--spacing--small);
    padding-bottom: var(--wp--custom--spacing--small);
}
```

---

## 4. CSS Selectors to Delete or Refactor

### 4.1 DELETE - Typography Overrides

These selectors use `!important` to override theme.json typography:

| Line(s) | Selector | Action |
|---------|----------|--------|
| 564-568 | `h1, h2, h3, h4, h5` font-size rules | **DELETE** - Let theme.json fluid typography work |
| 566-568 | `h3, h4, h5` margin rules | **DELETE** - Zeroing margins breaks vertical rhythm |
| 580-584 | `.site-main p` | **REFACTOR** - Remove font-size and padding, use theme.json |

### 4.2 DELETE - Font Imports

| Line | Code | Action |
|------|------|--------|
| 337 | `@import url('https://fonts.googleapis.com/css2?family=Inter...')` | **DELETE** - Inter not in theme.json |
| N/A | League Spartan references | **DELETE** - Not defined in theme.json fontFamilies |

### 4.3 REFACTOR - Spacing to Use CSS Variables

| Line(s) | Selector | Current | Change To |
|---------|----------|---------|-----------|
| 228 | `.is-style-dark-section` | `padding: 60px 0 !important;` | `padding: var(--wp--custom--spacing--medium) var(--wp--custom--spacing--outer);` |
| 242 | `.is-style-light-section` | `padding: 60px 0 !important;` | `padding: var(--wp--custom--spacing--medium) var(--wp--custom--spacing--outer);` |
| 256 | `.is-style-pink-section` | `padding: 60px 0 !important;` | `padding: var(--wp--custom--spacing--medium) var(--wp--custom--spacing--outer);` |
| 379 | `main .full-width-homepage:first-child` | `padding-top: 60px !important;` | `padding-top: var(--wp--custom--spacing--medium) !important;` |
| 383 | `main .full-width-homepage:last-child` | `padding-bottom: 60px !important;` | `padding-bottom: var(--wp--custom--spacing--medium) !important;` |
| 403-405 | `.content-section` | `padding-top: 40px; padding-bottom: 40px;` | `padding-block: var(--wp--custom--spacing--small);` |
| 409 | `.wp-block-columns` | `gap: 20px;` | `gap: var(--wp--style--block-gap, 0.5em);` |
| 551 | `.wp-block-columns` (desktop) | `gap: 40px;` | Remove or use spacing variable |

### 4.4 REFACTOR - Hero Section Typography

| Line(s) | Selector | Issue |
|---------|----------|-------|
| 587-597 | `.hero-section p, .hero-section h3, ...` | Uses Inter font instead of Red Hat Display |
| 599-605 | `.hero-section p, .hero-section li` | Hardcoded `font-size: 25px` and `font-weight: 500` |

**Recommendation:** Either add Inter to theme.json as a secondary font, or use Red Hat Display consistently.

---

## 5. Unknown Font Source Investigation

The computed styles show `glacial-indifference` as the font-family for some elements. This font is NOT defined in:
- [`theme.json`](theme.json)
- [`sass/theme.scss`](sass/theme.scss)

**Possible sources:**
1. WordPress plugin (e.g., typography plugin)
2. Theme previously used this font and it's cached
3. External stylesheet from WordPress.com

**Action Required:** Search the codebase and database for `glacial-indifference` references.

---

## 6. Summary of Required Changes

### Immediate Actions (High Priority)

1. **Delete lines 564-568** in [`sass/theme.scss`](sass/theme.scss:564) - Remove hardcoded heading font-sizes and margins
2. **Delete line 337** - Remove Google Fonts import for Inter
3. **Refactor lines 228, 242, 256** - Replace `60px` padding with spacing variables
4. **Refactor line 409** - Use CSS variable for block gap

### Secondary Actions (Medium Priority)

1. **Refactor `.site-main p`** (lines 580-584) - Remove font-size override
2. **Refactor `.hero-section` typography** (lines 587-614) - Use theme.json fonts
3. **Refactor `.content-section`** (lines 402-405) - Use spacing variables
4. **Investigate `glacial-indifference` font source**

### Architecture Decision Required

**Question:** Should the theme use:
- **Option A:** Red Hat Display only (as per theme.json)
- **Option B:** Red Hat Display + Inter + League Spartan (requires theme.json update)

If Option B, update [`theme.json`](theme.json:282-287) to include:

```json
"fontFamilies": [
    {
        "fontFamily": "\"Red Hat Display\", sans-serif",
        "slug": "red-hat-display",
        "name": "Red Hat Display"
    },
    {
        "fontFamily": "\"Inter\", sans-serif",
        "slug": "inter",
        "name": "Inter"
    },
    {
        "fontFamily": "\"League Spartan\", sans-serif",
        "slug": "league-spartan",
        "name": "League Spartan"
    }
]
```

---

## 7. Visual Comparison

### Current State (Inconsistent)

```
┌─────────────────────────────────────────────────────────────┐
│  Homepage                                                   │
│  h2: League Spartan, 40px, margin: 30px 30px               │
│  p: Inter, 24px, padding: 6px 0                            │
├─────────────────────────────────────────────────────────────┤
│  Standard Page                                              │
│  h2: League Spartan, 40px, margin: 0 0                     │
│  p: glacial-indifference, 20px, padding: 0                 │
├─────────────────────────────────────────────────────────────┤
│  Event Page                                                 │
│  h2: League Spartan, 40px, margin: 0 40px                  │
│  p: glacial-indifference, 24px, padding: 5px 5px           │
├─────────────────────────────────────────────────────────────┤
│  Action Page                                                │
│  h2: League Spartan, 40px, margin: 0 40px                  │
│  p: glacial-indifference, 24px, padding: 5px 5px           │
└─────────────────────────────────────────────────────────────┘
```

### Desired State (Consistent)

```
┌─────────────────────────────────────────────────────────────┐
│  All Templates                                              │
│  h1: Red Hat Display, fluid(3rem-4.5rem), margin: var      │
│  h2: Red Hat Display, fluid(2.25rem-4rem), margin: var     │
│  h3: Red Hat Display, fluid(1.875rem-3rem), margin: var    │
│  h4: Red Hat Display, 1.25rem, margin: var                 │
│  p: Red Hat Display, 1.25rem, line-height: 1.6             │
│  blockGap: 0.5em (consistent across all blocks)            │
│  containerPadding: var(--wp--custom--spacing--outer)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Next Steps

1. **Review this report** with the development team
2. **Decide on font strategy** (Red Hat Display only vs. multi-font)
3. **Switch to Code mode** to implement the deletions and refactors
4. **Test thoroughly** after changes to ensure no visual regressions
5. **Update theme.json** if multi-font strategy is chosen

---

*Report generated: March 10, 2026*
*Audited URLs:*
- *Homepage: https://staging-ba32-houseyouorg.wpcomstaging.com/*
- *Standard Page: https://staging-ba32-houseyouorg.wpcomstaging.com/hoarding-101/*
- *Event Page: https://staging-ba32-houseyouorg.wpcomstaging.com/hoarding-101-19/*
- *Action Page: https://staging-ba32-houseyouorg.wpcomstaging.com/actions/tax-breaks/*
