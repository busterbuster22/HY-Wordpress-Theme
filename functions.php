<?php declare( strict_types = 1 ); ?>
<?php
/**
 * House You functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package House_You
 * @since House You 1.0
 */

// Load Action Network API client
require_once get_template_directory() . '/inc/action-network-api.php';

/**
 * Add class to body if post/page has a featured image.
 */
function houseyou_add_featured_image_class( $classes ) {
 global $post;
 if ( isset( $post->ID ) && get_the_post_thumbnail( $post->ID ) ) {
 	$classes[] = 'has-featured-image';
 }
 return $classes;
}
add_filter( 'body_class', 'houseyou_add_featured_image_class' );

if ( ! function_exists( 'houseyou_support' ) ) :

 /**
  * Sets up theme defaults and registers support for various WordPress features.
  *
  * @since House You 1.0
  *
  * @return void
  */
 function houseyou_support() {
		// Make theme available for translation.
		load_theme_textdomain( 'house-you' );

		// Add support for block styles.
		add_theme_support( 'wp-block-styles' );

		// Add support for featured images (post thumbnails).
		add_theme_support( 'post-thumbnails' );

		// Enqueue editor styles.
		add_editor_style( array(
			'style.css',
			'assets/theme.css'
		) );

	}

endif;

add_action( 'after_setup_theme', 'houseyou_support' );

if ( ! function_exists( 'houseyou_styles' ) ) :

	/**
	 * Enqueue styles.
	 *
	 * @since House You 1.0
	 *
	 * @return void
	 */
	function houseyou_styles() {

		// Enqueue main stylesheet (contains custom CSS).
		wp_enqueue_style(
			'house-you-main-style',
			get_stylesheet_uri(),
			array(),
			wp_get_theme()->get( 'Version' )
		);

		// Register theme stylesheet.
		wp_register_style(
			'house-you-style',
			get_template_directory_uri() . '/assets/theme.css',
			array( 'house-you-main-style' ),
			wp_get_theme()->get( 'Version' )
		);

		// Add styles inline.
		wp_add_inline_style( 'house-you-style', houseyou_get_font_face_styles() );

		// Enqueue theme stylesheet.
		wp_enqueue_style( 'house-you-style' );

	}

endif;

add_action( 'wp_enqueue_scripts', 'houseyou_styles' );

if ( ! function_exists( 'houseyou_editor_styles' ) ) :

	/**
	 * Enqueue editor styles.
	 *
	 * @since House You 1.0
	 *
	 * @return void
	 */
	function houseyou_editor_styles() {

		// Add styles inline.
		wp_add_inline_style( 'wp-block-library', houseyou_get_font_face_styles() );

	}

endif;

add_action( 'admin_init', 'houseyou_editor_styles' );


if ( ! function_exists( 'houseyou_get_font_face_styles' ) ) :

	/**
	 * Get font face styles.
	 * Called by functions houseyou_styles() and houseyou_editor_styles() above.
	 *
	 * @since House You 1.0
	 *
	 * @return string
	 */
	function houseyou_get_font_face_styles() {

		return "
		@font-face{
			font-family: 'Red Hat Display';
			font-weight: 400;
			font-style: normal;
			font-stretch: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/red-hat-display-regular.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'Red Hat Display';
			font-weight: 500;
			font-style: normal;
			font-stretch: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/red-hat-display-500.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'Red Hat Display';
			font-weight: 700;
			font-style: normal;
			font-stretch: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/red-hat-display-700.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'Red Hat Display';
			font-weight: 900;
			font-style: normal;
			font-stretch: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/red-hat-display-900.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'Red Hat Display';
			font-weight: 400;
			font-style: italic;
			font-stretch: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/red-hat-display-italic.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'Red Hat Display';
			font-weight: 500;
			font-style: italic;
			font-stretch: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/red-hat-display-500italic.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'Red Hat Display';
			font-weight: 700;
			font-style: italic;
			font-stretch: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/red-hat-display-700italic.woff2' ) . "') format('woff2');
		}
		@font-face{
			font-family: 'Red Hat Display';
			font-weight: 900;
			font-style: italic;
			font-stretch: normal;
			font-display: swap;
			src: url('" . get_theme_file_uri( 'assets/fonts/red-hat-display-900italic.woff2' ) . "') format('woff2');
		}
		";

	}

endif;

