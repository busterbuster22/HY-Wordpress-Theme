# Embedded Forms — Action Network Styling Reference

## Overview

All embedded forms on the House You theme use **Action Network (AN)** widgets. There is no Contact Form 7 or other form plugin in use. AN provides embeddable forms via JavaScript widgets that inject HTML and their own stylesheet into the page after WordPress has already rendered and loaded theme assets.

There are three distinct use cases across the theme:

| Template | Block Template File | Widget Type | Form Class | JS Script |
|---|---|---|---|---|
| Home page | `block-templates/home-2026.html` | `v6/letter` | `form.new_delivery` | `assets/js/home-letter-action.js` |
| Action template | `block-templates/action.html` | `v6/letter` or `v5/form` | `form.new_delivery` or `form.new_answer` | `assets/js/action-template-embed.js` |
| Events template | `block-templates/an-events.html` | `v6/event` | `form.new_rsvp` | `assets/js/action-event-embed.js` |

---

## How AN Forms Get onto the Page

1. The block template contains the `[action_network_embed]` shortcode (or the embed HTML is placed directly in the page content via the WordPress editor).
2. AN's loader script (`https://actionnetwork.org/scripts/embed-...js`) executes after page load and injects the form HTML into the wrapper `<div>`.
3. AN also injects its own stylesheet: `https://actionnetwork.org/css/style-embed-v3.css` — this lands in the `<head>` **after** `assets/theme.css`.

The outer container that AN renders into has an ID in the format `can-[type]-area-[campaign-slug]`. For the letter campaign it is:

```
#can-letter-area-end-the-tax-breaks-and-fund-housing-first
```

Inside that container, AN renders:

```html
<div id="can_embed_form" class="[can_float] [can_thank_you_wrap]">
  <div id="can_embed_form_inner">
    <form class="new_delivery | new_answer | new_rsvp">
      ...
    </form>
  </div>
</div>
```

---

## The Core Problem: Stylesheet Load Order

AN's stylesheet loads **after** `assets/theme.css`. This has three important consequences:

1. **AN rules with equal specificity always win** — our rules are earlier in the cascade.
2. **AN `!important` rules override our `!important` rules** — `!important` does not create a separate cascade layer; load order still applies when both declarations carry `!important` at equal specificity.
3. **AN re-renders form elements between stages** — any inline styles we set on the first render are wiped when AN replaces the DOM node.

### Resolution hierarchy (from weakest to strongest)

| Mechanism | When it works |
|---|---|
| `theme.css` rule without `!important` | Only if AN doesn't target the same property at all |
| `theme.css` rule with `!important` | Only if AN's rule does NOT also use `!important` on the same property |
| `element.style.setProperty('prop', 'val', 'important')` via JS | **Always wins** — inline `!important` overrides every stylesheet rule regardless of load order |
| Injected `<style>` tag appended to `<head>` | Required for pseudo-elements (`::before`/`::after`) which cannot be targeted via `element.style` |

---

## CSS Styling — `assets/theme.css` (compiled from `sass/theme.scss`)

CSS rules are the first line of defence. They work reliably for properties AN does not override with `!important`.

### Shared AN selectors (all form types)

```scss
/* Wrapper */
#can_embed_form { ... }

/* Input fields */
#can_embed_form form.new_delivery input[type=text],
#can_embed_form form.new_answer   input[type=text],
#can_embed_form form.new_rsvp     input[type=text] {
    border: 2px solid #2D2A2E !important;
    box-shadow: 10px 10px 0px 0px #2D2A2E !important;
    ...
}

/* Submit buttons */
#can_embed_form form.new_delivery input[type=submit],
#can_embed_form form.new_answer   input[type=submit],
#can_embed_form form.new_rsvp     input[type=submit] { ... }
```

> **Critical:** A CSS rule that only targets `form.new_delivery` will NOT apply to `form.new_answer` (petition/form widget) or `form.new_rsvp` (event widget). All three form classes must be included in any shared rule.

### `can_float` class — CSS fix

AN adds `class="can_float"` directly to `#can_embed_form` itself (it is NOT a child element). AN's `.can_float` stylesheet rule sets `display: inline` on the element and injects `::before`/`::after` pseudo-content that renders as visible pink `[` and `]` bracket characters.

