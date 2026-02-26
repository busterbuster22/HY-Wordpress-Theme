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