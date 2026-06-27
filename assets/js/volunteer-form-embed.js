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

	// Hide the redundant per-field labels: the core-field floatlabels (First Name,
	// Last Name, Email, Postcode, Mobile — their text just duplicates the field's
	// placeholder) and the stray Housing Demographic label Select2 generates. Each
	// field is represented by its placeholder. The "How can you help?" and "Anything
	// else?" prompts use .check_radio_label / .control-label and are NOT touched.
	function hideFieldLabels() {
		document.querySelectorAll(
			'#can_embed_form .floatlabel-label, #can_embed_form label.js-fb-selectbasic'
		).forEach( hide );
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
		// Scope to the whole form area, not #can_embed_form — in the live DOM the
		// title h2 may sit outside #can_embed_form, which is why a #can_embed_form
		// scoped selector (and thus our inline override) was missing it.
		var h2 = document.querySelector( '#can-form-area-volunteer-form-22 .entry-title' )
			|| document.querySelector( '#can-form-area-volunteer-form-22 h2' );
		if ( ! h2 ) { return; }
		setImp( h2, {
			'font-family': 'var(--wp--preset--font-family--league-spartan)',
			'font-size': '1.9rem', 'line-height': '1.1', 'text-transform': 'uppercase',
			color: '#FFFFFF', 'text-shadow': SHADOW,
			margin: '0 0 16px 0', padding: '0', border: 'none'
		} );
		// Zero the top spacing on every wrapper between the title and (and including)
		// the WordPress form column, so the title aligns with the top of the column
		// on the left. The chain is: h2 → #can_main_col → .clearfix → #can_embed_form
		// → .can_embed → #can-form-area → .wp-block-column (stop, inclusive).
		// Zero BOTH the physical (margin-top/padding-top) and logical
		// (margin-block-start/padding-block-start) properties. WordPress's flow-layout
		// rule applies `margin-block-start: var(--wp--custom--gap--vertical)` to
		// #can-form-area (it's the sibling after the AN <script> tag), and a physical
		// margin-top override does not reliably beat a logical one in the cascade.
		var node = h2.parentNode;
		while ( node && node !== document.body ) {
			node.style.setProperty( 'margin-top', '0', 'important' );
			node.style.setProperty( 'margin-block-start', '0', 'important' );
			node.style.setProperty( 'padding-top', '0', 'important' );
			node.style.setProperty( 'padding-block-start', '0', 'important' );
			if ( node.classList && node.classList.contains( 'wp-block-column' ) ) { break; }
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

	// Inject the brand-styled checkbox CSS once. A <style> tag (vs inline) is
	// required because the option cards need :hover / :checked states. Scoped to the
	// form area with high specificity + !important so it beats AN's stylesheet, and
	// it survives AN's re-renders (it lives in <head>, not on the form nodes).
	//
	// Design (House You): each option is a selectable card — translucent white over
	// the dark hero, lifting into the brand's hard 10px offset shadow on hover, and
	// pink-tinted when selected. The native box is replaced by a 26px tick that fills
	// House You Pink (#CB1EAA) with a white check. Long descriptions use a readable
	// body font rather than heavy uppercase.
	function injectStyles() {
		if ( document.getElementById( 'hy-volunteer-styles' ) ) { return; }
		var css =
		'#can-form-area-volunteer-form-22 #form_col1 label.checkbox{' +
			'display:flex !important;align-items:flex-start !important;gap:14px !important;' +
			'margin:0 0 10px 0 !important;padding:14px 16px !important;' +
			'font-family:var(--wp--preset--font-family--glacial-indifference),"Inter",sans-serif !important;' +
			'font-size:17px !important;font-weight:700 !important;line-height:1.4 !important;' +
			'color:#FFFFFF !important;background:rgba(45,42,46,.55) !important;' +
			'border:2px solid rgba(255,255,255,.4) !important;border-radius:12px !important;' +
			'cursor:pointer !important;text-shadow:none !important;' +
			'transition:transform .15s ease,box-shadow .15s ease,background .15s ease,border-color .15s ease !important;}' +
		'#can-form-area-volunteer-form-22 #form_col1 label.checkbox:hover{' +
			'background:rgba(45,42,46,.72) !important;border-color:#FFFFFF !important;' +
			'transform:translate(-2px,-2px) !important;box-shadow:6px 6px 0 0 #2D2A2E !important;}' +
		'#can-form-area-volunteer-form-22 #form_col1 label.checkbox:has(input:checked){' +
			'background:rgba(203,30,170,.6) !important;border-color:#CB1EAA !important;' +
			'box-shadow:6px 6px 0 0 #2D2A2E !important;}' +
		'#can-form-area-volunteer-form-22 #form_col1 label.checkbox input[type="checkbox"]{' +
			'-webkit-appearance:none !important;appearance:none !important;' +
			'position:relative !important;float:none !important;flex:0 0 auto !important;' +
			'width:26px !important;height:26px !important;margin:0 !important;' +
			'border:2px solid #2D2A2E !important;border-radius:7px !important;' +
			'background:#FFFFFF !important;cursor:pointer !important;display:inline-block !important;' +
			'transition:background .12s ease,border-color .12s ease !important;}' +
		'#can-form-area-volunteer-form-22 #form_col1 label.checkbox input[type="checkbox"]:checked{' +
			'background:#CB1EAA !important;border-color:#CB1EAA !important;}' +
		'#can-form-area-volunteer-form-22 #form_col1 label.checkbox input[type="checkbox"]:checked::after{' +
			'content:"" !important;position:absolute !important;left:8px !important;top:3px !important;' +
			'width:6px !important;height:13px !important;border:solid #FFFFFF !important;' +
			'border-width:0 3px 3px 0 !important;transform:rotate(45deg) !important;}';
		var style = document.createElement( 'style' );
		style.id = 'hy-volunteer-styles';
		style.textContent = css;
		document.head.appendChild( style );
	}

	// "How can you help?" js-fb-multiplecheckboxes group. Structural bits stay inline
	// (full-width must beat theme.css's 2-ID 48% rule). The option-row "cards" and
	// custom tick boxes — which need :hover / :checked states — live in injectStyles().
	function styleHowCanYouHelp() {
		var li = document.querySelector( '#can_embed_form li.js-fb-multiplecheckboxes' );
		if ( ! li || li.dataset.hyStyled ) { return; }
		fullWidthLi( li );

		setImp( li.querySelector( 'label.check_radio_label' ), {
			display: 'block', 'font-family': 'var(--wp--preset--font-family--league-spartan)',
			'font-size': '22px', 'font-weight': 'bold', color: '#FFFFFF',
			'text-shadow': SHADOW, 'margin-bottom': '16px'
		} );

		setImp( li.querySelector( 'span.controls.check_radio_field' ), {
			display: 'block', float: 'none', width: '100%'
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

	// Replace AN's default thank-you page with the House You "follow & share" content
	// (ported from the letter action's thank-you), styled white for the dark hero,
	// with Instagram + Facebook logos. Idempotent via the .hy-volunteer-thanks guard.
	function showThankYou() {
		var area = document.getElementById( 'can-form-area-volunteer-form-22' );
		if ( ! area ) { return; }
		var embedForm = area.querySelector( '#can_embed_form' );
		if ( ! embedForm ) { return; }
		var isThankYou = embedForm.classList.contains( 'can_thank_you_wrap' ) || area.querySelector( '#can_thank_you' );
		if ( ! isThankYou || embedForm.querySelector( '.hy-volunteer-thanks' ) ) { return; }

		// Stronger drop-shadow than the form fields use — the thank-you text sits
		// directly on the hero with no card behind it, so it needs more to stay legible.
		var sh = 'text-shadow:0 2px 6px rgba(0,0,0,.95),0 0 18px rgba(0,0,0,.85),0 0 40px rgba(0,0,0,.7);';
		var iconShadow = 'filter:drop-shadow(0 3px 6px rgba(0,0,0,.9)) drop-shadow(0 0 14px rgba(0,0,0,.7));';
		embedForm.innerHTML =
			'<div class="hy-volunteer-thanks" style="text-align:center;padding:10px 0 4px;">' +
				'<h3 style="font-family:var(--wp--preset--font-family--league-spartan),sans-serif;font-size:1.9rem;text-transform:uppercase;font-weight:bold;color:#fff;margin:0 0 16px;' + sh + '">Welcome to the movement!</h3>' +
				'<p style="color:#fff;font-size:23px;font-weight:bold;margin:0 0 18px;' + sh + '">We won\'t win because we\'re right. We\'ll win because we\'re organised.</p>' +
				'<p style="color:#fff;font-size:23px;font-weight:bold;margin:0 0 8px;' + sh + '"><strong>Next steps:</strong></p>' +
				'<ol style="color:#fff;text-align:left;max-width:560px;margin:0 auto 22px;font-size:20px;font-weight:bold;line-height:1.5;' + sh + '">' +
					'<li style="margin-bottom:8px;font-weight:700 !important;font-size:20px !important;">Share this with 3 people right now &mdash; text your bestie, call your folks, DM your mate.</li>' +
					'<li style="font-weight:700 !important;font-size:20px !important;">Follow, engage &amp; share our content &mdash; shift the narrative, end house hoarding &amp; everybody gets a house!</li>' +
				'</ol>' +
				'<div style="display:flex;justify-content:center;gap:24px;align-items:center;flex-wrap:wrap;">' +
					'<a href="https://www.instagram.com/house_you__/?hl=en" target="_blank" rel="noopener"><img src="https://houseyou.org/wp-content/uploads/2025/11/hy-insta-scaled.png" alt="Follow House You on Instagram" width="72" style="display:block;border:0;' + iconShadow + '"></a>' +
					'<a href="https://www.facebook.com/p/House-You-61551436109729/" target="_blank" rel="noopener"><img src="https://houseyou.org/wp-content/uploads/2025/11/hy-fb2-scaled.png" alt="Like House You on Facebook" width="72" style="display:block;border:0;' + iconShadow + '"></a>' +
				'</div>' +
			'</div>';
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
			STEP1_IDS.forEach( function ( id ) {
				var input = document.getElementById( id );
				if ( ! input ) { return; }
				// Only enforce fields Action Network itself marks required (class
				// "required"), so this stays in sync with the AN form config —
				// e.g. Mobile/Postcode being optional in AN means optional here.
				var required = input.classList.contains( 'required' );
				var empty    = required && ! String( input.value ).trim();
				var badMail  = id === 'form-email' && input.value && ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( input.value );
				var bad      = empty || badMail;
				if ( bad && ! firstInvalid ) { firstInvalid = input; }
				input.style.setProperty( 'border-color', bad ? '#E64BC8' : '', bad ? 'important' : '' );
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
		[ injectStyles, showThankYou, fixCanFloat, fixDSharing, fixHousingSelect,
			hideFieldLabels, hideCountry, fixEntryTitle, hideSpinner, fixFieldOrder,
			styleHowCanYouHelp, styleAnythingElse, setupSteps
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
