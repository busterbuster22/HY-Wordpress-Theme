# Action Network Embed Consolidation Plan v2

## Current State (after revert)

There are **3 separate inputs** for Action Network embed info on the page editor:

### 1. "Action Embed Sidebar" — ACF field group stored in DATABASE
- ACF group key: `group_69266f2c9ac00`, field key: `field_69266f2d51c96`
- Type: **text input** (single line)
- Field name: `action_embed_code`
- Position: appears somewhere in editor
- **Does NOT work** (text input can't hold multi-line script tags properly)
- Created manually through ACF admin UI, stored as `acf-field-group` post type in DB
- NOT in any theme code file

### 2. "Action Network Settings" — ACF field group registered in CODE
- ACF group key: `group_action_network_embed`, field key: `field_action_embed_code`
- Type: **textarea** (4 rows)
- Field name: `action_embed_code`
- Position: `'normal'` (below editor, main content area)
- **WORKS** — the shortcode reads from this via `get_field('action_embed_code')`
- Registered by `houseyou_register_acf_fields()` in `functions.php` (~line 950)

### 3. "Event Details" — custom meta box in RIGHT SIDEBAR
- Has: manual "Action Network Event ID" text input, sync button, date/time/location fields
- Reads event ID from ACF field via `houseyou_an_get_event_id_from_acf()`
- The embed code textarea here does NOT power the frontend shortcode
- **Partially works** — sync works if ACF field has data, but the embed display is handled by #2

## Goal

**ONE input, ONE location.** The Event Details sidebar meta box should have:
- Embed code textarea (replaces both ACF fields)
- Auto-detected event ID + sync button (existing)
- Date/time/location fields (existing)

The embed code entered here should:
1. Display the Action Network form on the frontend via `[action_network_embed]`
2. Auto-detect the event ID for the sync button

## Why Previous Attempts Failed

1. **`wp_kses_post()` strips `<script>` tags** — Action Network embeds ARE script tags. Using `wp_kses_post()` to sanitize silently destroyed the embed code on save. Must use `wp_unslash()` instead.

2. **Wrong queries to find the DB-stored ACF field group** — ACF stores the field group key in `post_excerpt`, not in post meta or `post_name`. The deletion queries searched the wrong columns.

3. **Two ACF field groups with same field name** — Both use `action_embed_code` as the field name, creating confusion about which one ACF reads/writes.

## Data Storage

ACF stores field values in `wp_postmeta` with the field name as `meta_key`:
- `meta_key` = `action_embed_code` (the value)
- `meta_key` = `_action_embed_code` (ACF internal reference to field key)

**Strategy:** Save to the SAME meta key (`action_embed_code`) that ACF used. This means all existing pages with ACF data continue working with zero migration needed.

---

## Implementation Steps

All changes are in **2 files**: `functions.php` and `inc/action-network-api.php`

### Step 1: Update Event Details meta box — template check

**File:** `functions.php`
**Function:** `houseyou_event_details_callback()` (~line 360)

Change the template check from `an-events` only to include `action`:

```php
// FIND (approximately lines 362-366):
$template = get_post_meta( $post->ID, '_wp_page_template', true );
if ( $template !== 'an-events' && $template !== '' ) {
    echo '<p>Event details only available for pages using the "AN Events" template.</p>';
    return;
}

// REPLACE WITH:
$template = get_post_meta( $post->ID, '_wp_page_template', true );
if ( ! in_array( $template, array( 'an-events', 'action' ), true ) && $template !== '' ) {
    echo '<p>Event details only available for pages using the "AN Events" or "Action" template.</p>';
    return;
}
```

### Step 2: Replace Event Details meta box content

**File:** `functions.php`
**Function:** `houseyou_event_details_callback()` (~lines 370-450)

Replace the section after the nonce field that currently has the ACF event ID detection and manual Event ID input. The new version:
- Reads embed code from `action_embed_code` post meta (same key ACF used)
- Shows a textarea for the embed code
- Auto-detects event ID and shows sync button
- Keeps the date/time/location fields as-is

```php
// FIND — everything between wp_nonce_field and the date/time/location fields:
// (the ACF detection block, manual Event ID input, sync button section)

// REPLACE the variable setup and the grey box div WITH:

wp_nonce_field( 'houseyou_event_details', 'houseyou_event_details_nonce' );

// Get stored embed code — uses same meta key as ACF for backwards compat
$embed_code = get_post_meta( $post->ID, 'action_embed_code', true );

// Parse event ID from embed code
$event_id = ! empty( $embed_code ) ? houseyou_an_parse_event_id( $embed_code ) : false;

$last_synced = get_post_meta( $post->ID, '_last_synced_at', true );
$event_date = get_post_meta( $post->ID, '_event_date', true );
$event_time = get_post_meta( $post->ID, '_event_time', true );
$event_end_time = get_post_meta( $post->ID, '_event_end_time', true );
$event_location = get_post_meta( $post->ID, '_event_location', true );

?>
<div style="background: #f0f0f1; padding: 12px; margin-bottom: 15px; border-radius: 4px;">
    <p style="margin: 0 0 10px 0;">
        <label for="houseyou_embed_code"><strong>Action Network Embed Code:</strong></label><br>
        <textarea id="houseyou_embed_code" name="houseyou_embed_code" rows="4" style="width: 100%; margin-top: 5px; font-family: monospace; font-size: 12px;"><?php echo esc_textarea( $embed_code ); ?></textarea>
        <small style="display: block; margin-top: 5px; color: #666;">
            Paste the Action Network embed code here. This displays the form on the page and auto-detects the event ID for syncing.
        </small>
    </p>

    <?php if ( ! empty( $event_id ) ) : ?>
        <p style="margin: 10px 0 0 0;">
            <strong>✓ Event ID Detected:</strong><br>
            <code style="background: #fff; padding: 4px 8px; border-radius: 3px; font-size: 11px; display: inline-block; margin-top: 5px;"><?php echo esc_html( $event_id ); ?></code>
        </p>
        <p style="margin: 10px 0 0 0;">
            <button type="button" id="houseyou_sync_event" class="button button-secondary" data-event-id="<?php echo esc_attr( $event_id ); ?>" style="width: 100%;">
                🔄 Sync from Action Network
            </button>
            <span id="houseyou_sync_status" style="display: block; margin-top: 8px; font-size: 12px;"></span>
        </p>
        <?php if ( ! empty( $last_synced ) ) : ?>
            <p style="margin: 8px 0 0 0; font-size: 11px; color: #666;">
                Last synced: <?php echo esc_html( date_i18n( 'M j, Y g:i A', strtotime( $last_synced ) ) ); ?>
            </p>
        <?php endif; ?>
    <?php else : ?>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
            💡 Paste an Action Network embed code above to enable sync
        </p>
    <?php endif; ?>
</div>
```

**IMPORTANT:** The textarea `name` attribute is `houseyou_embed_code` (not `action_network_embed_code`). This avoids colliding with ACF's own form field names if ACF is still active during transition.

The date/time/location fields below remain unchanged.

### Step 3: Update the save function

**File:** `functions.php`
**Function:** `houseyou_save_event_details()` (~line 456)

Replace the embed code / event ID saving section (everything between permissions check and "Save event date" comment):

```php
// FIND (the section that saves Action Network Event ID / embed code):
// This varies depending on revert state — look for the block between
// "Check permissions" and "Save event date"

// REPLACE WITH:

// Save Action Network Embed Code
// IMPORTANT: wp_kses_post() CANNOT be used — it strips <script> tags which
// Action Network embeds require. This field is only editable by users with
// edit_page capability (who already have unfiltered_html in WordPress).
if ( isset( $_POST['houseyou_embed_code'] ) ) {
    $embed_code = wp_unslash( $_POST['houseyou_embed_code'] );
    $embed_code = trim( $embed_code );

    if ( ! empty( $embed_code ) ) {
        update_post_meta( $post_id, 'action_embed_code', $embed_code );

        // Also store the parsed event ID for quick lookups
        $parsed_id = houseyou_an_parse_event_id( $embed_code );
        if ( $parsed_id ) {
            update_post_meta( $post_id, '_action_network_event_id', $parsed_id );
        }
    } else {
        delete_post_meta( $post_id, 'action_embed_code' );
        delete_post_meta( $post_id, '_action_embed_code' );
        delete_post_meta( $post_id, '_action_network_event_id' );
    }
}
```

**Key details:**
- Saves to meta key `action_embed_code` (same key ACF used — backwards compatible)
- Uses `wp_unslash()` NOT `wp_kses_post()` (preserves script tags)
- When cleared, also removes ACF's internal reference key `_action_embed_code`

### Step 4: Update the shortcode

**File:** `functions.php`
**Function:** `houseyou_action_network_embed_shortcode()` (~line 923)

```php
// FIND:
function houseyou_action_network_embed_shortcode() {
    $embed_code = get_field( 'action_embed_code' );

// REPLACE WITH:
function houseyou_action_network_embed_shortcode() {
    $embed_code = get_post_meta( get_the_ID(), 'action_embed_code', true );
```

Also update the warning message text to reference "Event Details sidebar" instead of "ACF field".

The rest of the function (empty check, warning div, return) stays the same.

### Step 5: Remove ACF field group registration

**File:** `functions.php`

Delete the entire `houseyou_register_acf_fields()` function AND its `add_action` hook (~lines 944-1016):

```php
// DELETE everything from this comment to the add_action line:
/**
 * Register ACF Fields for Action Network Integration
 * ...
 */
function houseyou_register_acf_fields() { ... }
add_action( 'acf/init', 'houseyou_register_acf_fields' );
```

Also delete the ACF block theme filter (should be near the shortcode):
```php
// DELETE:
add_filter( 'acf/shortcode/allow_in_block_themes_outside_content', '__return_true' );
```

### Step 6: Delete the DB-stored ACF field group

**File:** `functions.php`

Add a one-time cleanup function. ACF stores the group key in `post_excerpt`:

```php
/**
 * One-time cleanup: remove legacy ACF field groups for Action Network embed.
 *
 * Two ACF field groups existed:
 * - group_action_network_embed (registered in code, now removed)
 * - group_69266f2c9ac00 (created in ACF admin UI, stored in DB)
 * Both are replaced by the Event Details meta box.
 */
function houseyou_cleanup_acf_embed_groups() {
    if ( get_option( 'houseyou_acf_embed_cleaned' ) ) {
        return;
    }

    // Search by post_excerpt — this is where ACF stores the group key
    global $wpdb;

    $group_ids = $wpdb->get_col(
        "SELECT ID FROM {$wpdb->posts}
         WHERE post_type = 'acf-field-group'
         AND (
             post_excerpt = 'group_action_network_embed'
             OR post_excerpt = 'group_69266f2c9ac00'
         )"
    );

    foreach ( $group_ids as $group_id ) {
        // Delete child fields
        $field_ids = $wpdb->get_col( $wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'acf-field' AND post_parent = %d",
            $group_id
        ) );
        foreach ( $field_ids as $field_id ) {
            wp_delete_post( $field_id, true );
        }
        wp_delete_post( $group_id, true );
    }

    update_option( 'houseyou_acf_embed_cleaned', true );
}
add_action( 'admin_init', 'houseyou_cleanup_acf_embed_groups' );
```

**Why direct SQL:** `get_posts()` doesn't support querying by `post_excerpt`. ACF stores the group key in this column, so direct `$wpdb` is the only reliable way to find it.

### Step 7: Update the API helper function

**File:** `inc/action-network-api.php`
**Function:** `houseyou_an_get_event_id_from_acf()` (~line 129)

```php
// FIND:
function houseyou_an_get_event_id_from_acf( $post_id ) {
    if ( ! function_exists( 'get_field' ) ) {
        return false;
    }
    $embed_code = get_field( 'action_embed_code', $post_id );
    ...
}

// REPLACE WITH:
function houseyou_an_get_event_id_from_embed( $post_id ) {
    $embed_code = get_post_meta( $post_id, 'action_embed_code', true );

    if ( empty( $embed_code ) ) {
        return false;
    }

    return houseyou_an_parse_event_id( $embed_code );
}
```

### Step 8: Update all references to old function name

**File:** `functions.php`

Search for `houseyou_an_get_event_id_from_acf` and replace with `houseyou_an_get_event_id_from_embed`. There should be ~2-3 occurrences:
- In `houseyou_event_details_callback()`
- In `houseyou_save_event_details()`
- In `houseyou_ajax_sync_event()`

---

## Files Changed Summary

| File | What changes |
|------|-------------|
| `functions.php` | Steps 1-6, 8: Meta box, save, shortcode, remove ACF registration, cleanup, rename calls |
| `inc/action-network-api.php` | Step 7: Rename function, use `get_post_meta` |

No template files change. No CSS changes. No JS changes.

## What Does NOT Change

- Block templates (`action.html`, `an-events.html`) — still use `[action_network_embed]`
- The shortcode name — still `[action_network_embed]`
- The post meta key for embed data — still `action_embed_code`
- The Event Details date/time/location fields — unchanged
- The sync button and AJAX handler — unchanged (just reads event ID differently)
- The settings page — unchanged
- Admin sync JS — unchanged
- Frontend JS files — unchanged
- CSS — unchanged

## Testing Checklist

1. Edit a page with `action` template — Event Details sidebar shows with embed textarea
2. Edit a page with `an-events` template — same
3. The old ACF "Action Network Settings" box is GONE
4. The old ACF "Action Embed Sidebar" box is GONE
5. Paste an Action Network embed `<script>` tag into the textarea, save — script tag is preserved (not stripped)
6. Event ID auto-detected from embed code, sync button appears
7. View the page on frontend — Action Network form displays correctly
8. Empty the textarea and save — warning shows on frontend for logged-in editors
9. Existing pages that had ACF data still work (same meta key)