**Common mistakes:**
- `document.getElementById('can_float')` → `null` (no element has `id="can_float"`)
- `#can_embed_form .can_float` (descendant selector) → matches nothing
- The correct selector is `#can_embed_form.can_float` (no space — the class is on the same element)

**CSS fix in `theme.css`** (scoped to action template pages only):
```scss
.page-template-action #can_embed_form.can_float {
    display: block !important;
    background: transparent !important;
}
.page-template-action #can_embed_form.can_float::before,
.page-template-action #can_embed_form.can_float::after {
    content: none !important;
    display: none !important;
}
```

CSS alone is sufficient here because AN's `::before`/`::after` rules do not use `!important`. A JS-based `<style>` injection is added in Block 5 of [`action-template-embed.js`](../assets/js/action-template-embed.js) as a fallback for cases where AN's stylesheet loads before the CSS fix takes effect.

### `#d_sharing` — requires JS (CSS insufficient)

AN's stylesheet sets on `#d_sharing`:
- `border-top: 1.25px dotted rgb(214, 214, 214)` — with `!important`
- `font-size: 14px` and `font-weight: 400` on its `label` — with `!important`
- `display` and layout rules that break the flex checkbox layout — with `!important`

These override our CSS even with `!important` because AN's `<style>` tags load after ours. **CSS cannot fix these** — see the JS section below.

---

## JavaScript Styling — Per-Template Scripts

JS fixes via `element.style.setProperty('prop', 'val', 'important')` are required when:
1. AN's stylesheet uses `!important` on the property
2. AN re-renders the form between stages (wiping any previously applied inline styles)
3. The element doesn't exist until AN's script creates it

All scripts are loaded conditionally in [`functions.php`](../functions.php) — each only loads on the relevant template.

### Polling pattern

Because AN renders asynchronously, all element targeting uses a `setInterval` polling loop with a `setTimeout` expiry. The standard pattern is a 5-second window at 100ms intervals:

```js
var check = setInterval(function() {
    if (document.querySelector('#target')) {
        applyFix();
    }
}, 100);
setTimeout(function() { clearInterval(check); }, 5000);
```

**Important:** For elements that AN re-renders after the initial DOM inject (notably `#can_letter_one_col` in Stage 2 of letter campaigns), do **not** call `clearInterval` on first find. AN will wipe any styles applied to the pre-render node. Keep the interval running for the full 5-second window so styles are re-applied after AN's re-render settles.

---

## Home Page — `assets/js/home-letter-action.js`

Loaded only on `is_front_page()`. An early-exit guard checks for the `#can-letter-area-end-the-tax-breaks-and-fund-housing-first` container — if it is not present, the entire script exits immediately.

The home page uses a `v6/letter` widget (`form.new_delivery`) overlaid on the hero background image. Text on the form is white with text-shadow to remain readable against the background.

### Block-by-block breakdown

| Block | What it does |
|---|---|
| Block 1 | Fixes the "Housing Demographic" `<select>` — replaces the default first option with a disabled placeholder option ("Your housing situation") and greys out the text when no selection is made |
| Block 2 | Adds `placeholder="Year of Birth (YYYY)"` to `input#Year-of-Birth-YYYY` (AN omits this by default) |
| Block 3 | Injects a "Step 2: Send a message to our politicians" heading and description paragraph above `#can_letter_one_col` (Stage 2 of the letter form). Uses a `MutationObserver` on `document.body` to detect when `#can_letter_one_col` becomes visible, plus an immediate check on DOM ready. White text with heavy `text-shadow` for legibility over hero image. |
| Block 4 | Replaces AN's default thank-you page (Stage 3) with House You custom content: emphasis text, "Next steps" ordered list, and Instagram/Facebook social icon links. Uses a `MutationObserver` watching for `#can_embed_form` gaining the `can_thank_you_wrap` class, plus an immediate check on DOM ready. |
| Block 5 | Overrides submit button text from AN's default "Start Writing" to "Have Your Say". Uses both a `MutationObserver` (to catch AN setting it back via attribute mutation) and a `Object.defineProperty` intercept on the element's `value` property setter (to catch AN reverting it via JavaScript assignment). |
| Block 6 (DOMContentLoaded) | Injects the "Step 1: Join the movement" heading above `#form_col1`. Also injects the privacy disclaimer paragraph after `#d_sharing`. Both use the 5-second polling pattern with `clearInterval` on first find (these elements are not re-rendered by AN after first render). Disclaimer text is white with `text-shadow` to match the hero background. |

