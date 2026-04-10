# Typography & Vertical Rhythm Deep-Scan Audit

**Audit Date:** March 10, 2026  
**Pages Audited:**
- Homepage: `https://staging-ba32-houseyouorg.wpcomstaging.com/`
- Standard Page: `https://staging-ba32-houseyouorg.wpcomstaging.com/hoarding-101/`
- Action Page: `https://staging-ba32-houseyouorg.wpcomstaging.com/actions/tax-breaks/`

---

## Executive Summary

The audit reveals **critical typography hierarchy failures** and **severe vertical rhythm inconsistencies**. The root causes are:

1. **CSS specificity wars** between theme.json definitions and inline/block styles
2. **Zero top margins** on multiple heading levels creating "hugging" issues
3. **Inconsistent font sizes** for the same heading level across contexts
4. **Action Network embeds** using completely different font families and sizes

---

## 1. Typographic Scale Audit

### Computed Font Sizes (px) - Desktop (1440px)

| Element | Homepage | Standard Page | Action Page | theme.json Definition |
|---------|----------|---------------|-------------|----------------------|
| **H1** | Not found | Not found | Not found | `min(max(3rem, 7vw), 4.5rem)` = 48-72px |
| **H2** | 64px, 24px | 64px, 24px | 72px, 64px, 23px | `min(max(2.25rem, 5vw), 4rem)` = 36-64px |
| **H3** | 48px | 48px, 22.4px | 48px | `min(max(1.875rem, 5vw), 3rem)` = 30-48px |
| **H4** | 20px, 24px, 28px | 20px | 18px | `var(--wp--custom--font-size--normal)` = 20px |
| **H5** | Not found | Not found | Not found | `var(--wp--preset--font-size--small)` = 16px |
| **H6** | Not found | Not found | Not found | `var(--wp--custom--font-sizes--x-small)` = 14px |
| **p** | 20px | 20px | 20px | Inherited from body |

### Computed Font Sizes (px) - Mobile (375px)

| Element | Homepage | Standard Page | Action Page | theme.json Definition |
|---------|----------|---------------|-------------|----------------------|
| **H1** | Not found | Not found | Not found | 48px (min value) |
| **H2** | 36px, 24px | 36px, 24px | 48px, 36px, 23px | 36px (min value) |
| **H3** | 30px, 36px | 30px, 22.4px | 30px | 30px (min value) |
| **H4** | 20px, 24px, 28px | 20px | 18px | 20px |
| **p** | 20px | 20px | 20px | Inherited |

### Hierarchy Collisions (within 4px)

| Level Pair | Desktop Gap | Mobile Gap | Status |
|------------|-------------|------------|--------|
| H2 → H3 | 64px → 48px = **16px** ✓ | 36px → 30px = **6px** ⚠️ | **COLLISION on mobile** |
| H3 → H4 | 48px → 28px = **20px** ✓ | 30px → 28px = **2px** ❌ | **COLLISION on mobile** |
| H4 → p | 28px → 20px = **8px** ✓ | 28px → 20px = **8px** ✓ | Acceptable |

### Hierarchy Gaps (Mathematically Disconnected)

| Transition | Desktop Jump | Mobile Jump | Issue |
|------------|--------------|-------------|-------|
| H2 → H3 | 64→48 = -25% | 36→30 = -17% | Inconsistent scaling |
| H3 → H4 | 48→28 = -42% | 30→28 = -7% | **Massive desktop gap, tiny mobile gap** |
| H4 → H5 | 20→16 = -20% | 20→16 = -20% | Defined but unused |

---

## 2. Vertical Rhythm (Margin) Audit

### Computed Margins - Desktop (1440px)

| Element | margin-top | margin-bottom | Source |
|---------|------------|---------------|--------|
| **H2** | 30px / 0px | 30px / 0px | theme.json / inline overrides |
| **H3** | **0px** ❌ | **0px** ❌ | **OVERRIDDEN to zero** |
| **H4** | 0px, 12px, 30px | 0px, 15px, 30px | **Highly inconsistent** |
| **p** | 0px, 10px | 0px | Varies by context |

### Computed Margins - Mobile (375px)

| Element | margin-top | margin-bottom | Source |
|---------|------------|---------------|--------|
| **H2** | 25px / 0px | 25px / 0px | theme.json / inline overrides |
| **H3** | **0px** ❌ | **0px** ❌ | **OVERRIDDEN to zero** |
| **H4** | 0px, 12px, 25px | 0px, 15px, 25px | **Highly inconsistent** |
| **p** | 0px, 10px | 0px | Varies by context |

