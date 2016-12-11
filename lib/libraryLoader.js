(function () {
	'use strict';
	var libraryStorage = {};
	var queue = [];

	function libraryLoader (libraryName, dependencies, callback) {
		if (arguments.length > 1) {

			// empty array to capture libraries in
			// these will be loaded from the libraryStorage object
			var modules = [];
			var queueLibrary = false;

			// go through the dependencies and retrieve them from the libraryStorage object
			dependencies.forEach(function(dependency){
				if (libraryStorage[dependency]) {
					// Push the library from libraryStorage onto the modules array
					modules.push(libraryStorage[dependency]);
				} else {
					queueLibrary = true;
				}
			});

			// Check if the callback can run <-- all dependencies are met
			if (!queueLibrary) {
				// call the callback, providing the modules array as arguments
				libraryStorage[libraryName] = callback.apply(this, modules);

				// if there are queued items, process them
				var queueLength = queue.length;
				while (queueLength > 0) {
					queueLength--;
					var queueItem = queue.shift();
					libraryLoader(queueItem.libraryName, queueItem.dependencies, queueItem.callback);
				}
			} else {
				// Add the library to the queue for later processing
				queue.push({
					libraryName: libraryName,
					dependencies: dependencies,
					callback: callback
				});
			}

		} else {
			var library = libraryStorage[libraryName];
			if (library == undefined) {
				throw 'Library not defined';
			} else {
				return library;
			}
		}
	}

	function unLoad(libraryName) {
		delete libraryStorage[libraryName];
	}

	function clearQueue() {
		queue = [];
	}

	window['libraryLoader'] = libraryLoader;
	if (typeof tests === 'function') {
		window['libraryLoaderUtils'] = {
			unLoad: unLoad,
			clearQueue: clearQueue
		};
	}
})();