if ( ! function_exists( 'houseyou_preload_webfonts' ) ) :

	/**
	 * Preloads the main web font to improve performance.
	 *
	 * Only the main web font (font-weight: 400,700, font-style: normal) is preloaded here since that font is always relevant.
	 * The other fonts are only needed if the user changed style or weight of the fonts,
	 * and therefore preloading it would in most cases regress performance when that font would otherwise not be loaded
	 * at all.
	 *
	 * @since House You 1.0
	 *
	 * @return void
	 */
	function houseyou_preload_webfonts() {
		?>
		<link rel="preload" href="<?php echo esc_url( get_theme_file_uri( 'assets/fonts/red-hat-display-regular.woff2' ) ); ?>" as="font" type="font/woff2" crossorigin>
		<link rel="preload" href="<?php echo esc_url( get_theme_file_uri( 'assets/fonts/red-hat-display-700.woff2' ) ); ?>" as="font" type="font/woff2" crossorigin>
		<?php
	}

endif;

add_action( 'wp_head', 'houseyou_preload_webfonts' );

/**
 * Registers block patterns and categories.
 *
 * @since House You 1.0
 *
 * @return void
 */
function houseyou_register_block_pattern_categories() {

	//Needed until https://github.com/WordPress/gutenberg/issues/39500 is fixed.
	$block_pattern_categories = array(
		'featured' => array( 'label' => __( 'Featured', 'house-you' ) ),
		'columns'  => array( 'label' => __( 'Columns', 'house-you' ) ),
		'images'   => array( 'label' => __( 'Images', 'house-you' ) ),
		'text'     => array( 'label' => __( 'Text', 'house-you' ) ),
		'query'    => array( 'label' => __( 'Query', 'house-you' ) ),
	);

	/**
	 * Filters the theme block pattern categories.
	 *
	 * @since House You 1.0
	 *
	 * @param array[] $block_pattern_categories {
	 *     An associative array of block pattern categories, keyed by category name.
	 *
	 *     @type array[] $properties {
	 *         An array of block category properties.
	 *
	 *         @type string $label A human-readable label for the pattern category.
	 *     }
	 * }
	 */
	$block_pattern_categories = apply_filters( 'house_you_block_pattern_categories', $block_pattern_categories );

	foreach ( $block_pattern_categories as $name => $properties ) {
		if ( ! WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( $name ) ) {
			register_block_pattern_category( $name, $properties );
		}
	}

}
add_action( 'init', 'houseyou_register_block_pattern_categories', 9 );

/**
 * Event Date/Time/Location Meta Boxes
 *
 * Adds custom fields for event information
 */
function houseyou_event_meta_boxes() {
	add_meta_box(
		'houseyou_event_details',
		'Event Details',
		'houseyou_event_details_callback',
		'page',
		'side',
		'high'
	);
}
add_action( 'add_meta_boxes', 'houseyou_event_meta_boxes' );

/**
 * Event Details Meta Box Callback
 */
