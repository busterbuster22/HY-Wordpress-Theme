# Action Network Form Layout Fix Plan

## Problem Summary

Comparing two Action Network embed types:
1. **Event RSVP** (`form.new_rsvp`) - Works correctly, fields stack properly, opt-in aligned
2. **Letter Action** (`form.new_delivery`) - Fields misaligned, opt-in checkbox overlays text, no padding under button

### Pages Compared
- Working: https://staging-ba32-houseyouorg.wpcomstaging.com/hoarding-101-19/ (Event RSVP)
- Broken: https://staging-ba32-houseyouorg.wpcomstaging.com/actions/tax-breaks/ (Letter Action)

---

## Issues Identified

### Issue 1: Heading Not Constrained Within Border

**Root Cause:** In [`action.html`](block-templates/action.html:5), the `wp:post-title` is placed OUTSIDE the columns block:

```html
<div class="wp-block-group full-width-homepage ...">
  <!-- wp:post-title /-->  <!-- OUTSIDE columns -->
  <!-- wp:columns ... -->
</div>
```

In [`an-events.html`](block-templates/an-events.html:7), the title is INSIDE the first column:

```html
<div class="wp-block-group full-width-homepage ...">
  <!-- wp:columns ... -->
    <!-- wp:column -->
      <!-- wp:post-title /-->  <!-- INSIDE column -->
    <!-- /wp:column -->
  <!-- /wp:columns -->
</div>
```

**Fix:** Move `wp:post-title` inside the first column in `action.html`.

---

### Issue 2: Form Fields Layout - All Fields Side-by-Side

**Current Behavior:** All fields display in 2-column grid (48% width each).

**Desired Layout:**
- First Name - full width, stacked
- Last Name - full width, stacked  
- Email - full width, stacked
- Mobile - full width, stacked
- Zip + Year of Birth - side by side on same row

**Root Cause:** CSS at [`assets/theme.css:862-877`](assets/theme.css:862):

```css
#can_embed_form form.new_delivery #form_col1 {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 0 4%;
}

#can_embed_form form.new_delivery #form_col1 li.core_field,
#can_embed_form form.new_delivery #form_col1 li.control-group {
  width: 48% !important;  /* All fields 48% */
}
```

**Fix:** Target specific fields by their IDs/selectors:
- `input#name` (First Name) - 100% width
- `input#lastname` or similar (Last Name) - 100% width  
- `input#email` - 100% width
- `input#form-phone` or phone field - 100% width
- `input#zip` - 48% width (side by side with YOB)
- `input#Year-of-Birth-YYYY` - 48% width

---

### Issue 3: Opt-in Checkbox Overlays Text

**Current Behavior:** Checkbox appears on top of or overlapping the label text.

**Root Cause:** CSS conflict between:
- [`assets/theme.css:893-900`](assets/theme.css:893) sets `display: block` on label
- [`assets/js/action-template-embed.js:110-136`](assets/js/action-template-embed.js:110) tries to set `display: flex` via inline styles

The JavaScript fix applies flex layout but the checkbox positioning within the flex container is not properly configured.

**Fix:** Update CSS to properly style the opt-in section with flex layout:
```css
#can_embed_form form.new_delivery #d_sharing label {
  display: flex !important;
  flex-direction: row !important;
  align-items: flex-start !important;
  gap: 10px !important;
}

#can_embed_form form.new_delivery #d_sharing input[type="checkbox"] {
  flex-shrink: 0 !important;
  margin: 4px 0 0 0 !important;
}
```

---

### Issue 4: No Padding Under Start Writing Button

**Current Behavior:** No spacing between the button and the opt-in checkbox section.

**Fix:** Add margin-bottom to the submit button wrapper:
```css
#can_embed_form form.new_delivery #form_col2 {
  margin-bottom: 20px !important;
}
```

Or target the button directly:
```css
#can_embed_form form.new_delivery input[type="submit"] {
  margin-bottom: 20px !important;
}
```

---

## Implementation Plan

### Step 1: Fix Heading Constraint in Block Template

**File:** [`block-templates/action.html`](block-templates/action.html)

Move `wp:post-title` inside the first column to match the an-events template structure.

### Step 2: Update CSS for Form Field Layout

**File:** [`assets/theme.css`](assets/theme.css)

Add specific selectors to control individual field widths:

```css
/* Stack core fields: name, email, phone */
#can_embed_form form.new_delivery #form_col1 li.core_field:has(input#name),
#can_embed_form form.new_delivery #form_col1 li.core_field:has(input#email),
#can_embed_form form.new_delivery #form_col1 li.core_field:has(input#form-phone),
#can_embed_form form.new_delivery #form_col1 li.core_field:has(input#form-mobile) {
  width: 100% !important;
}

/* Zip and Year of Birth side by side */
#can_embed_form form.new_delivery #form_col1 li.core_field:has(input#zip),
#can_embed_form form.new_delivery #form_col1 li.control-group:has(input#Year-of-Birth-YYYY) {
  width: 48% !important;
}
```

### Step 3: Fix Opt-in Checkbox Alignment

**File:** [`assets/theme.css`](assets/theme.css)

Update the opt-in label styling:

```css
#can_embed_form form.new_delivery #d_sharing label {
  display: flex !important;
  flex-direction: row !important;
  align-items: flex-start !important;
  gap: 10px !important;
  color: #000000 !important;  /* Black text for visibility on white background */
  font-size: 14px !important;
  cursor: pointer !important;
}

#can_embed_form form.new_delivery #d_sharing input[type="checkbox"] {
  flex-shrink: 0 !important;
  margin: 4px 0 0 0 !important;
  width: 18px !important;
  height: 18px !important;
}
```

### Step 4: Add Padding Under Button

**File:** [`assets/theme.css`](assets/theme.css)

```css
#can_embed_form form.new_delivery input[type="submit"] {
  margin-bottom: 20px !important;
}
```

### Step 5: Update JavaScript if Needed

**File:** [`assets/js/action-template-embed.js`](assets/js/action-template-embed.js)

The JavaScript at Block 4 (lines 110-136) already attempts to fix the opt-in styling. May need to update the gap value and ensure checkbox positioning is correct.

---

## Files to Modify

| File | Changes |
|------|---------|
| `block-templates/action.html` | Move post-title inside column |
| `assets/theme.css` | Add field-specific width rules, fix opt-in flex layout, add button margin |
| `assets/js/action-template-embed.js` | Potentially update opt-in fix values |

---

## Testing Checklist

- [ ] First Name field displays full width, stacked
- [ ] Last Name field displays full width, stacked
- [ ] Email field displays full width, stacked
- [ ] Mobile field displays full width, stacked
- [ ] Zip and Year of Birth display side by side
- [ ] Opt-in checkbox is left of text with proper gap
- [ ] Opt-in text is fully visible and readable
- [ ] Padding exists under Start Writing button
- [ ] Heading is constrained within same border as content
- [ ] Event RSVP form still works correctly (no regression)
