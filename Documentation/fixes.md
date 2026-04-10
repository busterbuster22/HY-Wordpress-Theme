## Issue: Black Bar on Right Side of Staging Site

### Date: 2026-02-26

### Problem Description

A black/dark bar appeared on the right edge of every page on the staging site
(staging-ba32-houseyouorg.wpcomstaging.com) but was not visibly causing problems
on local. Browser inspection confirmed `document.documentElement.scrollWidth` was
1550px against a viewport of 1490px — 60px of horizontal overflow.

### Root Cause

Two compounding issues:

**1. WordPress core injects inline `<style>` blocks for block supports**

When a Group block has a background colour set in its block attributes, WordPress
core generates an inline `<style>` tag in the page `<head>` containing:
```css
:where(.wp-block-group.has-background) { padding-left: 2.375em; padding-right: 2.375em; }
```

This is separate from any stylesheet and cannot be overridden without `!important`.

**2. `theme.css` also applied `--wp--custom--spacing--outer` padding to all
`.wp-block-group.alignfull` and `.wp-block-group.has-background` elements**

The rule around line 188 of `assets/theme.css` (borrowed from Twenty Twenty-Two)
applied `var(--wp--custom--spacing--outer)` — which resolves to `min(4vw, 90px)`,
i.e. ~59.6px at 1490px viewport — to ALL alignfull and has-background group blocks,
including the header. Combined with the header's negative margin technique, this
pushed the header group to a computed width of 1609px against a 1490px viewport.

**Why it wasn't visible on local**

The bug existed on local too (`scrollWidth: 1550` confirmed). It wasn't visible
because the local browser window was wide enough that the overflow went off-screen
without showing a visible dark gap. Staging's layout exposed it.

**Why it was hard to fix**

WordPress.com serves stylesheets with aggressive server-side caching keyed to the
theme version number. Even after the correct CSS was uploaded via SFTP, the old
cached stylesheet was being served, making it appear the fix wasn't working.

### Solution

**1. `assets/theme.css` — remove `.wp-block-group.alignfull` and
`.wp-block-group.has-background` from the broad padding rule at ~line 188,**
and add a dedicated header override with `!important`:
```css
/* Header must have zero horizontal padding — WordPress core injects inline
   padding via :where(.wp-block-group.has-background) and theme.css previously
   also applied --wp--custom--spacing--outer here. Both cause 60px overflow.
   !important is required to beat the inline <style> block. */
header.wp-block-template-part .wp-block-group.alignfull,
header.wp-block-template-part .wp-block-group.has-background {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
```

**2. `style.css` — bump the version number** any time CSS changes are not
reflecting on staging after SFTP upload. WordPress.com caches stylesheets by
version. Incrementing `Version: 1.0.x` in `style.css` forces cache busting
since `functions.php` uses `wp_get_theme()->get('Version')` for both enqueues.

### Key Learnings

1. **WordPress core generates inline `<style>` blocks for block supports** —
   background colour, padding, margin set via block attributes become inline styles
   that external stylesheets cannot override without `!important`.

2. **The bug existed on local but was hidden** — always check `scrollWidth` vs
   `innerWidth` on both environments, not just visual inspection.

3. **WordPress.com caches stylesheets aggressively** — if a fix isn't working
   after SFTP upload, check whether the old file is being served by fetching it
   directly: `fetch('/wp-content/themes/house-you/assets/theme.css?v=' + Date.now())`

4. **Use the console cascade checker to find what's winning** — when a CSS fix
   isn't working, run this to see every rule matching an element and which file
   it comes from, including inline stylesheets (`FROM: undefined` or `FROM: inline`
   means a `<style>` block in the page HTML, not an external file).

5. **Version bump procedure**: increment `Version` in `style.css`, SFTP upload
   `style.css` only — `functions.php` picks up the new version automatically
   via `wp_get_theme()->get('Version')`.

---

## Issue: Action Network Embed — `can_float` Brackets and `#d_sharing` Styling

### Date: 2026-02-26

### Problem Description

Two visual artefacts appeared on action template pages using the AN letter campaign embed:

1. Pink `[` and `]` bracket characters at the top and bottom of the form.
2. A `1.25px dotted` separator line above the opt-in checkbox.
3. Opt-in label rendered at 14px / weight 400 instead of 20px / bold.
4. Opt-in label text not sitting to the right of the checkbox (broken flex layout).

### Key Learnings

#### 1. `can_float` is a CLASS on `#can_embed_form`, not a separate element
AN adds `class="can_float"` to the `#can_embed_form` div itself — it is NOT a child element. This means:
- `document.getElementById('can_float')` → `null` (no element with that ID exists)
- `#can_embed_form .can_float` (descendant selector) matches nothing
- The correct CSS selector is `#can_embed_form.can_float` (no space — class on the same element)

