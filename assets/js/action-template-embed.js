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
	// Block 1 — Force form_col1 and form_col2 to full width via inline styles
	//
	// AN injects a <style> element after WordPress's stylesheets, meaning any
	// stylesheet rule (even !important) with equal specificity loses to AN's
	// later-loaded rule. Inline styles set via setProperty('…','important') are
	// the highest-priority mechanism in CSS and cannot be overridden by any
	// external or dynamically-injected stylesheet.
	// -------------------------------------------------------------------------

	var fixFormColumns = function () {
		var col1 = document.querySelector( '#can_embed_form #form_col1' );
		var col2 = document.querySelector( '#can_embed_form #form_col2' );

		if ( col1 && ! col1.dataset.colFixed ) {
			col1.style.setProperty( 'width',   '100%', 'important' );
			col1.style.setProperty( 'float',   'none', 'important' );
			col1.style.setProperty( 'display', 'flex', 'important' );
			col1.dataset.colFixed = 'true';
		}

		if ( col2 && ! col2.dataset.colFixed ) {
			col2.style.setProperty( 'width',   '100%',  'important' );
			col2.style.setProperty( 'float',   'none',  'important' );
			col2.style.setProperty( 'clear',   'both',  'important' );
			col2.dataset.colFixed = 'true';
		}
	};

	var checkForColumns = setInterval( function () {
		var col1 = document.querySelector( '#can_embed_form #form_col1' );
		if ( col1 ) {
			fixFormColumns();
			clearInterval( checkForColumns );
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForColumns );
	}, 5000 );

	// -------------------------------------------------------------------------
	// Block 2 — Inject privacy disclaimer below the opt-in checkbox (#d_sharing)
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
