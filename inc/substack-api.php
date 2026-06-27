<?php
/**
 * Substack RSS Feed Client
 *
 * Fetches and caches articles from a Substack publication RSS feed.
 * Uses SimpleXML (not fetch_feed/SimplePie) for compatibility with
 * Substack's RSS format.
 *
 * @package House_You
 * @since House You 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get the configured Substack feed URL.
 *
 * @return string
 */
function houseyou_substack_get_feed_url() {
	return get_option( 'houseyou_substack_feed_url', '' );
}

/**
 * Fetch and parse the raw RSS feed body.
 *
 * @param string $feed_url
 * @return string|WP_Error Raw XML body or WP_Error on failure.
 */
function houseyou_substack_fetch_raw( $feed_url ) {
	$response = wp_remote_get( $feed_url, array( 'timeout' => 15 ) );

	if ( is_wp_error( $response ) ) {
		return $response;
	}

	$code = wp_remote_retrieve_response_code( $response );
	if ( 200 !== $code ) {
		return new WP_Error( 'http_error', "Feed returned HTTP $code" );
	}

	$body = wp_remote_retrieve_body( $response );
	if ( empty( $body ) ) {
		return new WP_Error( 'empty_body', 'Feed body is empty' );
	}

	return $body;
}

/**
 * Parse an RSS <item> into an article array.
 *
 * @param SimpleXMLElement $item
 * @param string           $publication Feed title.
 * @param int              $excerpt_words
 * @return array
 */
function houseyou_substack_parse_item( $item, $publication, $excerpt_words ) {
	$dc     = $item->children( 'http://purl.org/dc/elements/1.1/' );
	$desc   = (string) $item->description;

	$article = array(
		'title'       => html_entity_decode( (string) $item->title, ENT_QUOTES | ENT_HTML5, 'UTF-8' ),
		'url'         => esc_url_raw( (string) $item->link ),
		'date'        => '',
		'timestamp'   => 0,
		'excerpt'     => '',
		'author'      => (string) $dc->creator,
		'image'       => '',
		'publication' => $publication,
	);

	// Date
	if ( ! empty( $item->pubDate ) ) {
		$ts = strtotime( (string) $item->pubDate );
		$article['timestamp'] = $ts;
		$article['date']      = $ts ? date_i18n( 'j M Y', $ts ) : '';
	}

	// Excerpt from <description>
	if ( ! empty( $desc ) ) {
		$plain = wp_strip_all_tags( $desc );
		$article['excerpt'] = wp_trim_words( $plain, $excerpt_words, '…' );
	}

	// Image from <enclosure>
	if ( ! empty( $item->enclosure['url'] ) ) {
		$article['image'] = (string) $item->enclosure['url'];
	}

	// Fallback: image from description HTML
	if ( empty( $article['image'] ) && ! empty( $desc ) ) {
		if ( preg_match( '/<img[^>]+src=["\']([^"\']+)["\']/', $desc, $m ) ) {
			$article['image'] = $m[1];
		}
	}

	return $article;
}

/**
 * Fetch articles from a Substack RSS feed.
 *
 * Cached via WordPress transients for 1 hour. Uses wp_remote_get +
 * SimpleXML (not SimplePie) for reliable Substack feed parsing.
 *
 * @param int $limit         Maximum articles to return.
 * @param int $excerpt_words Number of words for excerpt trimming.
 * @return array Array of article data.
 */
function houseyou_substack_fetch_articles( $limit = 12, $excerpt_words = 24 ) {
	$feed_url = houseyou_substack_get_feed_url();

	if ( empty( $feed_url ) ) {
		return array();
	}

	$cache_key = 'houseyou_substack_' . md5( $feed_url );
	$cached    = get_transient( $cache_key );

	if ( false !== $cached ) {
		return array_slice( $cached, 0, $limit );
	}

	$body = houseyou_substack_fetch_raw( $feed_url );

	if ( is_wp_error( $body ) ) {
		error_log( 'Substack fetch error: ' . $body->get_error_message() );
		return array();
	}

	libxml_use_internal_errors( true );
	$xml = simplexml_load_string( $body );

	if ( false === $xml || ! isset( $xml->channel ) ) {
		error_log( 'Substack parse error: invalid XML' );
		return array();
	}

	$publication = (string) $xml->channel->title;

	$articles = array();

	foreach ( $xml->channel->item as $item ) {
		$articles[] = houseyou_substack_parse_item( $item, $publication, $excerpt_words );
	}

	set_transient( $cache_key, $articles, HOUR_IN_SECONDS );

	error_log( 'Substack: fetched ' . count( $articles ) . ' articles from ' . $feed_url );

	return array_slice( $articles, 0, $limit );
}
