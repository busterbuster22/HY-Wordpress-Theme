/**
 * Volunteer Signup Form — Action Network form customisations
 *
 * Targets the "volunteer-form-22" Action Network v6/form widget
 * (form.new_answer) embedded on the home page via the [action_network_embed]
 * shortcode, rendered into #can-form-area-volunteer-form-22.
 *
 * Loaded conditionally via wp_enqueue_scripts only when is_front_page() is true.
 * An early-exit guard ensures nothing runs unless the volunteer form's unique
 * container is present, so this script can NEVER affect the letter campaign,
 * survey, action-template, or event AN forms (each has its own script and its
 * own container ID). See Documentation/forms-embedded.md for the full styling
 * model — in short, AN injects its stylesheet AFTER theme.css, so the only
 * reliable override is element.style.setProperty('prop','val','important').
 *
 * IMPORTANT: AN re-renders the form node after its initial inject (and again on
 * validation errors), wiping any inline styles / injected nodes. So every fix
 * here is written as an IDEMPOTENT function and re-run by applyAll(), which is
 * driven both by an initial interval burst and a MutationObserver. One-shot
 * application is not enough — that was why earlier fixes "reverted".
 *
 * What this script does (theme.css already covers the shared
 * `#can_embed_form form.new_answer …` input/button/column styling):
 *   - can_float bracket artefacts (theme.css only fixes these on the action
 *     template body class, not the home page).
 *   - #d_sharing opt-in section (dotted border + checkbox positioning).
 *   - Housing Demographic: placeholder option + shadow-box styling (theme.css
 *     only styles that select under new_delivery) + move its stray label so it
 *     sits directly above the dropdown.
 *   - Hide the "Not in AU? Australia" switcher AND the country select wrapper
 *     (AU only; country defaults to Australia and still submits).
 *   - Shrink / re-align the "Join House You" form title (.entry-title sits
 *     outside form.new_answer, so theme.css never reaches it).
 *   - Style the "How can you help?" multi-checkbox group; full-width rows.
 *   - Two-step flow: Step 1 = personal details, Step 2 = "How can you help?" +
 *     "Anything else?" + opt-in + submit. Faked client-side (AN's form widget is
 *     single-page); all fields stay in the DOM so they submit normally.
 */
