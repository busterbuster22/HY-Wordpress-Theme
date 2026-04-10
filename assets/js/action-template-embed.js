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
			col1.style.setProperty( 'width',     '100%', 'important' );
			col1.style.setProperty( 'float',     'none', 'important' );
			col1.style.setProperty( 'display',   'flex', 'important' );
			col1.style.setProperty( 'flex-wrap', 'wrap', 'important' );
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
	// Block 1b — Remove border from #can_embed_form wrapper (form.new_answer)
	// AN's stylesheet sets border: 1px solid #eaeaea which we need to override.
	// Also hide the h2 border-bottom inside the form.
	// -------------------------------------------------------------------------

	var fixFormWrapper = function () {
		var formWrapper = document.querySelector( '#can_embed_form' );
		if ( formWrapper ) {
			formWrapper.style.setProperty( 'border', 'none', 'important' );
		}

		// Hide the h2 border (AN sets border-bottom: 3px solid #e0e0e0)
		// The h2 sits directly inside #can_embed_form_inner, NOT inside form.new_answer
		var formH2 = document.querySelector( '#can_embed_form h2' );
		if ( formH2 ) {
			formH2.style.setProperty( 'border-bottom', 'none', 'important' );
		}
	};

	var checkForWrapper = setInterval( function () {
		if ( document.querySelector( '#can_embed_form' ) ) {
			fixFormWrapper();
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForWrapper );
	}, 5000 );

	// -------------------------------------------------------------------------
	// Block 2 — Add placeholder to Year of Birth field
	// Mirrors Block 2 of home-letter-action.js.
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
	// Block 3 — Inject privacy disclaimer below the opt-in checkbox (#d_sharing)
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

	// -------------------------------------------------------------------------
	// Block 4 — Fix #d_sharing: remove AN's dotted border-top and restore label
	//           styling (font-size, font-weight, flex layout, list-style).
	//
	// AN's injected <style> tags override our stylesheet rules even with
	// !important when AN's sheet loads later. setProperty('…','important') on
	// inline styles is the only reliable override mechanism.
	// -------------------------------------------------------------------------

	var fixDSharing = function ( el ) {
		// Remove dotted separator line injected by AN
		el.style.setProperty( 'border-top',  'none',  'important' );
		// Space between the submit button above and the opt-in label below
		el.style.setProperty( 'margin-top',  '20px',  'important' );

		// Restore UL list-style (AN re-adds bullets)
		var ul = el.querySelector( 'ul' );
		if ( ul ) {
			ul.style.setProperty( 'list-style', 'none', 'important' );
			ul.style.setProperty( 'margin',     '0',    'important' );
			ul.style.setProperty( 'padding',    '0',    'important' );
		}

		// Restore label layout and typography
		var label = el.querySelector( 'label' );
		if ( label ) {
			label.style.setProperty( 'display',         'flex',         'important' );
			label.style.setProperty( 'flex-direction',  'row',          'important' );
			label.style.setProperty( 'align-items',     'center',       'important' );
			label.style.setProperty( 'gap',             '8px',          'important' );
			label.style.setProperty( 'font-size',       '20px',         'important' );
			label.style.setProperty( 'font-weight',     'bold',         'important' );
			label.style.setProperty( 'color',           '#000000',      'important' );
			label.style.setProperty( 'cursor',          'pointer',      'important' );

			// AN's CSS sets position:absolute on the checkbox inside the label,
			// taking it out of flex flow and overlapping the text.
			var checkbox = label.querySelector( 'input[type="checkbox"]' );
			if ( checkbox ) {
				checkbox.style.setProperty( 'position', 'static',  'important' );
				checkbox.style.setProperty( 'display',  'inline',  'important' );
			}
		}

		el.dataset.dSharingFixed = 'true';
	};

	var checkForDSharing = setInterval( function () {
		var dSharing = document.getElementById( 'd_sharing' );
		if ( dSharing && ! dSharing.dataset.dSharingFixed ) {
			fixDSharing( dSharing );
			clearInterval( checkForDSharing );
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForDSharing );
	}, 5000 );

	// -------------------------------------------------------------------------
	// Block 5 — Fix #can_embed_form.can_float bracket artefacts
	//
	// AN adds class="can_float" to #can_embed_form itself. AN's stylesheet then
	// sets display:inline and ::before / ::after content that renders as pink
	// bracket characters at the top and bottom of the form.
	//
	// Inline setProperty handles display. A <style> injection is required for
	// ::before / ::after because pseudo-elements cannot be styled via
	// element.style directly.
	// -------------------------------------------------------------------------

	var fixCanFloat = function () {
		var form = document.getElementById( 'can_embed_form' );
		if ( form && form.classList.contains( 'can_float' ) && ! form.dataset.floatFixed ) {
			// Fix display (AN sets inline via .can_float stylesheet rule)
			form.style.setProperty( 'display', 'block', 'important' );
			form.style.setProperty( 'background', 'transparent', 'important' );

			// Inject a <style> to suppress ::before / ::after bracket characters
			var style = document.createElement( 'style' );
			style.id  = 'hy-can-float-fix';
			style.textContent = '#can_embed_form.can_float::before, #can_embed_form.can_float::after { content: none !important; display: none !important; }';
			document.head.appendChild( style );

			form.dataset.floatFixed = 'true';
		}
	};

	var checkForCanFloat = setInterval( function () {
		var form = document.getElementById( 'can_embed_form' );
		if ( form ) {
			fixCanFloat();
			clearInterval( checkForCanFloat );
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForCanFloat );
	}, 5000 );

	// -------------------------------------------------------------------------
	// Block 6 — Force letter form field and button styles via inline setProperty
	//
	// AN injects its own stylesheet after WordPress's, overriding theme.css rules
	// even with !important (same-specificity, later-wins). setProperty('…','important')
	// on inline styles is the only reliable mechanism to win.
	//
	// AN's widget script re-renders #can_letter_one_col after page load,
	// replacing the pre-rendered node and wiping any inline styles we set
	// on the first tick. We therefore keep the interval running for its full
	// duration (no clearInterval on first find) so styles are re-applied
	// after AN's render settles. The dataset guard is removed for the same reason.
	// -------------------------------------------------------------------------

	var fixLetterFormStyles = function () {
		var letterCol = document.querySelector( '#can_letter_one_col' );
		if ( ! letterCol ) {
			return;
		}

		// --- Text inputs (subject field) ---
		var inputs = letterCol.querySelectorAll( 'input[type="text"], input[type="email"]' );
		inputs.forEach( function ( el ) {
			el.style.setProperty( 'font-family',   'Inter, sans-serif',        'important' );
			el.style.setProperty( 'font-size',     '18px',                     'important' );
			el.style.setProperty( 'height',        '52px',                     'important' );
			el.style.setProperty( 'padding',       '12px 15px',                'important' );
			el.style.setProperty( 'border-radius', '10px',                     'important' );
			el.style.setProperty( 'border',        '1px solid #000000',        'important' );
			el.style.setProperty( 'background',    '#FFFFFF',                  'important' );
			el.style.setProperty( 'color',         '#000000',                  'important' );
			el.style.setProperty( 'box-shadow',    '10px 10px 2px 0 #2D2A2E', 'important' );
			el.style.setProperty( 'margin-bottom', '20px',                     'important' );
			el.style.setProperty( 'width',         '100%',                     'important' );
			el.style.setProperty( 'display',       'block',                    'important' );
			el.style.setProperty( 'box-sizing',    'border-box',               'important' );
		} );

		// --- Message textarea ---
		var textarea = letterCol.querySelector( 'textarea' );
		if ( textarea ) {
			textarea.style.setProperty( 'font-family',   'Inter, sans-serif',        'important' );
			textarea.style.setProperty( 'font-size',     '18px',                     'important' );
			textarea.style.setProperty( 'height',        'auto',                     'important' );
			textarea.style.setProperty( 'min-height',    '300px',                    'important' );
			textarea.style.setProperty( 'padding',       '15px',                     'important' );
			textarea.style.setProperty( 'border-radius', '10px',                     'important' );
			textarea.style.setProperty( 'border',        '1px solid #000000',        'important' );
			textarea.style.setProperty( 'background',    '#FFFFFF',                  'important' );
			textarea.style.setProperty( 'color',         '#000000',                  'important' );
			textarea.style.setProperty( 'box-shadow',    '10px 10px 2px 0 #2D2A2E', 'important' );
			textarea.style.setProperty( 'margin-bottom', '20px',                     'important' );
			textarea.style.setProperty( 'width',         '100%',                     'important' );
			textarea.style.setProperty( 'display',       'block',                    'important' );
			textarea.style.setProperty( 'box-sizing',    'border-box',               'important' );
		}

		// --- Submit button (pink House You style) ---
		var submit = letterCol.querySelector( 'input[type="submit"]' );
		if ( submit ) {
			submit.style.setProperty( 'background-color', '#CB1EAA',                    'important' );
			submit.style.setProperty( 'color',            '#FFFFFF',                    'important' );
			submit.style.setProperty( 'font-family',      'League Spartan, sans-serif', 'important' );
			submit.style.setProperty( 'font-weight',      'bold',                       'important' );
			submit.style.setProperty( 'font-size',        '20px',                       'important' );
			submit.style.setProperty( 'text-transform',   'uppercase',                  'important' );
			submit.style.setProperty( 'border',           'none',                       'important' );
			submit.style.setProperty( 'border-radius',    '11px',                       'important' );
			submit.style.setProperty( 'padding',          '12px 32px',                  'important' );
			submit.style.setProperty( 'box-shadow',       '10px 10px 2px 0 #2D2A2E',   'important' );
			submit.style.setProperty( 'cursor',           'pointer',                    'important' );
			submit.style.setProperty( 'display',          'block',                      'important' );
			submit.style.setProperty( 'margin',           '20px auto 0 auto',           'important' );
			submit.style.setProperty( 'width',            'auto',                       'important' );
		}

		// --- Floating labels (Your Letter Subject, Your Message) ---
		// Black text, no background, no text-shadow, positioned above the field.
		var labels = letterCol.querySelectorAll( '#form_col2 label.floatlabel-label' );
		labels.forEach( function ( el ) {
			el.style.setProperty( 'color',       '#000000',    'important' );
			el.style.setProperty( 'font-weight', 'bold',       'important' );
			el.style.setProperty( 'font-size',   '18px',       'important' );
			el.style.setProperty( 'text-shadow', 'none',       'important' );
			el.style.setProperty( 'background',  'transparent','important' );
			el.style.setProperty( 'position',    'relative',   'important' );
			el.style.setProperty( 'display',     'block',      'important' );
			el.style.setProperty( 'margin-bottom','4px',       'important' );
			el.style.setProperty( 'top',         'auto',       'important' );
			el.style.setProperty( 'left',        'auto',       'important' );
		} );

		// --- Welcome back text — black (overrides inherited white from theme.css) ---
		var welcomeDivs = letterCol.querySelectorAll(
			'#action_welcome_message_inner .left > div, #action_welcome_message_inner small'
		);
		welcomeDivs.forEach( function ( el ) {
			el.style.setProperty( 'color',       '#000000', 'important' );
			el.style.setProperty( 'text-shadow', 'none',    'important' );
		} );

	};

	// Initial burst — covers users who arrive at Stage 2 immediately (logged in).
	var checkForLetterForm = setInterval( function () {
		fixLetterFormStyles();
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForLetterForm );
	}, 5000 );

	// MutationObserver — covers Stage 1 → Stage 2 transition (when the user
	// submits the signup form and AN renders #can_letter_one_col into the DOM).
	// Runs a 3-second burst each time that element appears so AN's post-render
	// CSS injection is overridden reliably.
	var letterTransitionObserver = new MutationObserver( function () {
		if ( document.querySelector( '#can_letter_one_col' ) ) {
			var burstCount = 0;
			var burstInterval = setInterval( function () {
				fixLetterFormStyles();
				burstCount++;
				if ( burstCount >= 30 ) {
					clearInterval( burstInterval );
				}
			}, 100 );
		}
	} );

	letterTransitionObserver.observe( document.body, {
		childList: true,
		subtree:   true,
	} );

	// -------------------------------------------------------------------------
	// Block 7 — Force "Welcome back" text to black on the signup form (page 1)
	//
	// Block 6 targets #can_letter_one_col (page 2 only). The same welcome-back
	// section appears inside form.new_delivery on page 1, where it inherits
	// white from theme.css. Same keep-running approach as Block 6.
	// -------------------------------------------------------------------------

	var fixWelcomeBackPage1 = function () {
		var welcomeDivs = document.querySelectorAll(
			'#can_embed_form form.new_delivery #action_welcome_message_inner .left > div, ' +
			'#can_embed_form form.new_delivery #action_welcome_message_inner small'
		);

		welcomeDivs.forEach( function ( el ) {
			el.style.setProperty( 'color',       '#000000', 'important' );
			el.style.setProperty( 'text-shadow', 'none',    'important' );
		} );
	};

	var checkForWelcomePage1 = setInterval( function () {
		fixWelcomeBackPage1();
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForWelcomePage1 );
	}, 5000 );

	// -------------------------------------------------------------------------
	// Block 8 — Replace AN thank-you page (step 3) with custom HY content
	//
	// Mirrors Block 4 of home-letter-action.js. Watches for #can_embed_form
	// gaining class can_thank_you_wrap (either on initial load or after submit)
	// and replaces the default AN thank-you markup with the House You step 3
	// content: emphasis text, next-steps list, and social icon links.
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
				<div class="post-submission-message" style="display: block; background: none;">\
					<div class="form-section final-step-confirmation" style="background: none; color: #000000;">\
						<p class="emphasis-text" style="color: #000000; font-weight: bold; text-shadow: none;">The government won\'t house everybody because we\'re right. They\'ll do it because we\'re organised.</p>\
						<p class="section-spacing" style="color: #000000; text-shadow: none;"><strong>Next steps:</strong></p>\
						<ol class="next-steps-list" style="color: #000000; text-shadow: none;">\
							<li style="color: #000000;">Share this petition with 3 people right now (text your bestie, call your folks, DM your mate)</li>\
							<li style="color: #000000;">Follow, engage &amp; share our content (shift the narrative, end house hoarding &amp; everybody gets a house!)</li>\
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

			// Apply black text via setProperty to beat theme.css !important rules
			// that set color: #FFFFFF on .form-section p and li.
			var textEls = embedForm.querySelectorAll( 'p, li, strong, h4' );
			textEls.forEach( function ( el ) {
				el.style.setProperty( 'color',       '#000000', 'important' );
				el.style.setProperty( 'text-shadow', 'none',    'important' );
			} );

			observeForThankYouAction.disconnect();
		}
	}

	var observeForThankYouAction = new MutationObserver( function () {
		if ( document.querySelector( '#can_embed_form.can_thank_you_wrap' ) ) {
			showThankYouPage();
		}
	} );

	observeForThankYouAction.observe( document.body, {
		childList:       true,
		subtree:         true,
		attributes:      true,
		attributeFilter: ['class'],
	} );

	// Also run immediately in case AN already rendered the thank-you state
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', showThankYouPage );
	} else {
		showThankYouPage();
	}

	// -------------------------------------------------------------------------
	// Block 9 — Convert Person #1, #2, #3 inputs to floatlabel-wrapper style
	//
	// AN renders custom text fields (js-fb-textinput) with a <label class=
	// "control-label"> sitting above the input — outside the field border.
	// The core fields (First Name, Email etc.) use AN's floatlabel-wrapper
	// pattern which positions the label inside the border. This block rewraps
	// each Person input in that same structure so they visually match.
	//
	// Event listeners maintain the floatlabel-label-active class (which AN's
	// floatlabel JS would normally handle) so the label moves correctly on
	// focus / blur / input for inputs not initialised by AN's own script.
	// -------------------------------------------------------------------------

	var fixPersonFields = function () {
		[ 'Person-1', 'Person-2', 'Person-3' ].forEach( function ( id ) {
			var input = document.getElementById( id );
			if ( ! input || input.dataset.personFixed ) { return; }

			var li    = input.closest( 'li.control-group' );
			var label = li ? li.querySelector( 'label.control-label' ) : null;
			if ( ! label ) { return; }

			var labelText = label.textContent.trim();

			// Hide the original above-field label
			label.style.setProperty( 'display', 'none', 'important' );

			// Force each Person li to its own full row inside the flex form_col1
			if ( li ) {
				li.style.setProperty( 'flex',    '0 0 100%', 'important' );
				li.style.setProperty( 'width',   '100%',     'important' );
				li.style.setProperty( 'display', 'block',    'important' );
			}

			// Build the floatlabel-wrapper — identical structure to what AN uses for
			// core fields (First Name, Last Name etc.).
			var wrapper = document.createElement( 'div' );
			wrapper.className = 'floatlabel-wrapper';

			var floatLabel = document.createElement( 'label' );
			floatLabel.setAttribute( 'for', id );
			floatLabel.className   = 'floatlabel-label'; // no active class initially
			floatLabel.textContent = labelText;
			// No inline style — AN's CSS hides .floatlabel-label (no active) by default.

			// Placeholder shows when empty/unfocused, exactly like First Name/Last Name.
			input.classList.add( 'floatlabel-input', 'floatlabel-input-slide' );
			input.placeholder = labelText;

			// Insert wrapper in place of input, move both into it
			input.parentNode.insertBefore( wrapper, input );
			wrapper.appendChild( floatLabel );
			wrapper.appendChild( input );

			// Active   → add class + display:block (label floats to top-left border)
			// Inactive → remove class + display:none (hide label, placeholder shows)
			//
			// AN's CSS does NOT hide .floatlabel-label by default (it's always
			// display:block and overlays the input). We explicitly hide it in inactive
			// state so the placeholder attribute is the sole visual cue when empty.
			// AN's CSS handles all active-state positioning via .floatlabel-label-active
			// (top:-9px, left:9px, font-size:11px, z-index:99 …).
			var activate = function () {
				floatLabel.classList.add( 'floatlabel-label-active' );
				// setProperty 'important' required — AN's CSS sets display:block !important
				floatLabel.style.setProperty( 'display', 'block', 'important' );
			};
			var deactivate = function () {
				floatLabel.classList.remove( 'floatlabel-label-active' );
				// setProperty 'important' required — AN's CSS sets display:block !important
				// on .floatlabel-label; plain style.display='none' loses to it.
				floatLabel.style.setProperty( 'display', 'none', 'important' );
			};

			if ( input.value ) { activate(); } else { deactivate(); }

			input.addEventListener( 'focus', activate );
			input.addEventListener( 'blur',  function () { if ( ! input.value ) { deactivate(); } } );
			input.addEventListener( 'input', function () { if ( input.value ) { activate(); } else { deactivate(); } } );

			input.dataset.personFixed = 'true';
		} );
	};

	var checkForPersonFields = setInterval( function () {
		if ( document.getElementById( 'Person-1' ) ) {
			fixPersonFields();
			clearInterval( checkForPersonFields );
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForPersonFields );
	}, 5000 );

	// -------------------------------------------------------------------------
	// Block 10 — Lay the "Are you going to speak?" question and Yes! checkbox
	//            out on a single row (flex row instead of stacked block layout)
	//
	// AN renders li.control-group.checkbox_group_wrap with:
	//   <label class="control-label check_radio_label">question text</label>
	//   <span class="controls check_radio_field">…checkbox…</span>
	// Both children are block-level so they stack. We switch the li to
	// display:flex / flex-direction:row so question and checkbox sit side by side.
	// setProperty('…','important') is required — AN's stylesheet uses !important
	// on several display/layout properties inside .control-group.
	// -------------------------------------------------------------------------

	var fixCheckboxRow = function () {
		var li = document.querySelector( 'li.control-group.checkbox_group_wrap' );
		if ( ! li || li.dataset.checkboxFixed ) { return; }

		// Take a full row inside the parent flex container (form_col1)
		li.style.setProperty( 'flex',            '0 0 100%', 'important' );
		li.style.setProperty( 'width',           '100%',     'important' );
		// Then lay its own children (question label + checkbox span) in a row
		li.style.setProperty( 'display',         'flex',    'important' );
		li.style.setProperty( 'flex-direction',  'row',     'important' );
		li.style.setProperty( 'align-items',     'center',  'important' );
		li.style.setProperty( 'gap',             '16px',    'important' );
		li.style.setProperty( 'flex-wrap',       'nowrap',  'important' );

		var questionLabel = li.querySelector( 'label.check_radio_label' );
		if ( questionLabel ) {
			questionLabel.style.setProperty( 'margin-bottom', '0',      'important' );
			questionLabel.style.setProperty( 'flex-shrink',   '1',      'important' );
			questionLabel.style.setProperty( 'white-space',   'normal', 'important' );
		}

		var controlsSpan = li.querySelector( 'span.controls.check_radio_field' );
		if ( controlsSpan ) {
			controlsSpan.style.setProperty( 'flex-shrink', '0',      'important' );
			controlsSpan.style.setProperty( 'display',     'flex',   'important' );
			controlsSpan.style.setProperty( 'align-items', 'center', 'important' );
			controlsSpan.style.setProperty( 'float',       'none',   'important' );
		}

		li.dataset.checkboxFixed = 'true';
	};

	var checkForCheckboxRow = setInterval( function () {
		if ( document.querySelector( 'li.control-group.checkbox_group_wrap' ) ) {
			fixCheckboxRow();
			clearInterval( checkForCheckboxRow );
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForCheckboxRow );
	}, 5000 );

})();
