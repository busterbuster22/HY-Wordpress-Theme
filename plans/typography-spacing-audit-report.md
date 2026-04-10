# Typography & Spacing Audit Report
## House You Theme - Deep Scan Results

**Audit Date:** 2026-03-10  
**Pages Audited:**
- Action Page: `/actions/tax-breaks/`
- Homepage: `/`
- Event Page: `/hoarding-101-19/`

**Viewports Tested:** Desktop (1440px) and Mobile (375px)

---

## 1. Typographic Scale Analysis

### Computed Font Size Table (Desktop 1440px)

| Element | Action Page | Homepage | Event Page | Intended (theme.json) |
|---------|-------------|----------|------------|----------------------|
| **H1** | Not found | Not found | Not found | 48-72px (min-max) |
| **H2** | 40px | 64px | 72px | 36-64px |
| **H3** | 32px | 48px | 48px | 30-48px |
| **H4** | 18px | 20-28px | 18-20px | 20px (normal) |
| **H5** | Not found | Not found | Not found | 16px (small) |
| **H6** | Not found | Not found | Not found | 14px (x-small) |
| **P** | 24px | 20px | 20px | 16px (body) |
| **LI** | 16-30px | 20-30px | 20-30px | Inherited |

### Computed Font Size Table (Mobile 375px)

| Element | Action Page | Homepage | Event Page | Intended (theme.json) |
|---------|-------------|----------|------------|----------------------|
| **H1** | Not found | Not found | Not found | 48px (min) |
| **H2** | 40px | 36px | 48px | 36px (min) |
| **H3** | 32px | 30-36px | 30px | 30px (min) |
| **H4** | 18px | 20px | 20px | 20px |
| **P** | 20.8px | 20px | 20px | 16px |
| **LI** | 16-30px | 20-30px | 20-30px | Inherited |

### 🚨 Hierarchy Collisions Detected

| Collision | Elements | Size Difference | Status |
|-----------|----------|-----------------|--------|
| **H4 < P** | H4 (18px) vs P (24px) on Action Page | -6px | **CRITICAL: Heading smaller than body** |
| **H4 < P** | H4 (18px) vs P (20px) on Event Page | -2px | **CRITICAL: Heading smaller than body** |
| H2 vs H3 | 40px vs 32px (Action) | 8px | OK (>4px) |
| H3 vs H4 | 32px vs 18px (Action) | 14px | OK (>4px) |

---

## 2. The 'Bottom-Margin' Purge (Vertical Rhythm)

### Margin Analysis - Desktop (1440px)

#### Headings

| Element | Page | margin-top | margin-bottom | Status |
|---------|------|------------|---------------|--------|
| H2 | Action | 0px | **40px** | ❌ VIOLATION |
| H2 | Action (TAKE ACTION) | 0px | 0px | ✅ OK |
| H2 | Homepage | **30px** | **30px** | ❌ VIOLATION |
| H2 | Event | 0px | **72px** | ❌ VIOLATION |
| H2 | Event (PICK YOUR MOMENT) | **12px** | 0px | ✅ OK |
| H3 | Action | 0px | 0px | ✅ OK |
| H3 | Homepage | 0px | 0px | ✅ OK |
| H3 | Event | **24px** | 0px | ✅ OK |
| H4 | Action | 0px | **15px** | ❌ VIOLATION |
| H4 | Homepage | **12-30px** | 0px | ✅ OK |
| H4 | Event | **10px** | 0px | ✅ OK |

#### Paragraphs

| Element | Page | margin-top | margin-bottom | Status |
|---------|------|------------|---------------|--------|
| P (content) | Action | **12px** | 0px | ✅ OK |
| P (content) | Homepage | 0-10px | 0px | ✅ OK |
| P (content) | Event | 0-10px | 0px | ✅ OK |
| P (footer) | All | **7.04px** | **7.04px** | ❌ VIOLATION |
| P (disclaimer) | Action | 0px | **15px** | ❌ VIOLATION |
| P (disclaimer) | Homepage | **15px** | **14px** | ❌ VIOLATION |

#### UI Elements

| Element | margin-top | margin-bottom | Status |
|---------|------------|---------------|--------|
| label | 0px | **2px** | ❌ VIOLATION |
| input (Action Network) | 0px | **15-20px** | ❌ VIOLATION |
| input (native) | 0px | **15px** | ❌ VIOLATION |
| button (header) | 0px | 0px | ✅ OK |

### 🚨 Margin-Bottom Violations Summary

**Total Violations Found: 17 instances**