function houseyou_event_details_callback( $post ) {
	// Only show for AN Events template
	$template = get_post_meta( $post->ID, '_wp_page_template', true );
	if ( $template !== 'an-events' && $template !== '' ) {
		echo '<p>Event details only available for pages using the "AN Events" template.</p>';
		return;
	}

	wp_nonce_field( 'houseyou_event_details', 'houseyou_event_details_nonce' );

	// Try to get event ID from ACF embed code first
	$acf_event_id = function_exists( 'get_field' ) ? houseyou_an_get_event_id_from_acf( $post->ID ) : false;
	$manual_event_id = get_post_meta( $post->ID, '_action_network_event_id', true );

	// Use ACF event ID if available, otherwise use manual
	$event_id = ! empty( $acf_event_id ) ? $acf_event_id : $manual_event_id;

	$last_synced = get_post_meta( $post->ID, '_last_synced_at', true );
	$event_date = get_post_meta( $post->ID, '_event_date', true );
	$event_time = get_post_meta( $post->ID, '_event_time', true );
	$event_end_time = get_post_meta( $post->ID, '_event_end_time', true );
	$event_location = get_post_meta( $post->ID, '_event_location', true );

	?>
	<div style="background: #f0f0f1; padding: 12px; margin-bottom: 15px; border-radius: 4px;">
		<?php if ( ! empty( $acf_event_id ) ) : ?>
			<!-- Auto-detected from ACF embed code -->
			<p style="margin: 0 0 10px 0;">
				<strong>✓ Action Network Event Detected</strong><br>
				<code style="background: #fff; padding: 4px 8px; border-radius: 3px; font-size: 11px; display: inline-block; margin-top: 5px;"><?php echo esc_html( $acf_event_id ); ?></code>
				<small style="display: block; margin-top: 5px; color: #666;">
					Auto-detected from your Action Network embed code (ACF field)
				</small>
			</p>
		<?php else : ?>
			<!-- Manual entry fallback -->
			<p style="margin: 0 0 10px 0;">
				<label for="action_network_event_id"><strong>Action Network Event ID:</strong></label><br>
				<input type="text" id="action_network_event_id" name="action_network_event_id" value="<?php echo esc_attr( $manual_event_id ); ?>" placeholder="Event ID or URL" style="width: 100%; margin-top: 5px;">
				<small style="display: block; margin-top: 5px; color: #666;">
					💡 Or add Action Network embed code to auto-detect event ID
				</small>
			</p>
		<?php endif; ?>

		<?php if ( ! empty( $event_id ) ) : ?>
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
				💡 Add Action Network embed code or enter Event ID above to enable sync
			</p>
		<?php endif; ?>
	</div>

	<p style="margin-bottom: 5px; font-weight: 600; border-top: 1px solid #ddd; padding-top: 12px;">
		Manual Entry (optional if using sync):
	</p>

	<p>
		<label for="event_date"><strong>Event Date:</strong></label><br>
		<input type="date" id="event_date" name="event_date" value="<?php echo esc_attr( $event_date ); ?>" style="width: 100%;">
	</p>

	<p>
		<label for="event_time"><strong>Start Time:</strong></label><br>
		<input type="time" id="event_time" name="event_time" value="<?php echo esc_attr( $event_time ); ?>" style="width: 100%;">
		<small style="display: block; margin-top: 5px; color: #666;">Optional - e.g., 18:00 for 6:00 PM</small>
	</p>

	<p>
		<label for="event_end_time"><strong>End Time:</strong></label><br>
		<input type="time" id="event_end_time" name="event_end_time" value="<?php echo esc_attr( $event_end_time ); ?>" style="width: 100%;">
		<small style="display: block; margin-top: 5px; color: #666;">Optional - e.g., 20:00 for 8:00 PM</small>
	</p>

	<p>
		<label for="event_location"><strong>Event Location:</strong></label><br>
		<input type="text" id="event_location" name="event_location" value="<?php echo esc_attr( $event_location ); ?>" placeholder="e.g., Sydney Town Hall" style="width: 100%;">
		<small style="display: block; margin-top: 5px; color: #666;">Optional</small>
	</p>
	<?php
}

/**
 * Save Event Details
 */
function houseyou_save_event_details( $post_id ) {
	// Verify nonce
	if ( ! isset( $_POST['houseyou_event_details_nonce'] ) ||
	     ! wp_verify_nonce( $_POST['houseyou_event_details_nonce'], 'houseyou_event_details' ) ) {
		return;
	}

	// Check autosave
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Check permissions
	if ( ! current_user_can( 'edit_page', $post_id ) ) {
		return;
	}

	// Save Action Network Event ID (manual entry - only if ACF field is empty)
	$acf_event_id = function_exists( 'get_field' ) ? houseyou_an_get_event_id_from_acf( $post_id ) : false;

	if ( empty( $acf_event_id ) ) {
		// Only save manual entry if ACF doesn't have embed code
		if ( isset( $_POST['action_network_event_id'] ) ) {
			$an_event_id = sanitize_text_field( $_POST['action_network_event_id'] );
			if ( ! empty( $an_event_id ) ) {
				// Parse and clean the event ID
				$parsed_id = houseyou_an_parse_event_id( $an_event_id );
				if ( $parsed_id ) {
					update_post_meta( $post_id, '_action_network_event_id', $parsed_id );
				}
			}
		} else {
			delete_post_meta( $post_id, '_action_network_event_id' );
		}
	}

	// Save event date
	if ( isset( $_POST['event_date'] ) ) {
		update_post_meta( $post_id, '_event_date', sanitize_text_field( $_POST['event_date'] ) );
	} else {
		delete_post_meta( $post_id, '_event_date' );
	}

	// Save event time
	if ( isset( $_POST['event_time'] ) ) {
		update_post_meta( $post_id, '_event_time', sanitize_text_field( $_POST['event_time'] ) );
	} else {
		delete_post_meta( $post_id, '_event_time' );
	}

	// Save event end time
	if ( isset( $_POST['event_end_time'] ) ) {
		update_post_meta( $post_id, '_event_end_time', sanitize_text_field( $_POST['event_end_time'] ) );
	} else {
		delete_post_meta( $post_id, '_event_end_time' );
	}

	// Save event location
	if ( isset( $_POST['event_location'] ) ) {
		update_post_meta( $post_id, '_event_location', sanitize_text_field( $_POST['event_location'] ) );
	} else {
		delete_post_meta( $post_id, '_event_location' );
	}
}
add_action( 'save_post', 'houseyou_save_event_details' );

