# Action Network Embed Consolidation Plan

## Data Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        EDITOR (Admin)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Event Details Sidebar                                    │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ Action Network Embed Code:                           │ │   │
│  │ │ <script src='https://actionnetwork.org/widgets/...'>│ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │                         │                                │   │
│  │                         ▼                                │   │
│  │              Saved to post meta:                         │   │
│  │              _action_network_embed_code                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  Template: action.html or an-events.html                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [action_network_embed] shortcode                         │   │
│  │         │                                                │   │
│  │         ▼                                                │   │
│  │ houseyou_action_network_embed_shortcode()                │   │
│  │         │                                                │   │
│  │         ▼                                                │   │
│  │ get_post_meta( '_action_network_embed_code' )            │   │
│  │         │                                                │   │
│  │         ▼                                                │   │
│  │ Output: <script src='...'> renders RSVP form            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Problem Summary
Currently there are **3 separate places** to input Action Network embed information:

1. **Event Details sidebar** (`functions.php` lines 346-354) - WordPress meta box with Event ID input, sync button, date/time/location fields. Only shows for `an-events` template.

2. **ACF "Action Network Settings"** (`functions.php` lines 956-1016) - ACF field group with "Action Network Embed Code" textarea. Shows for both `action` and `an-events` templates. Position is `'normal'` (main content area below editor).

3. **User confusion** - Users don't know which field to use, and the date/time sync doesn't work properly.

## Solution
Consolidate to **ONE input location**: The Event Details sidebar meta box, visible for both `action` and `an-events` templates. Remove the ACF field group entirely.

---

## Implementation Steps

### Step 1: Update Event Details Meta Box Template Check

**File:** `functions.php`
**Function:** `houseyou_event_details_callback` (lines 360-451)

**Change line 362-366:**
```php
// FROM:
$template = get_post_meta( $post->ID, '_wp_page_template', true );
if ( $template !== 'an-events' && $template !== '' ) {
    echo '<p>Event details only available for pages using the "AN Events" template.</p>';
    return;
}

// TO:
$template = get_post_meta( $post->ID, '_wp_page_template', true );
if ( ! in_array( $template, array( 'an-events', 'action' ) ) && $template !== '' ) {
    echo '<p>Event details only available for pages using the "AN Events" or "Action" template.</p>';
    return;
}
```

### Step 2: Replace Event ID Input with Embed Code Textarea

**File:** `functions.php`
**Function:** `houseyou_event_details_callback` (lines 383-422)

**Replace the entire embed code section with:**
```php
// Get stored embed code
$embed_code = get_post_meta( $post->ID, '_action_network_embed_code', true );
// Fallback to ACF field for backwards compatibility
if ( empty( $embed_code ) && function_exists( 'get_field' ) ) {
    $embed_code = get_field( 'action_embed_code', $post->ID );
}

// Parse event ID from embed code
$event_id = houseyou_an_parse_event_id( $embed_code );

?>
<div style="background: #f0f0f1; padding: 12px; margin-bottom: 15px; border-radius: 4px;">
    <p style="margin: 0 0 10px 0;">
        <label for="action_network_embed_code"><strong>Action Network Embed Code:</strong></label><br>
        <textarea id="action_network_embed_code" name="action_network_embed_code" rows="4" style="width: 100%; margin-top: 5px; font-family: monospace; font-size: 12px;"><?php echo esc_textarea( $embed_code ); ?></textarea>
        <small style="display: block; margin-top: 5px; color: #666;">
            Paste the Action Network embed code, event URL, or event ID. The event ID will be auto-detected.
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
            💡 Paste an Action Network embed code to enable sync
        </p>
    <?php endif; ?>
</div>
```

### Step 3: Update Save Function

**File:** `functions.php`
**Function:** `houseyou_save_event_details` (lines 456-520)

**Add after line 472 (after permissions check):**
```php
// Save Action Network Embed Code
if ( isset( $_POST['action_network_embed_code'] ) ) {
    $embed_code = wp_kses_post( $_POST['action_network_embed_code'] );
    update_post_meta( $post_id, '_action_network_embed_code', $embed_code );
    
    // Migrate from ACF if ACF field has data
    if ( function_exists( 'get_field' ) && empty( $embed_code ) ) {
        $acf_embed = get_field( 'action_embed_code', $post_id );
        if ( ! empty( $acf_embed ) ) {
            update_post_meta( $post_id, '_action_network_embed_code', $acf_embed );
        }
    }
} else {
    delete_post_meta( $post_id, '_action_network_embed_code' );
}
```

