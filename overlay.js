addEventListener('load', function() {
	removeEventListener('load', arguments.callee, true);

	let prefNumStumbles = Application.prefs.get("extensions.stumbleenh.numstumbles", 20);
	let numStumbles = prefNumStumbles.value;
	prefNumStumbles.events.addListener(
		'change',
		{ handleEvent: function(aEvent) {
			numStumbles = prefNumStumbles.value;
		} }
	);

	let prefEnabled = Application.prefs.get("extensions.stumbleenh.enabled");
	let enabled = prefEnabled.value;
	prefEnabled.events.addListener(
		'change',
		{ handleEvent: function(aEvent) {
			let enabled = prefEnabled.value;
		} }
	);

	let running = false;
	let stumble = (window.StumbleGlobals.stumble || window.stumble);
	let cancel_throttle = (window.StumbleGlobals.cancel_stumble_throttle || window.su_cancel_stumble_throttle);

	let original;
	function override(evt, todo) {
		if (!enabled) {
			return original.apply(null, arguments);
		}
		if (running) {
			return;
		}
		running = true;
		todo = todo || numStumbles;

		let sub = document.getElementById('su_stumble') || document.getElementById('stumbleglobals_stumble');
		sub = sub || {
			setAttribute: function() {}
		};
		let sue = document.getElementById('stumbleenh-button');
		sue = sue || {
			setAttribute: function() {}
		};

		sub.setAttribute('stumbleenh', 'true');
		sue.setAttribute('stumbleenh', 'true');

		let tt = sub.getAttribute('tooltiptext');
		sub.setAttribute('tooltiptext', todo.toString());
		sue.setAttribute('tooltiptext', todo.toString());
		(function() {
			if (!todo) {
				running = false;
				sub.removeAttribute('stumbleenh');
				sue.removeAttribute('stumbleenh');
				sub.setAttribute('tooltiptext', tt);
				sue.removeAttribute('tooltiptext');
				return;
			}
			if (!(window.StumbleGlobals.stumble_async_context || window.su_stumble_async_context)) {
				stumble(true);
				cancel_throttle();
				--todo;
				sue.setAttribute('tooltiptext', todo.toString());
			}
			setTimeout(arguments.callee, 500);
		})();
	};
	if ("StumbleGlobals" in window) {
		original = function() StumbleGlobals.clickstumble.apply(StumbleGlobals, arguments);
		StumbleGlobals.clickstumble = override;
	}
	else {
		original = clickstumble;
		clickstumble = override;
	}
	document.getElementById("stumbleenh-button").addEventListener("command", override, true);
}, true);