| Source | Selector | Property | Location |
|--------|----------|----------|----------|
| theme.json | `h1, h2, h3, h4, h5, h6` | `spacing.margin.bottom` | Lines 511-591 |
| theme.json | `core/post-title` | `spacing.margin.bottom: 1em` | Line 425 |
| theme.json | `core/gallery` | `spacing.margin.bottom` | Line 380 |
| Browser Default | `p` (footer) | User agent stylesheet | Override needed |
| Action Network | `input` | `margin-bottom: 15-20px` | Embedded form CSS |
| Action Network | `label` | `margin-bottom: 2px` | Embedded form CSS |

### H2-to-P vs H3-to-P Spacing Comparison

| Page | H2→P Gap | H3→P Gap | Consistent? |
|------|----------|----------|-------------|
| Action | N/A (no adjacent) | 12px | - |
| Homepage | Variable | Variable | ❌ No |
| Event | Variable | Variable | ❌ No |

**Finding:** The spacing between headings and paragraphs is inconsistent because:
1. Headings have `margin-bottom` values creating unpredictable gaps
2. Paragraphs have varying `margin-top` values (0px, 10px, 12px)
3. No single-direction margin strategy is enforced

---

## 3. UI & Embed Consistency

### Font-Family Verification

| Element | Expected | Actual | Status |
|---------|----------|--------|--------|
| **H1-H6** | League Spartan | League Spartan | ✅ OK (mostly) |
| **H2 (Action Network)** | League Spartan | Helvetica, Arial | ❌ WRONG |
| **H4 (Action Network)** | League Spartan | Helvetica, Arial | ❌ WRONG |
| **P (body)** | Glacial Indifference | Glacial Indifference | ✅ OK |
| **label (theme)** | League Spartan | League Spartan | ✅ OK |
| **label (Action Network)** | League Spartan/Glacial | Helvetica, Arial | ❌ WRONG |
| **input (theme)** | Glacial Indifference | Glacial Indifference | ✅ OK |
| **input (Action Network)** | Glacial Indifference | Helvetica/Inter | ❌ WRONG |
| **button** | League Spartan | League Spartan/Glacial | ⚠️ MIXED |

### Action Network Form Inheritance Analysis

**Problem:** Action Network embeds are NOT inheriting theme styles correctly.

| Element | Computed Font | Source |
|---------|---------------|--------|
| Form labels | Helvetica, Arial, sans-serif | Action Network default |
| Form inputs | Helvetica, Arial, sans-serif / Inter, sans-serif | Action Network default |
| Form h2 | Helvetica, Arial, sans-serif | Action Network default |
| Form h4 | Helvetica, Arial, sans-serif | Action Network default |

**Root Cause:** The [`sass/theme.scss`](sass/theme.scss) file has specific overrides for Action Network forms (lines 754-1499), but they are:
1. Scoped to specific form IDs (`#can_embed_form form.new_delivery`)
2. Not applying to all embed variations
3. Being overridden by Action Network's inline styles

---

## 4. The Offender List

### Critical Issues Requiring Immediate Fix

#### 4.1 Margin-Bottom on Headings (theme.json)

**Location:** [`theme.json`](theme.json) lines 503-591

```json
"h1": {
  "spacing": {
    "margin": {
      "top": "calc( 1.1 * var(--wp--custom--gap--vertical) )",
      "bottom": "calc( 1.1 * var(--wp--custom--gap--vertical) )"  // ❌ REMOVE
    }
  }
}
```

**Applies to:** h1, h2, h3, h4, h5, h6 (all have `margin.bottom`)

**Fix:** Remove all `margin.bottom` declarations from heading elements in theme.json. Use only `margin.top` for vertical rhythm.

---

#### 4.2 H4 Smaller Than Body Text

**Location:** [`theme.json`](theme.json) line 548

```json
"h4": {
  "typography": {
    "fontSize": "var(--wp--custom--font-size--normal)"  // Resolves to 20px
  }
}
```

**Problem:** Body text is rendering at 20-24px, making H4 (18-20px) equal or smaller.

**Fix:** Increase H4 minimum to `1.25rem` (20px) and ensure body stays at `1rem` (16px).

---

#### 4.3 Action Network Form Font Inheritance

**Location:** [`sass/theme.scss`](sass/theme.scss) lines 754-1499

**Problem:** Specific selectors don't cover all Action Network embed scenarios.

**Current (broken):**
```scss
#can_embed_form form.new_delivery h2,
#can_embed_form form.new_delivery h3,
#can_embed_form form.new_delivery h4 {
    font-family: var(--wp--preset--font-family--glacial-indifference) !important;
}
```

