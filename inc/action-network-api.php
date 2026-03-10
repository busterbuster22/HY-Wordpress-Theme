<?php
/**
 * Action Network API Client
 *
 * Handles communication with Action Network API v2
 *
 * @package House_You
 * @since House You 1.0
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get Action Network API Key
 *
 * @return string|false API key or false if not set
 */
function houseyou_an_get_api_key() {
	return get_option( 'houseyou_action_network_api_key' );
}

/**
 * Fetch a single event from Action Network API
 *
 * @param string $event_id Action Network event ID
 * @return array|WP_Error Event data array or WP_Error on failure
 */
function houseyou_an_get_event( $event_id ) {
	$api_key = houseyou_an_get_api_key();

	if ( empty( $api_key ) ) {
		return new WP_Error(
			'no_api_key',
			'Action Network API key not configured. Please add it in Settings → Action Network Sync.'
		);
	}

	// Clean the event ID (remove URL if full URL was provided)
	$event_id = houseyou_an_parse_event_id( $event_id );

	if ( empty( $event_id ) ) {
		return new WP_Error( 'invalid_event_id', 'Invalid Event ID provided.' );
	}

	$url = 'https://actionnetwork.org/api/v2/events/' . $event_id;

	$response = wp_remote_get( $url, array(
		'headers' => array(
			'OSDI-API-Token' => $api_key,
		),
		'timeout' => 15,
	) );

	if ( is_wp_error( $response ) ) {
		return new WP_Error(
			'api_request_failed',
			'Failed to connect to Action Network: ' . $response->get_error_message()
		);
	}

	$status_code = wp_remote_retrieve_response_code( $response );
	$body = wp_remote_retrieve_body( $response );

	if ( $status_code === 404 ) {
		return new WP_Error( 'event_not_found', 'Event not found on Action Network.' );
	}

	if ( $status_code === 401 ) {
		return new WP_Error( 'invalid_api_key', 'Invalid API key. Please check your settings.' );
	}

	if ( $status_code !== 200 ) {
		return new WP_Error(
			'api_error',
			sprintf( 'Action Network API returned error code: %d', $status_code )
		);
	}

	$data = json_decode( $body, true );

	if ( json_last_error() !== JSON_ERROR_NONE ) {
		return new WP_Error( 'json_parse_error', 'Failed to parse API response.' );
	}

	return $data;
}

/**
 * Parse Event ID from URL or ID string
 *
 * Accepts:
 * - Full URL: https://actionnetwork.org/events/event-slug
 * - Embed script: <script src='https://actionnetwork.org/widgets/v3/event/event-slug?format=js'></script>
 * - Event ID: abc123-def456-ghi789
 *
 * @param string $input Event URL, embed code, or ID
 * @return string|false Event ID or false if invalid
 */
function houseyou_an_parse_event_id( $input ) {
	$input = trim( $input );

	// Try to extract from embed script tag (most common in ACF field)
	if ( preg_match( '#actionnetwork\.org/widgets/v[0-9]+/event/([a-zA-Z0-9\-]+)#', $input, $matches ) ) {
		return $matches[1];
	}

	// Try to extract from event URL
	if ( preg_match( '#actionnetwork\.org/(?:api/v2/)?events/([a-zA-Z0-9\-]+)#', $input, $matches ) ) {
		return $matches[1];
	}

	// If it looks like an ID (alphanumeric with hyphens), return it
	if ( preg_match( '/^[a-zA-Z0-9\-]+$/', $input ) ) {
		return $input;
	}

	return false;
}

/**
 * Get event ID from embed code stored in post meta
 *
 * @param int $post_id Post ID
 * @return string|false Event ID or false if not found
 */
function houseyou_an_get_event_id_from_embed( $post_id ) {
	$embed_code = get_post_meta( $post_id, 'action_embed_code', true );

	if ( empty( $embed_code ) ) {
		return false;
	}

	return houseyou_an_parse_event_id( $embed_code );
}

/**
 * Parse Action Network date/time to WordPress format
 *
 * Action Network uses ISO 8601 format with local timezone
 * Example: "2025-02-15T18:00:00Z"
 *
 * @param string $datetime ISO 8601 datetime string
 * @param string $format 'date' or 'time'
 * @return string|false Formatted date/time or false on error
 */
function houseyou_an_parse_datetime( $datetime, $format = 'date' ) {
	if ( empty( $datetime ) ) {
		return false;
	}

	try {
		// Get WordPress timezone
		$wp_timezone = wp_timezone();

		// Parse the datetime string
		$dt = new DateTime( $datetime, new DateTimeZone( 'UTC' ) );

		// Convert to WordPress timezone
		$dt->setTimezone( $wp_timezone );

		// Return in appropriate format
		if ( $format === 'date' ) {
			return $dt->format( 'Y-m-d' ); // MySQL date format
		} elseif ( $format === 'time' ) {
			return $dt->format( 'H:i' ); // 24-hour time format
		} else {
			return $dt->format( 'Y-m-d H:i:s' ); // Full datetime
		}
	} catch ( Exception $e ) {
		return false;
	}
}

/**
 * Transform Action Network event data to WordPress meta format
 *
 * @param array $an_event Action Network event data
 * @return array WordPress meta data array
 */
function houseyou_an_transform_event_data( $an_event ) {
	$meta = array();

	// Extract date from start_date
	if ( ! empty( $an_event['start_date'] ) ) {
		$meta['_event_date'] = houseyou_an_parse_datetime( $an_event['start_date'], 'date' );
		$meta['_event_time'] = houseyou_an_parse_datetime( $an_event['start_date'], 'time' );
	}

	// Extract end time from end_date
	if ( ! empty( $an_event['end_date'] ) ) {
		$meta['_event_end_time'] = houseyou_an_parse_datetime( $an_event['end_date'], 'time' );
	}

	// Extract location
	if ( ! empty( $an_event['location']['venue'] ) ) {
		$meta['_event_location'] = sanitize_text_field( $an_event['location']['venue'] );

		// Optionally append locality (city)
		if ( ! empty( $an_event['location']['locality'] ) ) {
			$meta['_event_location'] .= ', ' . sanitize_text_field( $an_event['location']['locality'] );
		}
	}

	return $meta;
}

/**
 * Sync a WordPress page with Action Network event data
 *
 * @param int $post_id WordPress post ID
 * @param string $event_id Action Network event ID
 * @return true|WP_Error True on success, WP_Error on failure
 */
function houseyou_an_sync_event( $post_id, $event_id = null ) {
	// Get event ID from parameter or post meta
	if ( empty( $event_id ) ) {
		$event_id = get_post_meta( $post_id, '_action_network_event_id', true );
	}

	if ( empty( $event_id ) ) {
		return new WP_Error( 'no_event_id', 'No Action Network Event ID specified.' );
	}

	// Fetch event from API
	$an_event = houseyou_an_get_event( $event_id );

	if ( is_wp_error( $an_event ) ) {
		return $an_event;
	}

	// Transform data to WordPress format
	$meta_data = houseyou_an_transform_event_data( $an_event );

	// Update post meta
	foreach ( $meta_data as $key => $value ) {
		if ( ! empty( $value ) ) {
			update_post_meta( $post_id, $key, $value );
		}
	}

	// Store sync timestamp
	update_post_meta( $post_id, '_last_synced_at', current_time( 'mysql' ) );

	// Store the event ID if it wasn't already stored
	update_post_meta( $post_id, '_action_network_event_id', houseyou_an_parse_event_id( $event_id ) );

	return true;
}
