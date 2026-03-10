# Pre-Flight Audit Report: Layout Overhaul

## Executive Summary

This audit identifies all files that will need updates alongside the main implementation plan for `useRootPaddingAwareAlignments`. The codebase has **significant legacy CSS** that will conflict with the native WordPress layout engine.

---

## 1. Block Templates Scan

### Templates with Hardcoded Margins (CRITICAL)

| File | Issue | Line |
|------|-------|------|
| [`block-templates/page.html`](block-templates/page.html:3) | `margin-right:var(--wp--preset--spacing--80")` and `margin-left` | 3-4 |
| [`block-templates/contact-us.html`](block-templates/contact-us.html:3) | Same hardcoded margins | 3-4 |

### Templates Using `layout: inherit` (Needs Review)

These templates use `layout":{"inherit":true}` which may behave differently with root padding:

| File | Line |
|------|------|
| [`block-templates/single.html`](block-templates/single.html:3) | 3, 15, 17, 51, 55 |
| [`block-templates/index.html`](block-templates/index.html:6) | 6 |
| [`block-templates/archive.html`](block-templates/archive.html:5) | 5, 11 |
| [`block-templates/search.html`](block-templates/search.html:3) | 3 |
| [`block-templates/404.html`](block-templates/404.html:3) | 3 |
| [`block-templates/header-footer-only.html`](block-templates/header-footer-only.html:6) | 6 |

### Templates Already Clean (No Issues)

| File | Status |
|------|--------|
| [`block-templates/home.html`](block-templates/home.html) | ✅ No hardcoded margins |
| [`block-templates/action.html`](block-templates/action.html) | ⚠️ Uses `.site-main` and `.full-width-homepage` classes |
| [`block-templates/an-events.html`](block-templates/an-events.html) | ⚠️ Uses `.site-main` and `.full-width-homepage` classes |

---

## 2. Header and Footer Padding Methods

### Header ([`block-template-parts/header.html`](block-template-parts/header.html))

**Current approach:**
- Uses `alignfull` class on outer group
- No explicit padding in template
- Padding applied via CSS in [`sass/theme.scss`](sass/theme.scss:557):

```scss
header.wp-block-template-part .wp-block-columns.header-columns {
    max-width: 1800px !important;
    margin-left: auto !important;
    margin-right: auto !important;
}

@media (min-width: 769px) {
    header.wp-block-template-part > .wp-block-group {
        padding-left: 40px !important;
        padding-right: 40px !important;
    }
}
```

**Issue:** Hardcoded `40px` padding instead of `var(--wp--custom--spacing--outer)`

### Footer ([`block-template-parts/footer.html`](block-template-parts/footer.html))

**Current approach:**
- Uses `alignfull` class on outer group with `.pre-footer` class
- Uses `.content-container` class on inner columns
- Padding applied via CSS in [`sass/theme.scss`](sass/theme.scss:607):

```scss
footer.wp-block-template-part .wp-block-paragraph {
    max-width: 1800px !important;
    margin-left: auto !important;
    margin-right: auto !important;
}
```

**Issue:** Same hardcoded pixel values, not using CSS variables

---

## 3. SCSS/CSS Legacy Layout Hacks (CRITICAL)

### Files Requiring Major Changes

**[`sass/theme.scss`](sass/theme.scss)** contains extensive legacy layout code:

#### A. Negative Margin Hacks for `alignfull` (Lines 225-248)

```scss
.wp-site-blocks .alignfull,
.is-root-container .wp-block[data-align="full"] {
    margin-left: calc(-1 * var(--wp--custom--spacing--outer)) !important;
    margin-right: calc(-1 * var(--wp--custom--spacing--outer)) !important;
}
```

**Conflict:** These negative margins will double-breakout when `useRootPaddingAwareAlignments` is enabled.

#### B. Full-Width Section 100vw Hacks (Lines 314-322, 455-478)

```scss
.wp-block-group.is-style-full-width {
    width: 100vw !important;
    position: relative !important;
    left: 50% !important;
    margin-left: -50vw !important;
    margin-right: -50vw !important;
}

.full-width-homepage {
    width: 100vw !important;
    position: relative !important;
    left: 50% !important;
    margin-left: -50vw !important;
    margin-right: -50vw !important;
}
```

**Conflict:** These will cause double-breakout and horizontal scroll with root padding aware alignments.

#### C. Header/Footer 100vw Hacks (Lines 522-530, 594-601)

```scss
header.wp-block-template-part {
    width: 100vw;
    position: relative;
    left: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
}

footer.wp-block-template-part .wp-block-group.alignfull.pre-footer {
    width: 100vw !important;
    position: relative !important;
    left: 50% !important;
    margin-left: -50vw !important;
    margin-right: -50vw !important;
}
```

**Conflict:** Header and footer will break out too far with root padding.

#### D. `.is-layout-constrained` Override (Lines 536-540, 588-591)

