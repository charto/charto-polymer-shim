function loadMainComponents(componentList) {

	var readyEvent;

	// Import a list of files in parallel.

	function importGroup(group) {

		if(typeof(group) == 'string') return(System.import(group));

		return(Promise.all(
			group.map(function(path) {return(System.import(path));})
		));
	}

	// Sequentially import a list of files or file groups.

	function importComponentList() {

		var importDone = componentList.reduce(function(prev, group) {
			return(prev.then(function() {
				return(importGroup(group));
			}));
		}, importGroup(componentList[0]));

		return(importDone);
	}

	// Load web components shim.

	function loadShim() {
		return(new Promise(function(resolve, reject) {

			function shimLoaded(event) {

				// Store event for dispatching it again
				// when everything really is loaded.

				readyEvent = event;

				// Stop listening for it to avoid an infinite loop.

				removeEventListener('WebComponentsReady', shimLoaded);

				resolve();
			}

			addEventListener('WebComponentsReady', shimLoaded);

			// Import html package which loads the shim.

			System.import('html');
		}));
	}

	function launch(event) {

		// When all components are loaded, fire the ready
		// event again to inform them.

		document.dispatchEvent(readyEvent, {bubbles: true});
	}

	// Load shim first, just to trap the WebComponentsReady event
	// which otherwise may get fired at any time while loading
	// the components.

	loadShim().then(importComponentList).then(launch);

}