AN's `.can_float` stylesheet rules set `display: inline` on the element and inject `::before` / `::after` pseudo-content that renders as the pink bracket characters.

**Fix:** `assets/theme.css`
```css
.page-template-action #can_embed_form.can_float { display: block !important; background: transparent !important; }
.page-template-action #can_embed_form.can_float::before,
.page-template-action #can_embed_form.can_float::after { content: none !important; display: none !important; }
```
CSS alone was sufficient here because AN's `::before`/`::after` did not use `!important`.

#### 2. `#d_sharing` — AN injects `border-top` and overrides label typography
AN's stylesheet sets:
- `border-top: 1.25px dotted rgb(214, 214, 214)` on `#d_sharing`
- `font-size: 14px` and `font-weight: 400` on `#d_sharing label`
- `display` and layout rules that break the flex checkbox layout

These override our CSS even with `!important` because AN's `<style>` tags load after ours. The only reliable fix is JS `element.style.setProperty('property', 'value', 'important')`, which sets inline `!important` and cannot be overridden by any stylesheet regardless of load order.

**Fix:** `assets/js/action-template-embed.js` — Block 4 runs after DOM is ready:
```js
el.style.setProperty('border-top', 'none', 'important');
label.style.setProperty('font-size', '20px', 'important');
label.style.setProperty('font-weight', 'bold', 'important');
label.style.setProperty('display', 'flex', 'important');
// etc.
```

#### 3. Diagnosing AN DOM structure
Use this console scan to map all AN-injected elements and their computed styles:
```js
Array.from(document.querySelectorAll('[id]')).forEach(function(el) {
  var cs = getComputedStyle(el);
  console.log(el.tagName+'#'+el.id+'.'+el.className, '| display:', cs.display, '| opacity:', cs.opacity);
});
```
And to find all elements with 'can_' or 'float' in class/id:
```js
document.querySelectorAll('*').forEach(function(el) {
  var c = (el.className && el.className.toString ? el.className.toString() : '') + (el.id || '');
  if (/float|can_/i.test(c)) console.log(el.tagName, el.id, el.className);
});
```

#### 4. `::before`/`::after` cannot be set via `element.style`
To override AN pseudo-element content after its stylesheet loads, inject a `<style>` tag directly:
```js
var s = document.createElement('style');
s.textContent = '#can_embed_form.can_float::before, #can_embed_form.can_float::after { content: none !important; display: none !important; }';
document.head.appendChild(s);
```
This was added to Block 5 of `action-template-embed.js` as a fallback (CSS alone fixed it in this case).

#### 5. JS cache busting
All JS on the theme uses `wp_get_theme()->get('Version')` as the cache-buster version string (set in `functions.php`). Bumping `Version:` in `style.css` busts the cache for ALL theme scripts and styles simultaneously.

---

## Issue: Action Network Embed — Letter Form Styling (Stage 2) and Thank-You Page (Stage 3) on Action Template Pages

### Date: 2026-02-26

### Problem Description

On pages using the action template (`block-templates/action.html`), the letter campaign embed had three stages that needed styling to match the home page:

1. **Stage 1 (signup form)** — "Welcome back" text was white and invisible against the page background.
2. **Stage 2 (letter writing form, `#can_letter_one_col`)** — Subject input, message textarea, and send button had no styled appearance (no shadow box, no pink button). Labels ("Your Letter Subject", "Your Message") were white and absolutely positioned over the fields.
3. **Stage 3 (thank-you page)** — Showed AN's default thank-you content instead of the House You custom step 3 content (emphasis text, next-steps list, social icons). Text was white and invisible.

---

### Key Learnings

#### 1. AN re-renders the form after page load — setInterval must NOT clear on first find

Our initial pattern (clear the setInterval after the element is first found) failed on Stage 2 because AN's widget script re-renders `#can_letter_one_col` after the initial DOM inject, wiping any inline styles we applied to the pre-rendered node. The `dataset.letterStyled` guard also prevented re-application.

**Fix:** Remove `clearInterval` on first find and remove the `dataset` guard. Run the interval for its full duration (5 seconds) so styles are re-applied after AN's re-render settles.

```js
// WRONG — clears too early, AN re-renders after this and wipes our styles
var check = setInterval(function() {
  if (document.querySelector('#can_letter_one_col')) {
    applyStyles();
    clearInterval(check); // ← AN re-renders AFTER this
  }
}, 100);

// CORRECT — keep running for full window
var check = setInterval(function() {
  applyStyles(); // runs every 100ms, re-applies after AN re-render
}, 100);
setTimeout(function() { clearInterval(check); }, 5000);
```