/**
 * Events Listing Shortcode
 *
 * Displays a grid of upcoming events using the AN Events template
 * Usage: [events_listing]
 */
function houseyou_events_listing_shortcode( $atts ) {
	$atts = shortcode_atts( array(
		'limit' => -1,
		'order' => 'DESC',
	), $atts );

	// Get today's date
	$today = current_time( 'Y-m-d' );

	// Query for pages using the AN Events template
	$query_args = array(
		'post_type'      => 'page',
		'meta_key'       => '_wp_page_template',
		'meta_value'     => 'an-events',
		'posts_per_page' => $atts['limit'],
		'post_status'    => 'publish',
		'orderby'        => 'meta_value',
		'order'          => 'ASC',
		'meta_query'     => array(
			'relation' => 'OR',
			array(
				'key'     => '_event_date',
				'value'   => $today,
				'compare' => '>=',
				'type'    => 'DATE',
			),
			array(
				'key'     => '_event_date',
				'compare' => 'NOT EXISTS',
			),
		),
	);

	$events = new WP_Query( $query_args );

	ob_start();
	?>

	<div class="full-width-homepage" style="background-color: var(--wp--preset--color--ash-grey); padding: 60px 0;">
		<div class="content-container">
			<h2 style="color: white; text-align: center; margin-bottom: 40px;">Upcoming Events</h2>

			<?php if ( $events->have_posts() ) : ?>
				<div class="events-grid">
					<?php while ( $events->have_posts() ) : $events->the_post();
						$event_date = get_post_meta( get_the_ID(), '_event_date', true );
						$event_time = get_post_meta( get_the_ID(), '_event_time', true );
						$event_end_time = get_post_meta( get_the_ID(), '_event_end_time', true );
						$event_location = get_post_meta( get_the_ID(), '_event_location', true );
					?>
						<a href="<?php the_permalink(); ?>" class="event-card-link">
							<div class="event-card <?php echo empty( $event_date ) ? 'no-date' : ''; ?>">
								<?php if ( has_post_thumbnail() ) : ?>
									<div class="event-image">
										<?php the_post_thumbnail( 'medium' ); ?>
									</div>
								<?php endif; ?>

								<?php if ( empty( $event_date ) ) : ?>
									<div class="event-warning">⚠ Date not set</div>
								<?php endif; ?>

								<h3 class="event-title">
									<?php the_title(); ?>
								</h3>

								<?php if ( ! empty( $event_date ) || ! empty( $event_time ) || ! empty( $event_location ) ) : ?>
									<div class="event-meta">
										<?php if ( ! empty( $event_date ) ) : ?>
													<div class="event-date">
														📅 <?php echo esc_html( date_i18n( 'F j, Y', strtotime( $event_date ) ) ); ?>
													</div>
												<?php endif; ?>
		
												<?php if ( ! empty( $event_time ) ) : ?>
													<div class="event-time">
														🕐 <?php
															echo esc_html( date_i18n( 'g:i A', strtotime( $event_time ) ) );
															if ( ! empty( $event_end_time ) ) {
																echo ' - ' . esc_html( date_i18n( 'g:i A', strtotime( $event_end_time ) ) );
															}
														?>
													</div>
												<?php endif; ?>

										<?php if ( ! empty( $event_location ) ) : ?>
											<div class="event-location">
												📍 <?php echo esc_html( $event_location ); ?>
											</div>
										<?php endif; ?>
									</div>
								<?php endif; ?>

								<?php if ( has_excerpt() ) : ?>
									<p class="event-excerpt">
										<?php echo wp_trim_words( get_the_excerpt(), 15 ); ?>
									</p>
								<?php endif; ?>
							</div>
						</a>
					<?php endwhile; ?>
				</div>
			<?php else : ?>
				<p style="color: white; text-align: center;">No upcoming events.</p>
			<?php endif;
			wp_reset_postdata(); ?>
		</div>
	</div>

	<?php
	return ob_get_clean();
}
add_shortcode( 'events_listing', 'houseyou_events_listing_shortcode' );

/**
 * Enqueue admin scripts for event sync
 */
