/**
 * Action Template Letter Action — Action Network form customisations
 *
 * Targets Action Network letter campaign forms embedded on pages using
 * the "action" block template. Loaded conditionally via wp_enqueue_scripts
 * only when is_page_template('action') is true.
 *
 * Fixes handled here (layout fixes are in theme.css via .page-template-action):
 *   - Injects a privacy disclaimer paragraph below the opt-in checkbox section.
 */
(function () {

	// -------------------------------------------------------------------------
	// Inject privacy disclaimer below the opt-in checkbox (#d_sharing)
	// Mirrors Block 6 of home-letter-action.js but without home-specific styles.
	// -------------------------------------------------------------------------

	var checkOptInLoaded = setInterval( function () {
		var optInSection = document.querySelector( '#can_embed_form form.new_delivery #d_sharing' );

		if ( optInSection && ! document.querySelector( '#privacy-disclaimer' ) ) {
			clearInterval( checkOptInLoaded );

			var disclaimer         = document.createElement( 'p' );
			disclaimer.id          = 'privacy-disclaimer';
			disclaimer.style.cssText = 'font-family: Inter, sans-serif; font-size: 14px; font-style: italic; color: #333333; margin-top: 15px; line-height: 1.4;';
			disclaimer.textContent   = '*Your name will be on the letter sent to our politicians. We won\'t ever share your demographic information with anyone. We just use this as statistical data to demonstrate how house hoarding affects everyone and that people of all generations and housing security are demanding change.';

			optInSection.parentNode.insertBefore( disclaimer, optInSection.nextSibling );
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkOptInLoaded );
	}, 5000 );

})();