**Remove the manual event ID saving logic (lines 473-490)** since we now get it from embed code.

### Step 4: Update Shortcode to Use New Field

**File:** `functions.php`
**Function:** `houseyou_action_network_embed_shortcode` (lines 923-939)

**Change:**
```php
// FROM:
$embed_code = get_field( 'action_embed_code' );

// TO:
$embed_code = get_post_meta( get_the_ID(), '_action_network_embed_code', true );
// Fallback to ACF field for backwards compatibility
if ( empty( $embed_code ) && function_exists( 'get_field' ) ) {
    $embed_code = get_field( 'action_embed_code' );
}
```

### Step 5: Remove ACF Field Group Registration

**File:** `functions.php`
**Lines:** 944-1016

**Delete the entire `houseyou_register_acf_fields` function and its `add_action` hook:**
```php
// DELETE THIS ENTIRE BLOCK:
function houseyou_register_acf_fields() {
    // ... entire function ...
}
add_action( 'acf/init', 'houseyou_register_acf_fields' );
```

### Step 6: Update API Helper Function

**File:** `inc/action-network-api.php`
**Function:** `houseyou_an_get_event_id_from_acf` (lines 129-144)

**Change:**
```php
// FROM:
function houseyou_an_get_event_id_from_acf( $post_id ) {
    if ( ! function_exists( 'get_field' ) ) {
        return false;
    }
    $embed_code = get_field( 'action_embed_code', $post_id );
    // ...
}

// TO:
function houseyou_an_get_event_id_from_embed( $post_id ) {
    // Try new post meta field first
    $embed_code = get_post_meta( $post_id, '_action_network_embed_code', true );
    
    // Fallback to ACF field for backwards compatibility
    if ( empty( $embed_code ) && function_exists( 'get_field' ) ) {
        $embed_code = get_field( 'action_embed_code', $post_id );
    }
    
    if ( empty( $embed_code ) ) {
        return false;
    }
    
    return houseyou_an_parse_event_id( $embed_code );
}
```

**Update function calls in `functions.php`:**
Search for `houseyou_an_get_event_id_from_acf` and replace with `houseyou_an_get_event_id_from_embed`.

---

## File Changes Summary

| File | Lines | Action |
|------|-------|--------|
| `functions.php` | 362-366 | Update template check to include `action` |
| `functions.php` | 383-422 | Replace with embed code textarea |
| `functions.php` | 473-490 | Replace with new save logic |
| `functions.php` | 923-939 | Update shortcode with fallback |
| `functions.php` | 944-1016 | Delete ACF field group registration |
| `inc/action-network-api.php` | 129-144 | Rename and update function |

---

## New Event Details Meta Box Structure

```
┌─────────────────────────────────────┐
│ Event Details                       │
├─────────────────────────────────────┤
│ Action Network Embed Code:          │
│ ┌─────────────────────────────────┐ │
│ │ <script src='https://actionnet… │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ Paste embed code, URL, or event ID  │
│                                     │
│ ✓ Event ID: abc123-def456-...       │
│ [🔄 Sync from Action Network]       │
│                                     │
│ Manual Entry (optional):            │
│ Event Date: [____________]          │
│ Start Time: [____________]          │
│ End Time:   [____________]          │
│ Location:   [____________]          │
└─────────────────────────────────────┘
```

---

## Backwards Compatibility

- Shortcode checks new post meta field first, falls back to ACF field
- Save function migrates ACF data to new field on first save
- Existing pages with ACF data will continue to work

---

## Testing Checklist

1. Create new page with `action` template - verify Event Details meta box appears in sidebar
2. Create new page with `an-events` template - verify Event Details meta box appears in sidebar
3. Paste embed code, verify event ID is auto-detected
4. Click "Sync from Action Network" - verify date/time populate
5. View page on frontend - verify embed displays correctly
6. Edit existing page with ACF data - verify it still works and data is migrated