### The "Hugging" Check - Headings with 0px Top Margin

| Element | Location | Issue |
|---------|----------|-------|
| **H3** | All pages | **Zero top margin creates visual hugging** |
| **H4** | Homepage (multiple instances) | Zero top margin when used as section headers |
| **H2** | Action Page (some instances) | Zero top margin from inline styles |

### Stacking Check - Double-Spacing Issues

| Scenario | Heading margin-bottom | Paragraph margin-top | Combined Gap |
|----------|----------------------|---------------------|--------------|
| H2 → p (Homepage) | 30px | 0px | 30px ✓ |
| H3 → p (Homepage) | 0px | 0px | **0px** ❌ No spacing! |
| H4 → p (Action Page) | 15px | 10px | **25px** ⚠️ Double-spacing |
| p → p (Action Page) | 0px | 10px | 10px ✓ |

---

## 3. UI & Embed Consistency - Action Network Forms

### Font Size Comparison

| Element | Action Network | Theme Standard (p) | Difference |
|---------|----------------|-------------------|------------|
| **Labels** | 11-12px | 20px | **-8px to -9px (40-45% smaller)** |
| **Inputs** | 18px | 20px | -2px (10% smaller) |
| **Opt-in label** | 20px | 20px | Match ✓ |

### Font Family Comparison

| Element | Action Network | Theme Standard | Issue |
|---------|----------------|----------------|-------|
| **Labels** | `Helvetica, Arial, sans-serif` | `Glacial Indifference` | **WRONG FONT** |
| **Inputs** | `Glacial Indifference` | `Glacial Indifference` | Match ✓ |
| **H2 (embed)** | `Helvetica, Arial, sans-serif` | `League Spartan` | **WRONG FONT** |
| **H4 (embed)** | `Helvetica, Arial, sans-serif` | `League Spartan` | **WRONG FONT** |

### Action Network Form Elements - Detailed Breakdown

```
Labels:
  font-size: 11-12px (should be 20px)
  font-family: Helvetica, Arial, sans-serif (should be Glacial Indifference)
  margin-bottom: 2px (should be 10px baseline)

Inputs:
  font-size: 18px (acceptable, close to 20px)
  font-family: Glacial Indifference ✓
  margin-bottom: 15-20px

Select dropdowns:
  font-size: 16-18px
  font-family: Helvetica, Arial, sans-serif (inconsistent with inputs)
```

---

## 4. Offender List - Source Code Locations

### theme.json Offenders

| Line | Code | Issue |
|------|------|-------|
| **540-543** | `h3 spacing: margin: { top: var(--wp--custom--gap--vertical) }` | **Not being applied** - overridden elsewhere |
| **548-549** | `h4 fontSize: var(--wp--custom--font-size--normal)` | Results in inconsistent 18-28px range |
| **241-245** | `gap: { baseline: 10px, vertical: min(30px, 5vw) }` | Too many gap variables causing confusion |

### sass/theme.scss Offenders

| Line | Code | Issue |
|------|------|-------|
| **229-230** | `margin-top: 0 !important; margin-bottom: 0 !important;` | Forces zero margins on headings in colored sections |
| **243-244** | Same as above | Repeated pattern |
| **257-258** | Same as above | Repeated pattern |
| **777-778** | `margin-top: 0 !important; margin-bottom: 0 !important;` | Action Network H2/H3/H4 headings lose all spacing |
| **765-779** | Action Network heading styles | Forces Glacial Indifference on H2/H3/H4 (should be League Spartan) |

### Critical CSS Specificity Issues

```scss
// sass/theme.scss:229-230 - This rule kills vertical rhythm
.full-width-homepage-color-scheme\:ash-grey-background {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    
    h1, h2, h3, h4, h5, h6, p, li, a {
        // All headings lose their margins here!
    }
}
```

---

## 5. Root Cause Analysis

### Problem 1: H3 Zero Margins

**Cause:** The `.full-width-homepage` and color-scheme blocks in [`sass/theme.scss`](sass/theme.scss:229) apply `margin-top: 0 !important; margin-bottom: 0 !important;` to all headings, overriding theme.json.

**Impact:** H3 headings appear "stuck" to content above them with no breathing room.