**Missing:** Generic fallback for any Action Network embed:
```scss
// Need to add:
#can_embed_form,
.can_embed_form,
[data-action-network] {
    font-family: var(--wp--preset--font-family--glacial-indifference) !important;
    
    h1, h2, h3, h4, h5, h6 {
        font-family: var(--wp--preset--font-family--league-spartan) !important;
    }
    
    label {
        font-family: var(--wp--preset--font-family--league-spartan) !important;
    }
    
    input, textarea, select {
        font-family: var(--wp--preset--font-family--glacial-indifference) !important;
    }
}
```

---

#### 4.4 Footer Paragraph Margins

**Location:** Browser default + [`sass/theme.scss`](sass/theme.scss) (no override)

**Problem:** Footer paragraph has `margin-bottom: 7.04px` from browser defaults.

**Fix:** Add to [`sass/theme.scss`](sass/theme.scss):
```scss
footer.wp-block-template-part p {
    margin-bottom: 0 !important;
}
```

---

#### 4.5 Input Margin-Bottom

**Location:** [`sass/theme.scss`](sass/theme.scss) lines 786-810, 1235-1246

**Problem:** Explicit `margin-bottom: 20px` on Action Network inputs.

**Current:**
```scss
#can_embed_form form.new_delivery input[type="text"],
#can_embed_form form.new_delivery input[type="email"] {
    margin-bottom: 20px !important;  // ❌ VIOLATION
}
```

**Fix:** Remove `margin-bottom` and use `margin-top` on the container or use blockGap.

---

#### 4.6 Disclaimer Text Margins

**Location:** Action Network embed (inline styles)

**Problem:** `*Your name will be on the letter...` paragraph has `margin-bottom: 15px`.

**Fix:** Add override in [`sass/theme.scss`](sass/theme.scss):
```scss
#can_embed_form p,
.can_embed_form p {
    margin-bottom: 0 !important;
    margin-top: var(--wp--custom--gap--baseline) !important;
}
```

---

### Summary of Required Changes

| Priority | Issue | File | Lines | Action |
|----------|-------|------|-------|--------|
| 🔴 P1 | Heading margin-bottom | theme.json | 503-591 | Remove all `margin.bottom` |
| 🔴 P1 | H4 < P size collision | theme.json | 545-560 | Increase H4 min-size |
| 🟠 P2 | Action Network fonts | sass/theme.scss | 754-1499 | Add generic selectors |
| 🟠 P2 | Input margin-bottom | sass/theme.scss | 786-810, 1235-1390 | Remove margin-bottom |
| 🟡 P3 | Footer paragraph margin | sass/theme.scss | Add new | Add footer p override |
| 🟡 P3 | Disclaimer margin | sass/theme.scss | Add new | Add form p override |

---

## 5. Recommendations

### 5.1 Implement Single-Direction Margin Strategy

1. **Remove all `margin-bottom` from:**
   - All headings (h1-h6)
   - All paragraphs
   - All form elements
   - All list items

2. **Use only `margin-top` for spacing:**
   - First element: `margin-top: 0`
   - Subsequent elements: `margin-top: var(--wp--custom--gap--vertical)`

3. **Let blockGap handle the rest:**
   - Current blockGap: `0.5em` (theme.json line 325)
   - Consider increasing to `var(--wp--custom--gap--baseline)` (10px)

### 5.2 Fix Typography Scale

Recommended scale (desktop):
- H1: 64px
- H2: 48px
- H3: 36px
- H4: 24px (increase from 20px)
- H5: 18px
- H6: 14px
- Body: 16px (ensure this is enforced)

### 5.3 Action Network Form Strategy

1. Create a dedicated Action Network override section
2. Use attribute selectors for broader coverage
3. Ensure `!important` is used consistently
4. Test all three form types: Letter, RSVP, Petition

---

## Appendix: Raw Data

### Action Network Form Label Computed Styles

```
font-family: "Helvetica, Arial, sans-serif"  ❌ Should be League Spartan
font-size: 11-12px
margin-top: 0px
margin-bottom: 2px  ❌ Should be 0
```

### Action Network Input Computed Styles

```
font-family: "Helvetica, Arial, sans-serif" / "Inter, sans-serif"  ❌ Should be Glacial Indifference
font-size: 16-18px
margin-top: 0px
margin-bottom: 15-20px  ❌ Should be 0
```

---

**Report Generated:** 2026-03-10  
**Auditor:** Claude (Architect Mode)