### Shared wrapper ID caveat

`#can-letter-area-end-the-tax-breaks-and-fund-housing-first` is present on **both** the home page and any action template page that embeds the same letter campaign widget. Any `theme.css` rules scoped inside this ID will apply to both page types. When writing CSS for Stage 3 (`.can_thank_you_wrap`) text colour, this ID scoping caused white text to appear on the action template thank-you page. See the action template Block 8 section below for the resolution.

---

## Action Template — `assets/js/action-template-embed.js`

Loaded only on `is_page_template('action')`. No early-exit guard is needed — WordPress only enqueues the script on matching pages.

Action template pages can host either:
- A **letter campaign** (`v6/letter` → `form.new_delivery`) — three-stage form
- A **petition / form** (`v5/form` → `form.new_answer`) — single-stage signup form

### Block-by-block breakdown

#### Block 1 — Form column width fix

AN injects `#form_col1` and `#form_col2` as floated columns at fractional widths. This block sets them to `width: 100%` / `float: none` / `clear: both` via `setProperty('…', 'important')`. Clears the interval on first find (these elements are not re-rendered).

#### Block 1b — Remove border from `#can_embed_form` wrapper

AN's stylesheet sets `border: 1px solid #eaeaea` on `#can_embed_form`. This overrides our CSS. JS `setProperty('border', 'none', 'important')` is required. Also hides the `border-bottom` on `h2` inside `form.new_answer`. Keeps polling for 5 seconds (does not clear on first find) in case AN re-injects.

#### Block 2 — Year of Birth placeholder

Identical to Block 2 of `home-letter-action.js`. Adds `placeholder="Year of Birth (YYYY)"` to `input#Year-of-Birth-YYYY`.

#### Block 3 — Privacy disclaimer injection

Injects the privacy disclaimer `<p>` after `#d_sharing` in `form.new_delivery`. Text is dark (`color: #333333`) — appropriate for the action template's white/light background (contrast with home page which uses white text). Clears the interval on first find.

#### Block 4 — `#d_sharing` typography and border fix

AN's stylesheet uses `!important` on `#d_sharing` properties that break the opt-in checkbox section:
- `border-top: 1.25px dotted` separator line
- `font-size: 14px` / `font-weight: 400` on the label (overrides our 20px bold)
- `display` rules that break the flex checkbox+label layout

All fixed via `setProperty('…', 'important')`:

```js
el.style.setProperty('border-top', 'none', 'important');
ul.style.setProperty('list-style', 'none', 'important');
label.style.setProperty('display',        'flex',       'important');
label.style.setProperty('flex-direction', 'row',        'important');
label.style.setProperty('align-items',    'flex-start', 'important');
label.style.setProperty('gap',            '8px',        'important');
label.style.setProperty('font-size',      '20px',       'important');
label.style.setProperty('font-weight',    'bold',       'important');
label.style.setProperty('color',          '#000000',    'important');
```

Uses a `dataset.dSharingFixed` guard to avoid re-applying. Clears interval on first find.

#### Block 5 — `can_float` bracket artefacts fix

Handles the case where AN adds `class="can_float"` to `#can_embed_form`. Applies:
1. `setProperty('display', 'block', 'important')` to override AN's `display: inline`
2. `setProperty('background', 'transparent', 'important')` to remove any background
3. Injects a `<style>` tag into `<head>` to suppress `::before`/`::after` bracket characters (pseudo-elements cannot be targeted via `element.style`)

```js
var style = document.createElement('style');
style.textContent = '#can_embed_form.can_float::before, #can_embed_form.can_float::after { content: none !important; display: none !important; }';
document.head.appendChild(style);
```

Uses `dataset.floatFixed` guard. Clears interval on first find.

#### Block 6 — Stage 2 letter form field and button styles