function houseyou_enqueue_event_sync_scripts( $hook ) {
	global $post;

	// Only load on post edit screens
	if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ) ) ) {
		return;
	}

	// Only for pages
	if ( ! $post || $post->post_type !== 'page' ) {
		return;
	}

	// Enqueue the admin event sync script
	wp_enqueue_script(
		'houseyou-admin-event-sync',
		get_template_directory_uri() . '/assets/js/admin-event-sync.js',
		array( 'jquery' ),
		wp_get_theme()->get( 'Version' ),
		true
	);

	// Localize script with data needed for AJAX
	wp_localize_script(
		'houseyou-admin-event-sync',
		'houseyouEventSync',
		array(
			'postId' => intval( $post->ID ),
			'nonce'  => wp_create_nonce( 'houseyou_sync_event' ),
		)
	);
}
add_action( 'admin_enqueue_scripts', 'houseyou_enqueue_event_sync_scripts' );

/**
 * AJAX handler for event sync
 */
function houseyou_ajax_sync_event() {
	// Verify nonce
	check_ajax_referer( 'houseyou_sync_event', 'nonce' );

	// Check permissions
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_send_json_error( array( 'message' => 'Permission denied.' ) );
	}

	$post_id = intval( $_POST['post_id'] );
	$event_id = sanitize_text_field( $_POST['event_id'] );

	if ( empty( $post_id ) ) {
		wp_send_json_error( array( 'message' => 'Invalid post ID.' ) );
	}

	// Try to get event ID from ACF field first, fallback to provided event_id
	if ( empty( $event_id ) ) {
		$event_id = houseyou_an_get_event_id_from_acf( $post_id );
	}

	if ( empty( $event_id ) ) {
		wp_send_json_error( array( 'message' => 'No event ID found.' ) );
	}

	// Perform sync
	$result = houseyou_an_sync_event( $post_id, $event_id );

	if ( is_wp_error( $result ) ) {
		wp_send_json_error( array( 'message' => $result->get_error_message() ) );
	}

	// Get the synced data to return to JavaScript
	$response_data = array(
		'message' => 'Event synced successfully!',
		'date' => get_post_meta( $post_id, '_event_date', true ),
		'time' => get_post_meta( $post_id, '_event_time', true ),
		'end_time' => get_post_meta( $post_id, '_event_end_time', true ),
		'location' => get_post_meta( $post_id, '_event_location', true ),
	);

	wp_send_json_success( $response_data );
}
add_action( 'wp_ajax_houseyou_sync_event', 'houseyou_ajax_sync_event' );

/**
 * Add Action Network settings page
 */
function houseyou_an_add_settings_page() {
	add_options_page(
		'Action Network Sync',
		'Action Network Sync',
		'manage_options',
		'houseyou-action-network',
		'houseyou_an_settings_page'
	);
}
add_action( 'admin_menu', 'houseyou_an_add_settings_page' );

/**
 * Register settings
 */
function houseyou_an_register_settings() {
	register_setting( 'houseyou_an_settings', 'houseyou_action_network_api_key' );
}
add_action( 'admin_init', 'houseyou_an_register_settings' );

/**
 * Settings page HTML
 */
