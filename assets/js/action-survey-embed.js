/**
 * Survey Template — Action Network form customisations
 *
 * Targets AN v6/survey widgets (form.new_response) embedded on pages using
 * the "survey" block template. Loaded conditionally via wp_enqueue_scripts
 * only when is_page_template('survey') is true.
 *
 * Applies the same structural and visual fixes as action-template-embed.js
 * but adapted for form.new_response (survey widget):
 *
 *   Block 1   — Force form_col1 full-width flex container with flex-wrap
 *   Block 1b  — Remove border from #can_embed_form wrapper
 *   Block 4   — Fix #d_sharing opt-in checkbox section
 *   Block 5   — Fix can_float bracket artefacts
 *   Block 9   — Convert Person #1/2/3 to floatlabel style
 *   Block 10  — Lay checkbox question + Yes on one row
 */
(function () {

	// -------------------------------------------------------------------------
	// Block 1 — Force form_col1 and form_col2 to full width via inline styles
	// -------------------------------------------------------------------------

	var fixFormColumns = function () {
		var col1 = document.querySelector( '#can_embed_form #form_col1' );
		var col2 = document.querySelector( '#can_embed_form #form_col2' );

		if ( col1 && ! col1.dataset.colFixed ) {
			col1.style.setProperty( 'width',            '100%',          'important' );
			col1.style.setProperty( 'float',            'none',          'important' );
			col1.style.setProperty( 'display',          'flex',          'important' );
			col1.style.setProperty( 'flex-wrap',        'wrap',          'important' );
			col1.style.setProperty( 'justify-content',  'space-between', 'important' );
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
		if ( document.querySelector( '#can_embed_form #form_col1' ) ) {
			fixFormColumns();
			clearInterval( checkForColumns );
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForColumns );
	}, 5000 );

	// -------------------------------------------------------------------------
	// Block 1b — Remove border from #can_embed_form wrapper
	// AN's stylesheet sets border: 1px solid #eaeaea which we need to override.
	// Also hide the h2 border-bottom inside the form.
	// -------------------------------------------------------------------------

	var fixFormWrapper = function () {
		var formWrapper = document.querySelector( '#can_embed_form' );
		if ( formWrapper ) {
			formWrapper.style.setProperty( 'border', 'none', 'important' );
		}

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
	// Block 4 — Fix #d_sharing: remove dotted border, add spacing above,
	//           restore label flex layout, fix checkbox absolute positioning.
	//
	// AN's CSS sets:
	//   - border-top: 1.25px dotted on #d_sharing
	//   - position: absolute on the checkbox inside the label (causes overlap)
	//   - font-size/font-weight !important on the label (overrides our CSS)
	// -------------------------------------------------------------------------

	var fixDSharing = function ( el ) {
		el.style.setProperty( 'border-top',  'none',  'important' );
		el.style.setProperty( 'margin-top',  '20px',  'important' );

		var ul = el.querySelector( 'ul' );
		if ( ul ) {
			ul.style.setProperty( 'list-style', 'none', 'important' );
			ul.style.setProperty( 'margin',     '0',    'important' );
			ul.style.setProperty( 'padding',    '0',    'important' );
		}

		var label = el.querySelector( 'label' );
		if ( label ) {
			label.style.setProperty( 'display',        'flex',    'important' );
			label.style.setProperty( 'flex-direction', 'row',     'important' );
			label.style.setProperty( 'align-items',    'center',  'important' );
			label.style.setProperty( 'gap',            '8px',     'important' );
			label.style.setProperty( 'font-size',      '20px',    'important' );
			label.style.setProperty( 'font-weight',    'bold',    'important' );
			label.style.setProperty( 'color',          '#000000', 'important' );
			label.style.setProperty( 'cursor',         'pointer', 'important' );

			// AN's CSS sets position:absolute on the checkbox inside the label,
			// taking it out of flex flow and overlapping the text.
			var checkbox = label.querySelector( 'input[type="checkbox"]' );
			if ( checkbox ) {
				checkbox.style.setProperty( 'position', 'static', 'important' );
				checkbox.style.setProperty( 'display',  'inline', 'important' );
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
	// -------------------------------------------------------------------------

	var fixCanFloat = function () {
		var form = document.getElementById( 'can_embed_form' );
		if ( form && form.classList.contains( 'can_float' ) && ! form.dataset.floatFixed ) {
			form.style.setProperty( 'display',    'block',       'important' );
			form.style.setProperty( 'background', 'transparent', 'important' );

			var style = document.createElement( 'style' );
			style.id  = 'hy-can-float-fix';
			style.textContent = '#can_embed_form.can_float::before, #can_embed_form.can_float::after { content: none !important; display: none !important; }';
			document.head.appendChild( style );

			form.dataset.floatFixed = 'true';
		}
	};

	var checkForCanFloat = setInterval( function () {
		if ( document.getElementById( 'can_embed_form' ) ) {
			fixCanFloat();
			clearInterval( checkForCanFloat );
		}
	}, 100 );

	setTimeout( function () {
		clearInterval( checkForCanFloat );
	}, 5000 );

	// -------------------------------------------------------------------------
	// Block 9 — Convert Person #1, #2, #3 inputs to floatlabel-wrapper style
	//
	// See Documentation/forms-embedded.md — "Retrofitting Custom AN Fields"
	// section for full explanation of this pattern.
	//
	// Key rules:
	// - setProperty('display','none','important') for inactive state — required
	//   because AN's CSS sets display:block !important on .floatlabel-label
	// - placeholder shows label text when field is empty/unfocused
	// - activate/deactivate mirrors exactly what AN's floatlabel JS does for
	//   core fields (First Name, Last Name etc.)
	// -------------------------------------------------------------------------

	var fixPersonFields = function () {
		[ 'Person-1', 'Person-2', 'Person-3' ].forEach( function ( id ) {
			var input = document.getElementById( id );
			if ( ! input || input.dataset.personFixed ) { return; }

			var li    = input.closest( 'li.control-group' );
			var label = li ? li.querySelector( 'label.control-label' ) : null;
			if ( ! label ) { return; }

			var labelText = label.textContent.trim();

			label.style.setProperty( 'display', 'none', 'important' );

			// On the survey page, Person fields sit at 48% width (two per row)
			// to match First Name / Last Name column width.
			if ( li ) {
				li.style.setProperty( 'flex',    '0 0 48%', 'important' );
				li.style.setProperty( 'width',   '48%',     'important' );
				li.style.setProperty( 'display', 'block',   'important' );
			}

			var wrapper = document.createElement( 'div' );
			wrapper.className = 'floatlabel-wrapper';

			var floatLabel = document.createElement( 'label' );
			floatLabel.setAttribute( 'for', id );
			floatLabel.className   = 'floatlabel-label';
			floatLabel.textContent = labelText;

			input.classList.add( 'floatlabel-input', 'floatlabel-input-slide' );
			input.placeholder = labelText;

			input.parentNode.insertBefore( wrapper, input );
			wrapper.appendChild( floatLabel );
			wrapper.appendChild( input );

			var activate = function () {
				floatLabel.classList.add( 'floatlabel-label-active' );
				floatLabel.style.setProperty( 'display', 'block', 'important' );
			};
			var deactivate = function () {
				floatLabel.classList.remove( 'floatlabel-label-active' );
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
	// Block 10 — Lay the "Will you talk to 3 people?" checkbox question and
	//            Yes checkbox on a single row (flex row instead of stacked).
	// -------------------------------------------------------------------------

	var fixCheckboxRow = function () {
		var li = document.querySelector( 'li.control-group.checkbox_group_wrap' );
		if ( ! li || li.dataset.checkboxFixed ) { return; }

		// Stacked: question text above, Yes checkbox below
		li.style.setProperty( 'flex',            '0 0 100%',   'important' );
		li.style.setProperty( 'width',           '100%',       'important' );
		li.style.setProperty( 'display',         'flex',       'important' );
		li.style.setProperty( 'flex-direction',  'column',     'important' );
		li.style.setProperty( 'align-items',     'flex-start', 'important' );
		li.style.setProperty( 'justify-content', 'flex-start', 'important' );
		li.style.setProperty( 'gap',             '8px',        'important' );

		var questionLabel = li.querySelector( 'label.check_radio_label' );
		if ( questionLabel ) {
			questionLabel.style.setProperty( 'margin-bottom', '0',      'important' );
			questionLabel.style.setProperty( 'white-space',   'normal', 'important' );
		}

		var controlsSpan = li.querySelector( 'span.controls.check_radio_field' );
		if ( controlsSpan ) {
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

	// -------------------------------------------------------------------------
	// Block 11 — Style the survey feedback page (#survey_questions)
	//
	// AN replaces the DOM when advancing survey pages. Uses MutationObserver
	// to detect when #survey_questions appears (page 2 of the survey flow).
	//
	//   - Hides the progress bar (single-stage survey — no useful progress)
	//   - Changes "Next Page" button text to "Complete"
	//   - Applies inline styles to textareas and the submit button in case the
	//     CSS hasn't re-applied after the DOM replacement
	// -------------------------------------------------------------------------

	var fixSurveyQuestionsPage = function () {
		var qList = document.getElementById( 'survey_questions' );
		if ( ! qList || qList.dataset.surveyFixed ) { return; }

		// Hide progress bar
		var progressWrap = document.getElementById( 'survey_progress_wrap' );
		if ( progressWrap ) {
			progressWrap.style.setProperty( 'display', 'none', 'important' );
		}

		// Change button text + apply pink button styling inline
		var submitBtn = document.querySelector( '#survey_questions_footer button[type="submit"]' );
		if ( submitBtn ) {
			submitBtn.textContent = 'Complete';
			submitBtn.style.setProperty( 'background-color',  '#CB1EAA',                    'important' );
			submitBtn.style.setProperty( 'color',             '#FFFFFF',                    'important' );
			submitBtn.style.setProperty( 'font-family',       'League Spartan, sans-serif', 'important' );
			submitBtn.style.setProperty( 'font-weight',       '700',                        'important' );
			submitBtn.style.setProperty( 'font-size',         '20px',                       'important' );
			submitBtn.style.setProperty( 'text-transform',    'uppercase',                  'important' );
			submitBtn.style.setProperty( 'border',            'none',                       'important' );
			submitBtn.style.setProperty( 'border-radius',     '11px',                       'important' );
			submitBtn.style.setProperty( 'padding',           '12px 32px',                  'important' );
			submitBtn.style.setProperty( 'box-shadow',        '10px 10px 2px 0 #2D2A2E',   'important' );
			submitBtn.style.setProperty( 'cursor',            'pointer',                    'important' );
			submitBtn.style.setProperty( 'display',           'block',                      'important' );
			submitBtn.style.setProperty( 'margin',            '20px auto 0 auto',           'important' );
			submitBtn.style.setProperty( 'line-height',       '1',                          'important' );
			submitBtn.style.setProperty( 'vertical-align',    'middle',                     'important' );
		}

		// Inline textarea styles (in case CSS hasn't applied to new DOM nodes)
		qList.querySelectorAll( 'textarea' ).forEach( function ( ta ) {
			ta.style.setProperty( 'border',       '2px solid #2D2A2E',        'important' );
			ta.style.setProperty( 'box-shadow',   '10px 10px 0px 0px #2D2A2E','important' );
			ta.style.setProperty( 'border-radius','10px',                      'important' );
			ta.style.setProperty( 'padding',      '12px 15px',                 'important' );
			ta.style.setProperty( 'width',        '100%',                      'important' );
			ta.style.setProperty( 'box-sizing',   'border-box',                'important' );
			ta.style.setProperty( 'min-height',   '100px',                     'important' );
		} );

		qList.dataset.surveyFixed = 'true';
	};

	// Run immediately (in case page starts on survey questions, e.g. logged-in user)
	fixSurveyQuestionsPage();

	// MutationObserver to catch Page 1 → Page 2 transition
	var surveyPageObserver = new MutationObserver( function () {
		if ( document.getElementById( 'survey_questions' ) ) {
			fixSurveyQuestionsPage();
		}
	} );

	surveyPageObserver.observe( document.body, { childList: true, subtree: true } );

	// -------------------------------------------------------------------------
	// Block 12 — Survey thank-you page
	//
	// Hides all AN share/social blocks (#can_thank_you-block, #action_info,
	// logo_wrap, the "Help us meet our goal" h4) and leaves only the
	// "Thanks for your support." h1. Uses a MutationObserver on #can_embed_form
	// gaining the can_thank_you_wrap class, plus an immediate check.
	// -------------------------------------------------------------------------

	function showSurveyThankYou() {
		var embedForm = document.querySelector( '#can_embed_form.can_thank_you_wrap' );
		if ( ! embedForm ) { return; }
		if ( embedForm.querySelector( '.hy-survey-done' ) ) { return; }

		// Hide all share/social blocks
		embedForm.querySelectorAll( '.can_thank_you-block' ).forEach( function ( el ) {
			el.style.setProperty( 'display', 'none', 'important' );
		} );

		// Hide the clearfix wrapper that contains the share blocks
		var clearfixWrap = embedForm.querySelector( '.clearfix' );
		if ( clearfixWrap ) {
			clearfixWrap.style.setProperty( 'display', 'none', 'important' );
		}

		// Hide "Help us meet our goal by spreading the word..." h4
		var thankYouDiv = embedForm.querySelector( '#can_thank_you' );
		if ( thankYouDiv ) {
			var h4 = thankYouDiv.querySelector( 'h4' );
			if ( h4 ) { h4.style.setProperty( 'display', 'none', 'important' ); }

			// Style the h1
			var h1 = thankYouDiv.querySelector( 'h1' );
			if ( h1 ) {
				h1.classList.add( 'hy-survey-done' );
				h1.style.setProperty( 'font-family',  'League Spartan, sans-serif', 'important' );
				h1.style.setProperty( 'font-size',    '32px',       'important' );
				h1.style.setProperty( 'font-weight',  '700',        'important' );
				h1.style.setProperty( 'color',        '#000000',    'important' );
				h1.style.setProperty( 'text-shadow',  'none',       'important' );
			}
		}

		// Hide Sponsored by / action_info
		var actionInfo = embedForm.querySelector( '#action_info' );
		if ( actionInfo ) { actionInfo.style.setProperty( 'display', 'none', 'important' ); }

		// Hide AN logo
		var logoWrap = embedForm.querySelector( '#logo_wrap' );
		if ( logoWrap ) { logoWrap.style.setProperty( 'display', 'none', 'important' ); }

		observeForSurveyThankYou.disconnect();
	}

	var observeForSurveyThankYou = new MutationObserver( function () {
		if ( document.querySelector( '#can_embed_form.can_thank_you_wrap' ) ) {
			showSurveyThankYou();
		}
	} );

	observeForSurveyThankYou.observe( document.body, {
		childList:       true,
		subtree:         true,
		attributes:      true,
		attributeFilter: ['class'],
	} );

	// Also run immediately in case AN already rendered the thank-you state
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', showSurveyThankYou );
	} else {
		showSurveyThankYou();
	}

})();