Targets `#can_letter_one_col` (the letter writing stage) and applies full shadow-box styling to:
- Text inputs (subject field) — border, box-shadow, border-radius, padding, font
- Textarea (message body) — same styling plus `min-height: 300px`
- Submit button — pink `#CB1EAA` background, white text, League Spartan, uppercase, shadow
- Floating labels (`#form_col2 label.floatlabel-label`) — black text, no text-shadow, `position: relative` (overrides AN's absolute positioning that overlays them on the fields)
- "Welcome back" text inside `#action_welcome_message_inner` — forced to `color: #000000`

**Why the interval must NOT clear on first find:**

AN's widget script re-renders `#can_letter_one_col` after the initial DOM inject, replacing the node and wiping any inline styles. The interval must run for its full 5-second window so styles are re-applied after AN's re-render settles.

**Why a `MutationObserver` is also required:**

The initial 5-second window expires before a Stage 1 → Stage 2 transition if the user takes longer than 5 seconds on the signup form. A `MutationObserver` watches `document.body` for child mutations and fires a fresh 3-second burst (30 × 100ms) when `#can_letter_one_col` appears:

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

#### Block 7 — Stage 1 "Welcome back" text

The `#action_welcome_message_inner` section also appears inside `form.new_delivery` on Stage 1 (signup form), where it inherits `color: white` from `theme.css` rules targeting the hero background context. Forces black text via `setProperty`. Same keep-running 5-second approach as Block 6 (no `clearInterval` on first find).

#### Block 8 — Stage 3 custom thank-you page

Replaces AN's default Stage 3 content with HY custom content: emphasis text, "Next steps" ordered list, and social icon links.

Uses a `MutationObserver` watching for `#can_embed_form` gaining `class="can_thank_you_wrap"`, plus an immediate check in case AN already rendered the thank-you state before the script ran.

After injecting the custom HTML, immediately traverses all text elements and applies black via `setProperty` to beat the `theme.css !important` rules that set `color: #FFFFFF` on `.form-section p` and `.form-section li` (those rules are scoped to `#can-letter-area-end-the-tax-breaks-and-fund-housing-first` which is shared between home and action template pages):

```js
embedForm.innerHTML = '...custom HTML...';
var textEls = embedForm.querySelectorAll('p, li, strong, h4');
textEls.forEach(function(el) {
    el.style.setProperty('color',       '#000000', 'important');
    el.style.setProperty('text-shadow', 'none',    'important');
});
```

A `.final-step-confirmation` guard prevents double-injection.

---

## Events Template — `assets/js/action-event-embed.js`

Loaded only on `is_page_template('an-events')`. The event template embeds a `v6/event` widget (`form.new_rsvp`).

This script has a narrower scope than the other two — it only hides unwanted elements that AN injects:

| Element | Action |
|---|---|
| `#can_embed_form .last_line` | Hidden via `display: none`, `visibility: hidden`, `height: 0`, `overflow: hidden` |
| `#can_embed_form_inner > h4` (if text contains "Attend this event") | Hidden via `display: none` |

Uses the standard polling pattern, but with a **10-second** expiry (doubled from the default 5 seconds). Clears the interval once both elements have been found and hidden.

CSS styling for the event form (input borders, submit button, etc.) is handled entirely in `assets/theme.css` via `#can_embed_form form.new_rsvp` selectors — no `setProperty` overrides are required because AN's event form stylesheet does not set `!important` on the properties we style.

---

## Letter Campaign Stages (v6/letter)

Letter campaigns have three distinct DOM states, each requiring separate styling treatment:

| Stage | AN state | Key DOM element | Script that handles it |
|---|---|---|---|
| Stage 1 | Signup form (not yet logged in to AN) | `form.new_delivery` inside `#can_embed_form` | Block 7 (action) / Block 6 (home) |
| Stage 2 | Letter writing form | `#can_letter_one_col` | Block 6 (action) / Block 3 (home) |
| Stage 3 | Thank-you / confirmation | `#can_embed_form.can_thank_you_wrap` | Block 8 (action) / Block 4 (home) |

If the user is **already logged in** to AN when they load the page, they skip Stage 1 and land directly on Stage 2. If they have **already submitted** the letter previously, they land directly on Stage 3. Scripts must handle all three entry points.

---

## Cache Busting

All theme scripts are enqueued in [`functions.php`](../functions.php) with `wp_get_theme()->get('Version')` as the cache-buster version string. Bumping the `Version:` field in [`style.css`](../style.css) line 6 will bust the browser/CDN cache for **all** theme scripts and styles simultaneously.

If a deployed change is not appearing in the browser, verify the correct file was uploaded:

```js
fetch(document.querySelector('script[src*="action-template-embed"]').src)
    .then(r => r.text())
    .then(t => {
        var src = document.querySelector('script[src*="action-template-embed"]').src;
        console.log('ver:', src.split('ver=')[1]);
        console.log('Has Block 6 keep-running:', t.includes('Keep interval running') || t.includes('fixLetterFormStyles'));
        console.log('Has Block 7:', t.includes('fixWelcomeBackPage1'));
        console.log('Has Block 8:', t.includes('showThankYouPage'));
        console.log('Has Block 9 (Person floatlabel):', t.includes('fixPersonFields'));
        console.log('Has Block 10 (checkbox row):', t.includes('fixCheckboxRow'));
        console.log('Block 9 uses setProperty !important:', t.includes("setProperty( 'display', 'none', 'important'"));
    });
```

---

## Diagnostic Commands

### Map all AN-injected elements and computed display/opacity

```js
Array.from(document.querySelectorAll('[id]')).forEach(function(el) {
    var cs = getComputedStyle(el);
    console.log(el.tagName+'#'+el.id+'.'+el.className, '| display:', cs.display, '| opacity:', cs.opacity);
});
```

### Find all elements with `can_` or `float` in class/id

```js
document.querySelectorAll('*').forEach(function(el) {
    var c = (el.className && el.className.toString ? el.className.toString() : '') + (el.id || '');
    if (/float|can_/i.test(c)) console.log(el.tagName, el.id, el.className);
});
```

### Check computed vs inline on a specific element

```js
var el = document.querySelector('#d_sharing label');
console.log('computed color:', getComputedStyle(el).color);
console.log('computed font-size:', getComputedStyle(el).fontSize);
console.log('inline style:', el.getAttribute('style'));
```

### Confirm which stylesheet rule is winning

```js
// Find all rules targeting an element (Chrome only)
var el = document.querySelector('#can_embed_form');
var sheets = Array.from(document.styleSheets);
sheets.forEach(function(sheet) {
    try {
        Array.from(sheet.cssRules).forEach(function(rule) {
            if (rule.selectorText && el.matches(rule.selectorText)) {
                console.log(sheet.href, rule.selectorText, rule.style.cssText);
            }
        });
    } catch(e) {}
});
```

### Check if your CSS rule exists in the loaded stylesheet

```js
fetch(document.querySelector('link[href*="theme.css"]').href)
    .then(r => r.text())
    .then(t => {
        console.log('Has new_answer:', t.includes('form.new_answer'));
        console.log('Has can_float fix:', t.includes('can_float'));
        console.log('Has d_sharing:', t.includes('d_sharing'));
    });
```

### Confirm the outer wrapper ID (shared between home and action template)

```js
var wrapper = document.querySelector('[id^="can-letter-area"]');
console.log('wrapper ID:', wrapper && wrapper.id);
// Expected: "can-letter-area-end-the-tax-breaks-and-fund-housing-first"
```

---

## Key Rules and Gotchas

### `can_float` is a class on `#can_embed_form`, not a separate element

`document.getElementById('can_float')` returns `null`. `#can_embed_form .can_float` matches nothing. The correct selector is `#can_embed_form.can_float` (no space).

### `::before`/`::after` cannot be set via `element.style`

To override pseudo-element content after AN's stylesheet loads, inject a `<style>` tag:

```js
var s = document.createElement('style');
s.textContent = '#can_embed_form.can_float::before, #can_embed_form.can_float::after { content: none !important; display: none !important; }';
document.head.appendChild(s);
```

### Inline `style="color: #000"` loses to stylesheet `color: #fff !important`

A plain `style` attribute does NOT override a stylesheet `!important` rule. Only `element.style.setProperty('color', '#000000', 'important')` (inline `!important`) wins against stylesheet `!important`. This is the only reliable mechanism when AN's stylesheet carries `!important`.

### The shared `#can-letter-area-...` ID applies to both home and action template

Any `theme.css` rule scoped inside `#can-letter-area-end-the-tax-breaks-and-fund-housing-first` will apply on both the home page and action template pages that embed the same letter campaign. Stage 3 text colour rules scoped to this ID will affect both pages. Use `setProperty` in JS to apply page-specific overrides that beat the shared CSS rules.

### AN re-renders `#can_letter_one_col` after initial inject

Never `clearInterval` on first find for Block 6 style applications. AN's widget script replaces the node, wiping all inline styles. The interval must run for its full duration (5 seconds) so styles are re-applied after AN's post-render settles.

### The 5-second interval window expires before Stage 1→Stage 2 transition

A user who spends more than 5 seconds on the Stage 1 signup form will have the Block 6 interval already expired by the time they submit and AN renders Stage 2. Always pair `setInterval` blocks with a `MutationObserver` for any styling that must survive stage transitions.

---

## AN Floatlabel System — How It Works

AN's floatlabel widget gives core fields (First Name, Last Name, Email, Zip) their "label inside the border" appearance. Understanding the exact mechanism is critical when retrofitting custom fields to match.

### Structure AN renders for core fields

```html
<li class="core_field">
  <label class="control-label disabled" for="form-first_name"></label>
  <div class="floatlabel-wrapper">
    <label for="form-first_name" class="floatlabel-label floatlabel-label-active" style="display: block;">First Name </label>
    <input placeholder="First Name " type="text" class="floatlabel-input floatlabel-input-slide">
  </div>
</li>
```

### What AN's CSS does

| Class | `position` | `top` | `left` | `font-size` | `z-index` | `display` |
|---|---|---|---|---|---|---|
| `.floatlabel-wrapper` | `relative` | — | — | — | — | `block` |
| `.floatlabel-label` (no active) | `absolute` | `~26px` | `12px` | `16px` | `auto` | **`block !important`** |
| `.floatlabel-label-active` | `absolute` | `-9px` | `9px` | `11px` | `99` | **`block !important`** |

**Critical:** AN's CSS sets `display: block !important` on `.floatlabel-label` in **both** states — active and inactive. The label is never hidden by stylesheet rules. For core fields this is fine because the label text and placeholder text are identical, so the label overlays the placeholder imperceptibly.

### What AN's floatlabel JavaScript does

AN's JS initialises once on all `.floatlabel-input` elements at the moment the form renders. It:

1. Attaches `focus` / `blur` / `input` event listeners to each `floatlabel-input`
2. On focus or when value is non-empty: adds `floatlabel-label-active` class + sets `label.style.display = 'block'` inline
3. On blur with empty value: removes `floatlabel-label-active` class + clears `label.style.display`

It does **not** set `display: none` on inactive labels — it relies on the label/placeholder overlap.

**AN's floatlabel JS will not run again after initial render.** Any `floatlabel-input` elements added to the DOM after AN's script initialised will not receive event listeners. You must wire them manually.

---

## Retrofitting Custom AN Fields to Floatlabel Style (Block 9)

### The problem

AN's `v5/form` builder renders custom text fields (`js-fb-textinput`) without the floatlabel structure:

```html
<li class="control-group js-fb-textinput">
  <label class="control-label" for="Person-1">Person #1</label>
  <input id="Person-1" name="Person #1" type="text" class="input-xlarge">
</li>
```

The `control-label` sits above the input — outside the border. AN's floatlabel JS does not process these fields.

### The solution (Block 9 pattern)

1. **Hide** the original `label.control-label` via `setProperty('display','none','important')`
2. **Wrap** the input in a `<div class="floatlabel-wrapper">` — AN's CSS gives this `position: relative`, which makes absolute-positioned children position themselves inside the wrapper
3. **Create** a `<label class="floatlabel-label">` inside the wrapper — AN's CSS positions it at `top:26px; left:12px` (centred over the input) with `display: block !important`
4. **Set `placeholder`** on the input — needed because unlike core fields we must explicitly hide the `.floatlabel-label` in inactive state (see below)
5. **Add `floatlabel-input floatlabel-input-slide`** classes to the input (ensures any AN CSS targeting these classes applies)
6. **Wire activate/deactivate manually** — see below

### Why you must use `setProperty('display','none','important')` for the inactive state

AN's CSS has `display: block !important` on `.floatlabel-label`. A plain `element.style.display = 'none'` **loses** to an `!important` stylesheet rule when both have equal specificity. The only mechanism that beats a stylesheet `!important` is an **inline `!important`** set via `setProperty`:

```js
// WRONG — loses to AN's display:block !important
floatLabel.style.display = 'none';

// CORRECT — inline !important beats ANY stylesheet rule
floatLabel.style.setProperty('display', 'none', 'important');
```

For core fields AN avoids this problem entirely by never hiding the label. For retrofitted custom fields you MUST use `setProperty` with `'important'`.

### Activate / deactivate pattern

```js
var activate = function () {
    floatLabel.classList.add( 'floatlabel-label-active' );
    // AN's CSS handles position/size via the class; we just need display:block
    floatLabel.style.setProperty( 'display', 'block', 'important' );
};
var deactivate = function () {
    floatLabel.classList.remove( 'floatlabel-label-active' );
    // Must use setProperty 'important' — AN's CSS sets display:block !important
    floatLabel.style.setProperty( 'display', 'none', 'important' );
};

// Set initial state
if ( input.value ) { activate(); } else { deactivate(); }

// Wire events manually (AN's floatlabel JS will not observe retrofitted inputs)
input.addEventListener( 'focus', activate );
input.addEventListener( 'blur',  function () { if ( ! input.value ) { deactivate(); } } );
input.addEventListener( 'input', function () { if ( input.value ) { activate(); } else { deactivate(); } } );
```

### What NOT to do

- **Do not** set explicit positioning CSS (`position: absolute; top: 50%; transform: translateY(-50%)`) on the `floatlabel-label` via `setProperty`. This creates a second set of inline `!important` rules that fight AN's CSS for `.floatlabel-label-active` positioning and produce incorrect results (label always visible, positioned in the wrong place on activation).
- **Do not** omit `placeholder` on the input. Without it, the hidden inactive label leaves the field visually empty — the user has no cue which field they are in.
- **Do not** use `style.display = 'block'` without `setProperty + 'important'` for activate — AN's `.floatlabel-label-active` already sets `display: block !important` via CSS, so this works incidentally, but for consistency always match the inactive counterpart pattern.

---

## Flex Container Layout in `#form_col1` (Block 1 + Blocks 9/10)

### Why Block 1 sets `display: flex`

AN injects `#form_col1` and `#form_col2` as floated columns at fractional widths. Block 1 overrides them to `width: 100%; float: none; display: flex` to force full-width stacking.

### Why `flex-wrap: wrap` must also be set

Without `flex-wrap: wrap` (the default is `nowrap`), all direct children of `#form_col1` (all the `<li>` elements) are forced onto a single horizontal row regardless of their widths. The standard two-column layout for core fields (First Name/Last Name side by side) works because AN's CSS gives `li.core_field` approximately 49% width — two fit on one row. But custom fields (`li.control-group.js-fb-textinput`, `li.control-group.checkbox_group_wrap`) have no explicit width, so they crowd into the same row.

Adding `flex-wrap: wrap` to Block 1 allows items to wrap. Core fields at ~49% each remain side-by-side. Custom fields with `flex: 0 0 100%` each take their own row.

### Making custom fields take their own row

Any `<li>` that should occupy a full row inside the `flex-wrap: wrap` container must have:

```js
li.style.setProperty( 'flex',    '0 0 100%', 'important' );
li.style.setProperty( 'width',   '100%',     'important' );
li.style.setProperty( 'display', 'block',    'important' );
```

For the checkbox row (`li.control-group.checkbox_group_wrap`), the full-row `flex` applies at the `li` level. The row's own children (question label + checkbox span) are then laid out with a second `display: flex; flex-direction: row` on the `li` itself.

---

## `js-fb-textinput` vs `core_field` — Field Type Reference

| AN field type | HTML structure | Has floatlabel? | How to style label |
|---|---|---|---|
| `core_field` (First Name, Last Name, Email, Zip) | `<div class="floatlabel-wrapper"><label class="floatlabel-label">…</div>` | Yes — AN JS wires it at render | AN handles it; no JS needed |
| `js-fb-textinput` (custom text fields, e.g. Person #1) | `<label class="control-label">` above `<input>` | No — AN JS never processes these | Use Block 9 retrofit pattern |
| `js-fb-multiplecheckboxes` (custom checkbox group) | `<label class="check_radio_label">` + `<span class="controls check_radio_field">` stacked | No | Use flex row on the `li` (Block 10 pattern) |