function houseyou_an_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// Save settings
	if ( isset( $_POST['houseyou_an_save'] ) && check_admin_referer( 'houseyou_an_settings' ) ) {
		$api_key = sanitize_text_field( $_POST['houseyou_action_network_api_key'] );
		update_option( 'houseyou_action_network_api_key', $api_key );
		echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
	}

	$api_key = get_option( 'houseyou_action_network_api_key' );
	?>
	<div class="wrap">
		<h1>Action Network Sync Settings</h1>

		<p>Configure the connection between WordPress and Action Network to automatically sync event details.</p>

		<form method="post" action="">
			<?php wp_nonce_field( 'houseyou_an_settings' ); ?>

			<table class="form-table">
				<tr>
					<th scope="row">
						<label for="houseyou_action_network_api_key">Action Network API Key</label>
					</th>
					<td>
						<input type="text"
							   id="houseyou_action_network_api_key"
							   name="houseyou_action_network_api_key"
							   value="<?php echo esc_attr( $api_key ); ?>"
							   class="regular-text"
							   placeholder="your-api-key-here">
						<p class="description">
							<strong>How to get your API key:</strong><br>
							1. Become an Action Network partner (contact their support)<br>
							2. Your API key will be provided by Action Network<br>
							3. Keep this key secret - it provides full account access
						</p>
						<p class="description">
							<a href="https://actionnetwork.org/docs/v2" target="_blank">View API Documentation →</a>
						</p>
					</td>
				</tr>
			</table>

			<?php if ( ! empty( $api_key ) ) : ?>
				<div style="background: #d4edda; border-left: 4px solid #28a745; padding: 12px; margin: 20px 0;">
					<h3 style="margin-top: 0;">✓ API Key Configured</h3>
					<p>You can now sync events from Action Network:</p>
					<ol>
						<li>Edit or create a page using the "AN Events" template</li>
						<li>In the "Event Details" sidebar, enter an Action Network event ID or URL</li>
						<li>Click "Sync from Action Network"</li>
						<li>Date, time, and location will be automatically filled</li>
						<li>Save the page</li>
					</ol>
				</div>
			<?php else : ?>
				<div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0;">
					<h3 style="margin-top: 0;">⚠ API Key Required</h3>
					<p>Enter your Action Network API key above to enable event syncing.</p>
				</div>
			<?php endif; ?>

			<p class="submit">
				<input type="submit" name="houseyou_an_save" class="button button-primary" value="Save Settings">
			</p>
		</form>

		<hr>

		<h2>Testing Your Connection</h2>
		<p>To test if your API key is working:</p>
		<ol>
			<li>Go to Pages → Add New or edit an existing event page</li>
			<li>Select "AN Events" as the page template</li>
			<li>Enter a test event ID in the Event Details sidebar</li>
			<li>Click "Sync from Action Network"</li>
			<li>If successful, the date/time/location fields will populate automatically</li>
		</ol>

		<h2>Rate Limits</h2>
		<p><strong>Action Network allows:</strong></p>
		<ul>
			<li>Maximum 4 API calls per second (~14,400/hour)</li>
			<li>This is more than sufficient for syncing events</li>
			<li>Manual sync operations are safe and won't hit limits</li>
		</ul>

		<h2>Support</h2>
		<p>For issues with Action Network API access, contact Action Network support directly.</p>
	</div>
	<?php
}


/**
 * Register Custom Block Styles
 *
 * Provides one-click color scheme options for Group blocks
 */
function houseyou_register_block_styles() {

	// Dark Section (Black background, White text)
	// Register for both Group and Cover blocks
	register_block_style(
		'core/group',
		array(
			'name'  => 'dark-section',
			'label' => 'Dark Section',
		)
	);
	register_block_style(
		'core/cover',
		array(
			'name'  => 'dark-section',
			'label' => 'Dark Section',
		)
	);

	// Light Section (White background, Black text)
	register_block_style(
		'core/group',
		array(
			'name'  => 'light-section',
			'label' => 'Light Section',
		)
	);
	register_block_style(
		'core/cover',
		array(
			'name'  => 'light-section',
			'label' => 'Light Section',
		)
	);

	// Pink Section (House You Pink background, White text)
	register_block_style(
		'core/group',
		array(
			'name'  => 'pink-section',
			'label' => 'Pink Section',
		)
	);
	register_block_style(
		'core/cover',
		array(
			'name'  => 'pink-section',
			'label' => 'Pink Section',
		)
	);

	// Full Width Section (breaks out of container)
	register_block_style(
		'core/group',
		array(
			'name'  => 'full-width',
			'label' => 'Full Width',
		)
	);

}
add_action( 'init', 'houseyou_register_block_styles' );

/**
 * Action Network Embed Shortcode
 *
 * Displays Action Network embed code from ACF field
 * Usage: [action_network_embed]
 *
 * IMPORTANT: This replaces the Code Snippets JavaScript version.
 * The ACF field 'action_embed_code' now serves dual purpose:
 * 1. Displays the Action Network form via this shortcode
 * 2. Auto-detected by Event Details meta box for syncing event data
 */
function houseyou_action_network_embed_shortcode() {
	$embed_code = get_field( 'action_embed_code' );

	if ( empty( $embed_code ) ) {
		// Only show message in preview/editor context
		if ( is_user_logged_in() && current_user_can( 'edit_posts' ) ) {
			return '<div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
				<strong>⚠ Action Network Embed Missing</strong><br>
				<small>Add Action Network embed code to the ACF field to display the form here.</small>
			</div>';
		}
		return '';
	}

	return $embed_code;
}
add_shortcode( 'action_network_embed', 'houseyou_action_network_embed_shortcode' );

// Allow ACF shortcodes in block themes (required for FSE)
add_filter( 'acf/shortcode/allow_in_block_themes_outside_content', '__return_true' );