### Problem 2: H4 Size Inconsistency

**Cause:** H4 elements are being styled with inline font-size overrides in the block editor, and Action Network embeds apply their own H4 styles at [`sass/theme.scss:764-779`](sass/theme.scss:764).

**Impact:** H4 ranges from 18px to 28px across the site, breaking visual hierarchy.

### Problem 3: Action Network Font Family Mismatch

**Cause:** Action Network's default styles use `Helvetica, Arial, sans-serif`. The override CSS at [`sass/theme.scss:765-779`](sass/theme.scss:765) applies `Glacial Indifference` to H2/H3/H4 but **labels are not included**.

**Impact:** Form labels look disconnected from the rest of the site typography.

### Problem 4: Mobile H3→H4 Collision

**Cause:** At mobile viewport, H3 scales to 30px while H4 stays at 28px (only 2px difference).

**Impact:** No visual distinction between H3 and H4 on mobile devices.

---

## 6. Recommendations

### Immediate Fixes

1. **Add margin exceptions for headings in color blocks:**
   ```scss
   // sass/theme.scss - Modify lines 229-230
   .full-width-homepage h3 {
       margin-top: var(--wp--custom--gap--vertical) !important;
   }
   ```

2. **Fix Action Network label fonts:**
   ```scss
   // Add to sass/theme.scss Action Network section
   #can_embed_form label {
       font-family: var(--wp--preset--font-family--glacial-indifference) !important;
       font-size: 20px !important;
   }
   ```

3. **Increase H4 mobile size:**
   ```json
   // theme.json - Adjust H4 fontSize
   "fontSize": "min(max(1.25rem, 3vw), 1.5rem)"  // 20-24px range
   ```

### Systemic Fixes

1. **Consolidate gap variables** - Use a single spacing scale
2. **Remove `!important` from margin resets** - Use specific selectors instead
3. **Create a typography utility class** for consistent heading spacing
4. **Audit all block patterns** for inline font-size overrides

---

## 7. Visual Evidence

### Hierarchy Collision Example (Mobile)

```
H3: 30px  ████████████████████████████████
H4: 28px  ██████████████████████████████  ← Only 2px difference!
```

### Margin Collapse Example

```
┌─────────────────────────────────────┐
│ H3 with 0px margin                  │
├─────────────────────────────────────┤ ← No gap!
│ Paragraph with 0px margin           │
└─────────────────────────────────────┘
```

### Action Network Label Issue

```
Theme Label:     Glacial Indifference, 20px
Action Network:  Helvetica, 11px  ← 45% smaller, wrong font
```

---

## Appendix: Raw Data

### Homepage Desktop (1440px) - All Heading Instances

| Tag | Text | Font Size | Margin Top | Margin Bottom | Font Family |
|-----|------|-----------|------------|---------------|-------------|
| H2 | "This Budget..." | 64px | 30px | 30px | League Spartan |
| H3 | "EVERYBODY GETS A HOUSE" | 48px | **0px** | **0px** | League Spartan |
| H3 | "WE HAVE ENOUGH HOMES" | 48px | **0px** | **0px** | League Spartan |
| H3 | "HOUSING FIRST" | 48px | **0px** | **0px** | League Spartan |
| H3 | "WE ORGANISE. WE WIN." | 48px | **0px** | **0px** | League Spartan |
| H4 | "Take Action" | 20px | 30px | 30px | League Spartan |
| H4 | "Step 1: Join the movement" | 28px | **0px** | **0px** | Glacial Indifference |
| H4 | "This crisis isn't..." | 24px | 12px | **0px** | League Spartan |
| H4 | "SOLUTION: GET EVERYBODY..." | 24px | 12px | **0px** | League Spartan |

### Action Page Desktop (1440px) - Form Elements

| Type | Text | Font Size | Font Family |
|------|------|-----------|-------------|
| label | "First Name *" | 11px | Helvetica, Arial |
| label | "Last Name *" | 11px | Helvetica, Arial |
| label | "Email *" | 11px | Helvetica, Arial |
| label | "Opt in to email..." | 20px | Helvetica, Arial |
| input | First Name | 18px | Glacial Indifference |
| input | Email | 18px | Glacial Indifference |
| select | Housing Demographic | 18px | Glacial Indifference |

---

**Report Generated:** March 10, 2026  
**Auditor:** Claude (Architect Mode)
