# Phase 2 — Nav restructure + Instagram row

Landing page for Phase 2 work on the House You staging site. All changes scoped to what can be done without waiting on external content.

---

## 2.1 Nav: Contact Us → email icon

**What:** Remove "CONTACT" from the OUR WORK dropdown. Add an email icon (`[✉]`) in the nav bar alongside the existing FB and INSTA social icons, linking to `/contact/`.

### Why
Contact is a utility action (like FB/INSTA), not a content section. Moving it frees up space in the dropdown and keeps utility links grouped.

### Implementation

#### New SVG — email icon

Create `assets/svg/email.svg` — matching the style of the existing social SVGs:
- Same viewBox (810×810)
- `fill="#cb1eaa"` (same brand pink as FB/INSTA)
- Simple envelope icon

#### Max Mega Menu — menu item

1. In WP Admin → Appearance → Menus, locate the "CONTACT" item currently in the OUR WORK dropdown.
2. Move it out of the dropdown to the top-level menu, positioned after the social icons (or before them, whichever looks better).
3. Assign CSS class `mega-social-icon social-icon` to the item so it inherits the existing social-icon styling (`sass/theme.scss` lines 846–928).
4. Set the Navigation Label to an empty string (the SVG will visually represent it).
5. The URL stays `/contact/`.

Wait — the existing social icons (FB, INSTA) use `background-image` on the `<a>` tag via CSS selectors:
```scss
.social-icon a[href*="facebook.com"] {
    background-image: url('../assets/svg/facebook-2.svg') !important;
}
.social-icon a[href*="instagram.com"] {
    background-image: url('../assets/svg/instagram.svg') !important;
}
```

Add a third rule for the email icon:
```scss
.social-icon a[href*="/contact"] {
    background-image: url('../assets/svg/email.svg') !important;
}
```

This matches the pattern — the Selector checks for `/contact` in the href.

#### Nav order reset

After moving the item, use the "Re-order" / "Drag & Drop" in the Max Mega Menu settings to get the desired nav order:

```
EVENTS · CAMPAIGNS · OUR WORK (dropdown) · [✉] · [FB] · [INSTA]
```

Or if email should go after FB/INSTA, adjust as preferred.

---

## 2.2 Homepage: Latest Instagram Posts row

**What:** Add a new block/section on the homepage displaying the latest Instagram posts.

### Implementation

Uses **Smash Balloon Instagram Feed** (free plugin v6.11.3).

**Connected account:** `house_you__` (ID: 17841462139073968), stored in `wp_sbi_sources` table.

**Feed:** Created programmatically (ID: 1) in `wp_sbi_feeds` table because the Lite version has no feed creation UI. The default `[instagram-feed]` shortcode auto-resolves to feed ID 1.

**Shortcode in use:** `[instagram-feed]` (via a `wp:shortcode` block inside a dark-section group block).

### Smash Balloon Lite quirk

The free version stores connected accounts in the `wp_sbi_sources` custom table (not `wp_options`). Feeds must exist in the `wp_sbi_feeds` table, but the Lite version's settings page has no "Add New Feed" button — the Feeds tab only exposes caching, GDPR, and CSS/JS settings. Feeds can be created programmatically via `SBI_Db::feeds_insert()` or a raw `INSERT` into `wp_sbi_feeds` with a JSON `settings` column.

### Placement

Inserted between the Campaigns row and the Articles/Events rows on the homepage. Uses `is-style-dark-section` for visual consistency:

```
Hero →
Campaigns →
[Instagram row — NEW] →
Articles (hidden if empty) →
Events →
In The Media →
Our Story →
Footer
```

---

## 2.3 Files changed checklist

| File | Change |
|---|---|
| `assets/svg/email.svg` | **New** — envelope icon in brand pink |
| `sass/theme.scss` | Add `.social-icon a[href*="/contact"]` background-image rule |
| `assets/theme.css` | **Rebuild** — compiled from SCSS |
| WP Admin — Max Mega Menu | Move CONTACT out of dropdown, add CSS class, set label to empty |
| WP Admin — homepage (ID 2019) | Add Instagram row `wp:group` block with `[instagram-feed]` shortcode |
| `wp_sbi_feeds` table | Feed ID 1 created programmatically (Lite has no UI for this) |

### Files left alone

| File | Why |
|---|---|
| `functions.php` | No changes needed (Smash Balloon plugin handles all PHP) |
| `theme.json` | No new design tokens |
| `block-template-parts/footer.html` | Unchanged |
| `block-template-parts/header.html` | Unchanged (menu is managed by Max Mega Menu plugin, not the template) |
| `inc/substack-api.php` | Unchanged |

---

## 2.4 Verification checklist

- [ ] Nav shows: `EVENTS · CAMPAIGNS · OUR WORK · [✉] · [FB] · [INSTA]`
- [ ] Email icon renders in brand pink, matches FB/INSTA style
- [ ] Email icon links to `/contact/`
- [ ] OUR WORK dropdown no longer contains "CONTACT"
- [ ] Desktop and mobile nav both correct
- [x] Instagram row renders on homepage
- [x] Instagram images load, are responsive, look intentional
- [ ] No broken styles on any page
- [ ] Check if feed layout matches site design (padding, column count, header style)
- [ ] Articles section hidden (hide_if_empty=true) — confirm expected
