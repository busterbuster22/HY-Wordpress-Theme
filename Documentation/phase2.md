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

### Approach options

Three ways to do this, ordered by recommendation:

#### Option A — Elfsight widget (recommended for speed)

1. Create an Elfsight Instagram Feed widget at `https://apps.elfsight.com`.
2. Configure: connect IG account, set layout to grid, max 3–6 posts, remove heavy branding.
3. Elfsight provides an embed code (script tag or iframe).
4. Paste it into a new `wp-block-group` section on the homepage, positioned between the Campaigns row and the In The Media row.

**Pros:** 5-minute setup, no code, Elfsight handles caching/auth/refresh.  
**Cons:** Adds a third-party script load; the free tier may show branding.

#### Option B — Custom PHP shortcode + Instagram Basic Display API

Register a new shortcode `[instagram_feed]` in `functions.php` that:
1. Uses the Instagram Basic Display API (long-lived access token stored as a WP option).
2. Fetches the user's recent media (up to 6 posts).
3. Outputs a card grid reusing the existing `.card-grid` / `.card` CSS classes (matches the campaigns and events row style).
4. Caches the response in a transient (e.g. 6 hours) to avoid hitting API rate limits.

Implementation sketch:
```php
function houseyou_instagram_feed_shortcode() {
    $cached = get_transient( 'houseyou_instagram_feed' );
    if ( $cached ) return $cached;

    $token = get_option( 'houseyou_instagram_token' );
    if ( ! $token ) return '<p>Instagram not connected.</p>';

    $url = add_query_arg( array(
        'fields'       => 'media_url,permalink,caption,media_type',
        'access_token' => $token,
        'limit'        => 6,
    ), 'https://graph.instagram.com/me/media' );

    $response = wp_remote_get( $url );
    if ( is_wp_error( $response ) ) return '';

    $body   = json_decode( wp_remote_retrieve_body( $response ) );
    $data   = $body->data ?? array();

    ob_start();
    ?>
    <div class="card-grid">
        <?php foreach ( $data as $post ) : ?>
            <a href="<?php echo esc_url( $post->permalink ); ?>" class="card-link" target="_blank" rel="noopener">
                <div class="card">
                    <?php if ( $post->media_type === 'VIDEO' ) : ?>
                        <div class="card-image">
                            <img src="<?php echo esc_url( $post->media_url ); ?>" alt="" loading="lazy">
                            <span class="card-play-icon">▶</span>
                        </div>
                    <?php else : ?>
                        <div class="card-image">
                            <img src="<?php echo esc_url( $post->media_url ); ?>" alt="" loading="lazy">
                        </div>
                    <?php endif; ?>
                </div>
            </a>
        <?php endforeach; ?>
    </div>
    <?php
    $html = ob_get_clean();
    set_transient( 'houseyou_instagram_feed', $html, 6 * HOUR_IN_SECONDS );
    return $html;
}
add_shortcode( 'instagram_feed', 'houseyou_instagram_feed_shortcode' );
```

Then add a settings page (like the existing Action Network and Substack settings pages) for the Instagram access token.

**Pros:** No third-party widgets, reuses existing card design, fully controllable.  
**Cons:** Instagram Basic Display API setup (Meta app, token exchange); longer dev time.

#### Option C — Substack articles as a stand-in

If the Substack already publishes IG-embedded posts, use `[substack_articles tax="instagram" ...]` or tag-based filtering. Quick but doesn't show actual IG content.

### Recommendation

Start with **Option A (Elfsight)** for speed. If it works visually and the branding is acceptable, move on. If Elfsight is too slow or branded, swap to **Option B** later (it's a self-contained PHP change and the homepage section stays the same).

### Placement

Insert the new section between the Campaigns row and the In The Media row on the homepage. Use the existing `is-style-dark-section` or `is-style-light-section` block style for visual consistency:

```
Hero →
Campaigns →
[Instagram row — NEW] →
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
| `home.html` or WP Admin — homepage | Add Instagram row block (content change, not template file) |

### Files left alone

| File | Why |
|---|---|
| `functions.php` | No new shortcode needed unless Option B chosen |
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
- [ ] Instagram row renders on homepage
- [ ] Instagram images load, are responsive, look intentional
- [ ] No broken styles on any page
