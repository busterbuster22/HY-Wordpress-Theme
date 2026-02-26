/**
 * Home Page Letter Action — Action Network form customisations
 *
 * Targets the "End the Tax Breaks and Fund Housing First" letter campaign
 * embedded on the home page only. An early-exit guard ensures nothing runs
 * on any other page (action template pages, etc.).
 *
 * Loaded conditionally via wp_enqueue_scripts only when is_front_page() is true.
 */
(function () {

	// Guard: only run on the page that contains the letter campaign embed.
	// This container is rendered by the Action Network widget script and is
	// unique to the home-2026 template.
	if ( ! document.querySelector( '#can-letter-area-end-the-tax-breaks-and-fund-housing-first' ) ) {
		return;
	}

	// -------------------------------------------------------------------------
	// Block 1 — Fix Housing Demographic dropdown
	// -------------------------------------------------------------------------

	var fixHousingDropdown = function () {
		var dropdown = document.querySelector( 'select#Housing-Demographic' );

		if ( dropdown && ! dropdown.dataset.fixed ) {
			dropdown.dataset.fixed = 'true';

			// Change first option to placeholder
			var firstOption = dropdown.options[0];
			if ( firstOption ) {
				firstOption.text     = 'Your housing situation';
				firstOption.value    = '';
				firstOption.disabled = true;
				firstOption.selected = true;
			}

			// Gray out when placeholder is selected
			dropdown.addEventListener( 'change', function () {
				this.style.color = this.value === '' ? '#999' : '#000';
			} );

			// Set initial colour
			if ( dropdown.value === '' ) {
				dropdown.style.color = '#999';
			}
		}
	};

	var checkForDropdown = setInterval( function () {
		if ( document.querySelector( 'select#Housing-Demographic' ) ) {
			fixHousingDropdown();
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForDropdown );
	}, 5000 );

	// -------------------------------------------------------------------------
	// Block 2 — Add placeholder to Year of Birth field
	// -------------------------------------------------------------------------

	var fixYearOfBirth = function () {
		var yobInput = document.querySelector( 'input#Year-of-Birth-YYYY' );

		if ( yobInput && ! yobInput.placeholder ) {
			yobInput.placeholder = 'Year of Birth (YYYY)';
		}
	};

	var checkForYOB = setInterval( function () {
		if ( document.querySelector( 'input#Year-of-Birth-YYYY' ) ) {
			fixYearOfBirth();
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForYOB );
	}, 5000 );

	// -------------------------------------------------------------------------
	// Block 3 — Inject Step 2 header and description above the letter view
	// -------------------------------------------------------------------------

	var addStep2Header = function () {
		var letterPage = document.querySelector( '#can_letter_one_col' );

		if ( letterPage && ! document.querySelector( '.step2-header' ) ) {
			// Create header
			var header       = document.createElement( 'h3' );
			header.className = 'step2-header';
			header.textContent = 'Step 2: Send a message to our politicians';
			header.style.cssText = 'font-size: 1.4em !important; text-transform: uppercase; font-weight: bold; color: white; text-shadow: 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.9); margin-bottom: 10px;';

			// Create description
			var description       = document.createElement( 'p' );
			description.className = 'step2-description';
			description.textContent = 'Tell Albanese (Prime Minister), Chalmers (Treasurer) and O\'Neil (Housing Minister) to stop pouring fuel on the (housing) dumpster fire, scrap the tax breaks supporting house hoarding, and start funding the solutions instead.';
			description.style.cssText = 'font-size: 25px; color: white; text-shadow: 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.9); padding: 3px 0; margin-bottom: 20px;';

			// Insert at the top of the letter page
			letterPage.insertBefore( description, letterPage.firstChild );
			letterPage.insertBefore( header, letterPage.firstChild );
		}
	};

	var observeForLetterPage = new MutationObserver( function () {
		var letterPage = document.querySelector( '#can_letter_one_col' );
		if ( letterPage && letterPage.offsetParent !== null ) {
			addStep2Header();
		}
	} );

	observeForLetterPage.observe( document.body, {
		childList:       true,
		subtree:         true,
		attributes:      true,
		attributeFilter: ['style', 'class'],
	} );

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', addStep2Header );
	} else {
		addStep2Header();
	}

	// -------------------------------------------------------------------------
	// Block 4 — Replace Action Network thank you page with custom content
	// -------------------------------------------------------------------------

	function showThankYouPage() {
		var embedForm = document.querySelector( '#can_embed_form' );

		if ( embedForm && embedForm.classList.contains( 'can_thank_you_wrap' ) ) {
			// Don't customise twice
			if ( embedForm.querySelector( '.final-step-confirmation' ) ) {
				return;
			}

			embedForm.innerHTML = '';

			embedForm.innerHTML = '\
				<div class="post-submission-message" style="display: block;">\
					<div class="form-section final-step-confirmation">\
						<h4>Step 3: Follow and share</h4>\
						<p class="emphasis-text">The government won\'t house everybody because we\'re right. They\'ll do it because we\'re organised.</p>\
						<p class="section-spacing"><strong>Next steps:</strong></p>\
						<ol class="next-steps-list">\
							<li>Share this petition with 3 people right now (text your bestie, call your folks, DM your mate)</li>\
							<li>Follow, engage &amp; share our content (shift the narrative, end house hoarding &amp; everybody gets a house!)</li>\
						</ol>\
						<div class="social-links-container">\
							<p>\
								<a href="https://www.instagram.com/house_you__/?hl=en" target="_blank">\
									<img src="https://houseyou.org/wp-content/uploads/2025/11/hy-insta-scaled.png" alt="Follow House You on Instagram" class="social-icon" width="80">\
								</a>\
							</p>\
							<p>\
								<a href="https://www.facebook.com/p/House-You-61551436109729/" target="_blank">\
									<img src="https://houseyou.org/wp-content/uploads/2025/11/hy-fb2-scaled.png" alt="Like House You on Facebook" class="social-icon" width="80">\
								</a>\
							</p>\
						</div>\
					</div>\
				</div>';

			observeForThankYou.disconnect();
		}
	}

	var observeForThankYou = new MutationObserver( function () {
		if ( document.querySelector( '#can_embed_form.can_thank_you_wrap' ) ) {
			showThankYouPage();
		}
	} );

	observeForThankYou.observe( document.body, {
		childList:       true,
		subtree:         true,
		attributes:      true,
		attributeFilter: ['class'],
	} );

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', showThankYouPage );
	} else {
		showThankYouPage();
	}

	// -------------------------------------------------------------------------
	// Block 5 — Override submit button text to "Have Your Say"
	// -------------------------------------------------------------------------

	var observeSubmitButton = function () {
		var submitButton = document.querySelector( '#can_embed_form input[type="submit"]' );

		if ( submitButton ) {
			// Set initial text
			if ( submitButton.value === 'Start Writing' ) {
				submitButton.value = 'Have Your Say';
			}

			// Watch for Action Network changing it back via attribute
			var attrObserver = new MutationObserver( function () {
				if ( submitButton.value === 'Start Writing' ) {
					submitButton.value = 'Have Your Say';
				}
			} );

			attrObserver.observe( submitButton, {
				attributes:      true,
				attributeFilter: ['value'],
			} );

			// Intercept JavaScript property setter so AN cannot revert via JS
			var originalValueSetter = Object.getOwnPropertyDescriptor( HTMLInputElement.prototype, 'value' ).set;
			Object.defineProperty( submitButton, 'value', {
				set: function ( newValue ) {
					originalValueSetter.call( this, newValue === 'Start Writing' ? 'Have Your Say' : newValue );
				},
				get: function () {
					return this.getAttribute( 'value' );
				},
			} );
		}
	};

	var checkForButton = setInterval( function () {
		if ( document.querySelector( '#can_embed_form input[type="submit"]' ) ) {
			clearInterval( checkForButton );
			observeSubmitButton();
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForButton );
	}, 5000 );

	// -------------------------------------------------------------------------
	// Block 6 — Step 1 header + privacy disclaimer (injected after DOM ready)
	// -------------------------------------------------------------------------

	document.addEventListener( 'DOMContentLoaded', function () {

		// Step 1 header — inserted before form fields
		var checkFormLoaded = setInterval( function () {
			var formCol1 = document.querySelector( '#can_embed_form form.new_delivery #form_col1' );

			if ( formCol1 && ! document.querySelector( '#step-1-header' ) ) {
				clearInterval( checkFormLoaded );

				var stepHeader     = document.createElement( 'div' );
				stepHeader.id      = 'step-1-header';
				stepHeader.innerHTML = '<h4 style="font-family: \'Inter\', sans-serif; font-size: 1.75em; text-transform: uppercase; font-weight: bold; color: #ffffff; margin-bottom: 20px; text-shadow: 0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.9);">Step 1: Join the movement</h4>';

				formCol1.parentNode.insertBefore( stepHeader, formCol1 );
			}
		}, 100 );

		// Privacy disclaimer — inserted after opt-in checkbox section
		var checkOptInLoaded = setInterval( function () {
			var optInSection = document.querySelector( '#can_embed_form form.new_delivery #d_sharing' );

			if ( optInSection && ! document.querySelector( '#privacy-disclaimer' ) ) {
				clearInterval( checkOptInLoaded );

				var disclaimer         = document.createElement( 'p' );
				disclaimer.id          = 'privacy-disclaimer';
				disclaimer.style.cssText = 'font-family: Inter, sans-serif; font-size: 14px; font-style: italic; color: #ffffff; margin-top: 15px; line-height: 1.4; text-shadow: 0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.9);';
				disclaimer.textContent   = '*Your name will be on the letter sent to our politicians. We won\'t ever share your demographic information with anyone. We just use this as statistical data to demonstrate how house hoarding affects everyone and that people of all generations and housing security are demanding change.';

				optInSection.parentNode.insertBefore( disclaimer, optInSection.nextSibling );
			}
		}, 100 );

		setTimeout( function () {
			clearInterval( checkFormLoaded );
			clearInterval( checkOptInLoaded );
		}, 5000 );

	} );

})();