(function () {

	// Guard: only run on pages that contain the volunteer form embed.
	if ( ! document.querySelector( '#can-form-area-volunteer-form-22' ) ) {
		return;
	}

	// White-text + heavy text-shadow recipe used across the home page form,
	// which sits over the dark hero image (matches theme.css / home-letter-action.js).
	var SHADOW = '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.9)';

	// To HIDE an AN element we must use inline !important (AN's stylesheet sets
	// display via !important). To SHOW it again we remove the inline display so
	// the theme.css / AN rule resumes control.
	function hide( el ) { if ( el ) { el.style.setProperty( 'display', 'none', 'important' ); } }
	function showAuto( el ) { if ( el ) { el.style.removeProperty( 'display' ); } }
	function setImp( el, props ) {
		if ( ! el ) { return; }
		Object.keys( props ).forEach( function ( k ) { el.style.setProperty( k, props[ k ], 'important' ); } );
	}

	// =========================================================================
	// Idempotent fix functions — each safe to call repeatedly.
	// =========================================================================

	// can_float bracket artefacts ("[" / "]" rendered via ::before/::after).
	function fixCanFloat() {
		var form = document.getElementById( 'can_embed_form' );
		if ( ! form || ! form.classList.contains( 'can_float' ) ) { return; }
		setImp( form, { display: 'block', background: 'transparent' } );
		if ( ! document.getElementById( 'hy-volunteer-canfloat-fix' ) ) {
			var style = document.createElement( 'style' );
			style.id = 'hy-volunteer-canfloat-fix';
			style.textContent = '#can_embed_form.can_float::before, #can_embed_form.can_float::after { content: none !important; display: none !important; }';
			document.head.appendChild( style );
		}
	}

	// #d_sharing opt-in: remove dotted border, restore flex checkbox layout.
	function fixDSharing() {
		var el = document.getElementById( 'd_sharing' );
		if ( ! el ) { return; }
		setImp( el, { 'border-top': 'none', 'margin-top': '20px' } );
		var label = el.querySelector( 'label' );
		if ( label ) {
			setImp( label, {
				display: 'flex', 'flex-direction': 'row', 'align-items': 'flex-start',
				gap: '8px', 'text-shadow': SHADOW
			} );
			var checkbox = label.querySelector( 'input[type="checkbox"]' );
			setImp( checkbox, { position: 'static', display: 'inline', 'flex-shrink': '0', 'margin-top': '3px' } );
		}
	}

	// Housing Demographic: AN initialises Select2 on this <select> (js-form_select2),
	// which hides the native control offscreen and renders its own .select2-container
	// widget (the "weird box" + an offscreen .select2-focusser input). We don't want
	// Select2 here — hide its widget(s) and restore the native <select>, which theme
	// styling handles cleanly and matches the other fields.
	function fixHousingSelect() {
		var native = document.getElementById( 'Housing-Demographic' );
		if ( ! native ) { return; }

		// Hide every Select2 artefact AN rendered for this field.
		document.querySelectorAll(
			'#can_embed_form .select2-container, #can_embed_form input.select2-focusser'
		).forEach( hide );

		// Undo Select2's offscreen positioning class on the native select.
		native.classList.remove( 'select2-offscreen' );

		// Placeholder option + grey-out wiring (once).
		if ( ! native.dataset.fixed ) {
			native.dataset.fixed = 'true';
			var first = native.options[0];
			if ( first && first.value !== '' ) {
				var opt = document.createElement( 'option' );
				opt.text = 'Your housing situation';
				opt.value = '';
				opt.disabled = true;
				opt.selected = true;
				native.insertBefore( opt, first );
			}
			native.addEventListener( 'change', function () {
				native.style.setProperty( 'color', native.value === '' ? '#999' : '#000', 'important' );
			} );
		}

		setImp( native, {
			position: 'static', clip: 'auto', opacity: '1', left: 'auto', top: 'auto',
			'font-family': 'var(--wp--preset--font-family--league-spartan)',
			'font-size': '18px', height: '52px', padding: '12px 15px', 'border-radius': '10px',
			border: '1px solid #000000', background: '#FFFFFF',
			color: native.value === '' ? '#999' : '#000',
			'box-shadow': '10px 10px 2px 0 #2D2A2E', 'margin-bottom': '20px', width: '100%',
			'box-sizing': 'border-box', display: 'block',
			'-webkit-appearance': 'menulist', appearance: 'menulist'
		} );
	}

	// AN renders <label for="Housing-Demographic"> as a sibling BEFORE the select's
	// <li> (not inside it), so with the field reorder it floats to the top. Move it
	// inside the li, directly above the select.
	function fixHousingLabel() {
		// Select2 rewrites this label's `for` to its own autogen id, so match by
		// class (there is only one js-fb-selectbasic label on this form).
		var label  = document.querySelector( '#can_embed_form label.js-fb-selectbasic' );
		var select = document.getElementById( 'Housing-Demographic' );
		if ( ! label || ! select ) { return; }
		var li = select.closest( 'li' );
		if ( ! li ) { return; }
		if ( label.parentNode !== li ) {
			li.insertBefore( label, select );
		}
		setImp( label, {
			display: 'block', 'font-family': 'var(--wp--preset--font-family--league-spartan)',
			'font-size': '16px', 'font-weight': 'bold', color: '#FFFFFF',
			'text-shadow': SHADOW, margin: '0 0 6px 0', padding: '0'
		} );
	}

	// Hide the "Not in AU? Australia" link AND the country select wrapper. Country
	// defaults to Australia (selected) and is not required, so it still submits.
	function hideCountry() {
		[ '.js-international_link-wrap', '.js-country_drop_wrap' ].forEach( function ( sel ) {
			document.querySelectorAll( '#can_embed_form ' + sel ).forEach( hide );
		} );
	}

	// "Join House You" title: AN renders <h2 class="entry-title"> in #can_main_col,
	// OUTSIDE form.new_answer, so theme.css's form-heading rule never reaches it and
	// it inherits the theme's oversized H2 + AN's top spacing (misaligned with the
	// left column). Shrink it and zero the top spacing on it and its wrapper.
	function fixEntryTitle() {
		var h2 = document.querySelector( '#can_embed_form .entry-title' );
		if ( ! h2 ) { return; }
		setImp( h2, {
			'font-family': 'var(--wp--preset--font-family--league-spartan)',
			'font-size': '1.5rem', 'line-height': '1.1', 'text-transform': 'uppercase',
			color: '#FFFFFF', 'text-shadow': SHADOW,
			margin: '0 0 16px 0', padding: '0', border: 'none'
		} );
		// Zero the top spacing on every wrapper between the title and the form area
		// so it aligns with the top of the column on the left.
		var stop = document.getElementById( 'can-form-area-volunteer-form-22' );
		var node = h2.parentNode;
		while ( node && node !== document.body ) {
			node.style.setProperty( 'margin-top', '0', 'important' );
			node.style.setProperty( 'padding-top', '0', 'important' );
			if ( node === stop ) { break; }
			node = node.parentNode;
		}
	}

	// Hide AN's ajax loading spinner if it lingers after init.
	function hideSpinner() {
		document.querySelectorAll( '#can-form-area-volunteer-form-22 img.ajax-loading' ).forEach( hide );
	}

	// Force a flex item to occupy a full row inside #form_col1.
	function fullWidthLi( li ) {
		setImp( li, { flex: '0 0 100%', width: '100%' } );
	}

	// "How can you help?" js-fb-multiplecheckboxes group → vertical white checklist.
	function styleHowCanYouHelp() {
		var li = document.querySelector( '#can_embed_form li.js-fb-multiplecheckboxes' );
		if ( ! li || li.dataset.hyStyled ) { return; }
		fullWidthLi( li );

		setImp( li.querySelector( 'label.check_radio_label' ), {
			display: 'block', 'font-family': 'var(--wp--preset--font-family--league-spartan)',
			'font-size': '20px', 'font-weight': 'bold', color: '#FFFFFF',
			'text-shadow': SHADOW, 'margin-bottom': '14px'
		} );

		setImp( li.querySelector( 'span.controls.check_radio_field' ), {
			display: 'block', float: 'none', width: '100%'
		} );

		li.querySelectorAll( 'label.checkbox' ).forEach( function ( opt ) {
			setImp( opt, {
				display: 'flex', 'flex-direction': 'row', 'align-items': 'flex-start',
				gap: '10px', margin: '0 0 12px 0', padding: '0', color: '#FFFFFF',
				'font-size': '16px', 'line-height': '1.4', 'text-shadow': SHADOW, cursor: 'pointer'
			} );
			setImp( opt.querySelector( 'input[type="checkbox"]' ), {
				position: 'static', float: 'none', margin: '3px 0 0 0',
				'flex-shrink': '0', width: '18px', height: '18px'
			} );
		} );

		li.dataset.hyStyled = 'true';
	}

	// "Anything else?" textarea row → full width + styled label.
	function styleAnythingElse() {
		var ta = document.querySelector( '#can_embed_form textarea#Additional_context' );
		var li = ta ? ta.closest( 'li' ) : null;
		if ( ! li || li.dataset.hyStyled ) { return; }
		fullWidthLi( li );
		setImp( li.querySelector( 'label.control-label' ), {
			display: 'block', 'font-family': 'var(--wp--preset--font-family--league-spartan)',
			'font-size': '20px', 'font-weight': 'bold', color: '#FFFFFF',
			'text-shadow': SHADOW, 'margin-bottom': '8px'
		} );
		li.dataset.hyStyled = 'true';
	}

	// Reorder Step 1 fields so render order is First, Last, Email, Mobile, Postcode,
	// Housing (Mobile before Postcode; Housing to the right of Postcode). AN's DOM
	// order is first,last,email,zip,phone,housing; CSS `order` re-sequences visually
	// without touching the DOM (which AN may re-render).
	var FIELD_ORDER = {
		'form-first_name': 1, 'form-last_name': 2,
		'form-email': 3, 'form-phone': 4,
		'form-zip_code': 5, 'Housing-Demographic': 6
	};
	function fixFieldOrder() {
		Object.keys( FIELD_ORDER ).forEach( function ( id ) {
			var f = document.getElementById( id );
			var li = f ? f.closest( 'li' ) : null;
			if ( li ) { li.style.setProperty( 'order', String( FIELD_ORDER[ id ] ), 'important' ); }
		} );
	}

	// -------------------------------------------------------------------------
	// Two-step flow (one-time per form node).
	// -------------------------------------------------------------------------

	function makePrimaryButton( text ) {
		var b = document.createElement( 'button' );
		b.type = 'button';
		b.textContent = text;
		b.style.cssText = 'background-color:#CB1EAA;color:#fff;font-family:var(--wp--preset--font-family--league-spartan),sans-serif;font-weight:bold;font-size:20px;text-transform:uppercase;border:none;border-radius:11px;padding:12px 32px;cursor:pointer;box-shadow:10px 10px 2px 0 #2D2A2E;margin:0;';
		return b;
	}

	function makeBackButton() {
		var b = document.createElement( 'button' );
		b.type = 'button';
		b.textContent = '← Back';
		b.style.cssText = 'background:transparent;color:#fff;font-family:var(--wp--preset--font-family--league-spartan),sans-serif;font-weight:bold;font-size:16px;text-transform:uppercase;border:2px solid #fff;border-radius:11px;padding:8px 20px;cursor:pointer;text-shadow:' + SHADOW + ';';
		return b;
	}

	var STEP1_IDS = [ 'form-first_name', 'form-last_name', 'form-email', 'form-zip_code', 'form-phone', 'Housing-Demographic' ];

	function setupSteps() {
		var form = document.querySelector( '#can_embed_form form.new_answer' );
		var col1 = document.querySelector( '#can_embed_form #form_col1' );
		if ( ! form || ! col1 || form.dataset.hyStepsInit ) { return; }

		var step1Lis = [];
		STEP1_IDS.forEach( function ( id ) {
			var f  = document.getElementById( id );
			var li = f ? f.closest( 'li' ) : null;
			if ( li ) { step1Lis.push( li ); }
		} );

		var howLi    = document.querySelector( '#can_embed_form li.js-fb-multiplecheckboxes' );
		var elseTa   = document.querySelector( '#can_embed_form textarea#Additional_context' );
		var elseLi   = elseTa ? elseTa.closest( 'li' ) : null;
		var dSharing = document.querySelector( '#can_embed_form #d_sharing' );
		var submit   = document.querySelector( '#can_embed_form form.new_answer input[type="submit"]' );

		if ( step1Lis.length < 5 || ! howLi || ! submit ) { return; }

		form.dataset.hyStepsInit = 'true';

		var step2Els = [ howLi, elseLi, dSharing, submit ].filter( Boolean );

		// Step 1 nav (Continue) — high `order` so it sits below the fields.
		var nav1 = document.createElement( 'div' );
		nav1.className = 'hy-volunteer-nav';
		nav1.style.cssText = 'flex:0 0 100%;width:100%;order:99;margin-top:10px;';
		var continueBtn = makePrimaryButton( 'Continue →' );
		var errMsg = document.createElement( 'p' );
		errMsg.style.cssText = 'color:#FFDAF1;font-weight:bold;font-size:15px;margin:0 0 10px 0;display:none;text-shadow:' + SHADOW + ';';
		nav1.appendChild( errMsg );
		nav1.appendChild( continueBtn );
		col1.appendChild( nav1 );

		// Step 2 nav (Back) — directly above the "How can you help?" question.
		var nav2 = document.createElement( 'div' );
		nav2.className = 'hy-volunteer-nav';
		nav2.style.cssText = 'flex:0 0 100%;width:100%;margin:0 0 14px 0;';
		var backBtn = makeBackButton();
		nav2.appendChild( backBtn );
		howLi.parentNode.insertBefore( nav2, howLi );

		function showStep( n ) {
			step1Lis.forEach( function ( li ) { n === 1 ? showAuto( li ) : hide( li ); } );
			nav1.style.setProperty( 'display', n === 1 ? 'block' : 'none', 'important' );
			step2Els.forEach( function ( el ) { n === 2 ? showAuto( el ) : hide( el ); } );
			nav2.style.setProperty( 'display', n === 2 ? 'block' : 'none', 'important' );

			var area = document.getElementById( 'can-form-area-volunteer-form-22' );
			if ( area && area.scrollIntoView ) { area.scrollIntoView( { behavior: 'smooth', block: 'start' } ); }
		}

		function validateStep1() {
			var firstInvalid = null;
			[ 'form-first_name', 'form-last_name', 'form-email', 'form-zip_code', 'form-phone' ].forEach( function ( id ) {
				var input = document.getElementById( id );
				if ( ! input ) { return; }
				var empty   = ! input.value.trim();
				var badMail = id === 'form-email' && input.value && ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( input.value );
				if ( ( empty || badMail ) && ! firstInvalid ) { firstInvalid = input; }
				input.style.setProperty( 'border-color', ( empty || badMail ) ? '#E64BC8' : '', empty || badMail ? 'important' : '' );
			} );
			return firstInvalid;
		}

		continueBtn.addEventListener( 'click', function () {
			var invalid = validateStep1();
			if ( invalid ) {
				errMsg.textContent = 'Please fill in your details (a valid email is required) before continuing.';
				errMsg.style.display = 'block';
				invalid.focus();
				return;
			}
			errMsg.style.display = 'none';
			showStep( 2 );
		} );

		backBtn.addEventListener( 'click', function () { showStep( 1 ); } );

		showStep( 1 );
	}

	// =========================================================================
	// Driver — run everything, repeatedly, so fixes survive AN's re-renders.
	// =========================================================================

	function applyAll() {
		[ fixCanFloat, fixDSharing, fixHousingSelect, fixHousingLabel, hideCountry,
			fixEntryTitle, hideSpinner, fixFieldOrder, styleHowCanYouHelp,
			styleAnythingElse, setupSteps
		].forEach( function ( fn ) {
			// Never let one fix's error block the rest (e.g. Select2-mangled DOM).
			try { fn(); } catch ( e ) {}
		} );
	}

	// Initial burst — covers AN's async render / re-render in the first seconds.
	var burst = setInterval( applyAll, 150 );
	setTimeout( function () { clearInterval( burst ); }, 8000 );

	// Long-term safety — re-apply whenever AN mutates the DOM (debounced to one
	// run per frame). Observe structural changes only so our own inline-style
	// writes don't retrigger it.
	var pending = false;
	var observer = new MutationObserver( function () {
		if ( pending ) { return; }
		pending = true;
		requestAnimationFrame( function () { pending = false; applyAll(); } );
	} );
	observer.observe( document.body, { childList: true, subtree: true } );

	applyAll();

})();
