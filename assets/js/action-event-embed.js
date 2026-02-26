/**
 * Action Network Event Embed — hide unwanted event detail elements
 *
 * Targets Action Network RSVP/event widgets embedded on pages using
 * the "AN Events" page template (an-events). Loaded conditionally via
 * wp_enqueue_scripts only when is_page_template('an-events') is true.
 */
(function () {

	// Force hide Action Network event details after form loads
	var hideEventDetails = setInterval( function () {
		var lastLine      = document.querySelector( '#can_embed_form .last_line' );
		var attendHeading = document.querySelector( '#can_embed_form_inner > h4' );

		if ( lastLine ) {
			lastLine.style.display    = 'none';
			lastLine.style.visibility = 'hidden';
			lastLine.style.height     = '0';
			lastLine.style.overflow   = 'hidden';
		}

		if ( attendHeading && attendHeading.textContent.includes( 'Attend this event' ) ) {
			attendHeading.style.display = 'none';
		}

		// Stop polling once both elements have been found and hidden
		if ( lastLine && attendHeading ) {
			clearInterval( hideEventDetails );
		}
	}, 100 );

	// Stop polling after 10 seconds regardless
	setTimeout( function () {
		clearInterval( hideEventDetails );
	}, 10000 );

})();