#### 2. The 5-second setInterval window expires before Stage 1→Stage 2 transition

When a user is NOT already logged in to AN, they see Stage 1 (signup form) first. If they spend more than 5 seconds completing it before submitting, the Block 6 interval has already been cleared by the timeout. When AN transitions to Stage 2, no styles are applied.

**Fix:** Add a `MutationObserver` in addition to the setInterval. The observer watches `document.body` for child mutations and fires a fresh 3-second burst of style applications when `#can_letter_one_col` appears.

```js
var letterTransitionObserver = new MutationObserver(function() {
  if (document.querySelector('#can_letter_one_col')) {
    var n = 0;
    var burst = setInterval(function() {
      fixLetterFormStyles();
      if (++n >= 30) clearInterval(burst);
    }, 100);
  }
});
letterTransitionObserver.observe(document.body, { childList: true, subtree: true });
```

#### 3. `#can-letter-area-end-the-tax-breaks-and-fund-housing-first` wrapper ID is shared by BOTH home and action template pages

The outer AN widget container `<div id="can-letter-area-end-the-tax-breaks-and-fund-housing-first">` is present on BOTH the home page AND action template pages because both embed the same letter campaign widget. Any `theme.css` rules scoped inside this ID apply to both pages.

This caused Stage 3 text to render white: `theme.css` had:
```css
#can-letter-area-end-the-tax-breaks-and-fund-housing-first
  #can_embed_form.can_thank_you_wrap .form-section p,
#can-letter-area-end-the-tax-breaks-and-fund-housing-first
  #can_embed_form.can_thank_you_wrap .form-section li {
  color: #FFFFFF !important;
  text-shadow: … !important;
}
```
These `!important` rules also applied to the action template thank-you page.

**Diagnosis commands:**
```js
// Confirm the wrapper ID is present and matches
var wrapper = document.querySelector('[id^="can-letter-area"]');
console.log('wrapper ID:', wrapper && wrapper.id);

// Check computed vs inline to see which is winning
var p = document.querySelector('.emphasis-text');
console.log('computed color:', p && getComputedStyle(p).color);
console.log('inline style:', p && p.getAttribute('style'));
```

#### 4. Regular inline `style="color: #000"` loses to stylesheet `color: #FFFFFF !important`

A plain `style` attribute on an element (e.g. `<p style="color: #000000">`) is overridden by a stylesheet `!important` rule. The only mechanism that wins against a stylesheet `!important` is an inline `!important` applied via `element.style.setProperty('color', '#000000', 'important')`.

**Fix for Stage 3 thank-you page text:** After injecting the custom HTML, immediately traverse all text elements and apply black color via `setProperty`:
```js
embedForm.innerHTML = '...custom HTML...';
var textEls = embedForm.querySelectorAll('p, li, strong, h4');
textEls.forEach(function(el) {
  el.style.setProperty('color', '#000000', 'important');
  el.style.setProperty('text-shadow', 'none', 'important');
});
```

#### 5. Diagnosing whether the correct script version is deployed

When a change doesn't appear, fetch the live script to confirm it contains the expected code:
```js
fetch(document.querySelector('script[src*="action-template-embed"]').src)
  .then(r => r.text())
  .then(t => {
    console.log('ver:', document.querySelector('script[src*="action-template-embed"]').src.split('ver=')[1]);
    console.log('Has Block 6 keep-running:', t.includes('Keep interval running'));
    console.log('Has Block 7:', t.includes('Block 7'));
    console.log('Has Block 8:', t.includes('Block 8'));
  });
```
A version bump in `style.css` only busts cache if the corresponding JS file is also uploaded. If the version string is correct but the feature is absent, the wrong JS file was uploaded.

---

### Solution Summary

All fixes are in `assets/js/action-template-embed.js`:

| Block | Purpose |
|-------|---------|
| Block 6 | Force shadow-box styling on Stage 2 form fields and labels via `setProperty`. Uses initial 5s burst + MutationObserver for Stage 1→2 transition. |
| Block 7 | Force "Welcome back" text to black on Stage 1 signup form (same 5s burst approach). |
| Block 8 | Replace AN's default Stage 3 thank-you page with HY custom content. Uses MutationObserver for in-session submit + immediate check for page-load thank-you state. After injecting HTML, applies `setProperty('color', '#000000', 'important')` on all text elements to beat `theme.css !important` rules scoped to the shared `#can-letter-area-...` wrapper ID. |