```scss
header.wp-block-template-part > .wp-block-group.is-layout-constrained {
    max-width: 100% !important;
}

footer.wp-block-template-part > .wp-block-group.is-layout-constrained {
    max-width: 100% !important;
}
```

**Conflict:** These overrides fight against WordPress's native layout engine.

#### E. `.site-main` Rules (Lines 446-452)

```scss
.site-main {
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin: 0;
}
```

**Note:** This may be redundant with root padding aware alignments.

---

## 4. Action Network Embed Wrappers

### Fixed Width Elements Found

**[`sass/theme.scss`](sass/theme.scss:1914-1916):**
```scss
.event-card-link {
    display: block;
    width: 500px;
    flex-shrink: 0;
}
```

**[`sass/theme.scss`](sass/theme.scss:2027-2032):**
```scss
@media (max-width: 768px) {
    .event-card-link {
        width: 100%;
        max-width: 500px;
    }
}
```

### Form Width Rules

The Action Network forms use percentage-based widths:
- `#can_embed_form form.new_delivery #form_col1 li.core_field` - `width: 48%`
- `#can_embed_form form.new_rsvp #form_col1 li.core_field` - `width: 100%`

**Assessment:** These should work fine with the new 1160px content width. No overflow issues expected.

---

## 5. Architecture.md Considerations

From [`architecture.md`](architecture.md), the following sections are relevant:

### Section 3: Layout System (Lines 105-209)

Documents the **three-tier layout system**:
1. Full-width background sections (`.full-width-homepage`, `.is-style-full-width`)
2. Constrained content (`.content-container`, max-width: 1800px)
3. Responsive padding (20px mobile, 40px desktop)

**Impact:** This entire system will need to be refactored to use native WordPress layout engine.

### Section 10: Known Constraints (Lines 732-828)

Documents critical constraints:

1. **`overflow-x: hidden` on html, body** (Line 736-744)
   - Required because of 100vw scrollbar overflow
   - May be removable after refactoring

2. **`theme.json` layout values intentionally narrow** (Line 748-774)
   - Documents that `contentSize: 684px` is deliberate
   - Notes the CSS override for `.is-layout-constrained`
   - **This documentation will need updating**

3. **Do NOT replace 100vw with 100%** (Line 777-786)
   - Documents why 100vw is used
   - This constraint may become obsolete with root padding aware alignments

---

## Summary: Files Requiring Updates

### Must Update (Blocking Issues)

| File | Changes Needed |
|------|----------------|
| [`theme.json`](theme.json) | Add `useRootPaddingAwareAlignments: true`, add root padding to styles, update `contentSize` |
| [`block-templates/page.html`](block-templates/page.html) | Remove hardcoded margins |
| [`block-templates/contact-us.html`](block-templates/contact-us.html) | Remove hardcoded margins |
| [`sass/theme.scss`](sass/theme.scss) | Remove/refactor all 100vw hacks, negative margin hacks, `.is-layout-constrained` overrides |

### Should Update (For Consistency)

| File | Changes Needed |
|------|----------------|
| [`block-template-parts/header.html`](block-template-parts/header.html) | Consider using CSS variables for padding |
| [`block-template-parts/footer.html`](block-template-parts/footer.html) | Consider using CSS variables for padding |
| [`block-templates/single.html`](block-templates/single.html) | Review `layout: inherit` usage |
| [`block-templates/index.html`](block-templates/index.html) | Review `layout: inherit` usage |
| [`block-templates/archive.html`](block-templates/archive.html) | Review `layout: inherit` usage |
| [`block-templates/search.html`](block-templates/search.html) | Review `layout: inherit` usage |
| [`block-templates/404.html`](block-templates/404.html) | Review `layout: inherit` usage |

### Must Update (Documentation)

| File | Changes Needed |
|------|----------------|
| [`architecture.md`](architecture.md) | Update Section 3 (Layout System), Section 10 (Known Constraints) |

---

## Risk Assessment

### High Risk Areas

1. **`.full-width-homepage` class** - Used in `action.html`, `an-events.html`, `home.html`
   - Will break if CSS is removed without template updates
   - Need to verify these still work with native alignfull

2. **Header/footer alignment** - Currently using 100vw hack
   - May need to switch to native `alignfull` approach
   - Test on all screen sizes

3. **`.content-container` class** - Used extensively
   - May conflict with root padding
   - Need to verify padding values match

### Recommended Approach

1. **Phase 1:** Update `theme.json` with root padding aware alignments
2. **Phase 2:** Remove hardcoded margins from templates
3. **Phase 3:** Refactor SCSS layout hacks incrementally
4. **Phase 4:** Test each template type thoroughly
5. **Phase 5:** Update documentation

### Testing Priority

1. Home page (uses full-width sections)
2. Action/Event pages (uses `.full-width-homepage`)
3. Standard pages (currently constrained)
4. Archive/Search pages
5. Mobile responsiveness