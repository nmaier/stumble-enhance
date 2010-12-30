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
	
	let running = false;
	let original = clickstumble;
	function override(evt, todo) {
		let sub = document.getElementById('su_stumble');
		let sue = document.getElementById('stumbleenh-button') || {
			setAttribute: function() {}
		};
		if (running) {
			return;
		}
		running = true;
		todo = todo || numStumbles;
				
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
			if (!su_stumble_async_context) {
				stumble(true);
				su_cancel_stumble_throttle();
				--todo;
				sue.setAttribute('tooltiptext', todo.toString());				
			}
			setTimeout(arguments.callee, 500);
		})();
	};

	let prefEnabled = Application.prefs.get("extensions.stumbleenh.enabled");
	function setOverride() {
		clickstumble = prefEnabled.value ? override : original;
	}
	setOverride();
	prefEnabled.events.addListener(
		'change',
		{ handleEvent: function(aEvent) {
			setOverride();
		} }
	);
}, true);
