/* globals tests:false, eq:false, fail: false, libraryLoader: flase, libraryLoaderUtils:false */
/*
No deps:
	libraryLoader('myLibrary', [], function(){
		var foo = 'bar';

		return foo
	});
	
	var myLib = libraryLoader('myLibrary');
	console.log(myLib); // ==> 'bar'

Utils:
	libraryLoaderUtils.libraries();
	returns '['myLibrary']'
 */
tests({
	'It should call the callback exactly once.': function () {
		var timesCallbackHasRun = 0;
		libraryLoader('testLib', [], function () {
			timesCallbackHasRun++;
			return 'testLib';
		});
		eq(1, timesCallbackHasRun);
	},
	'It should return the library when called with one argument.': function () {
		eq(libraryLoader('testLib'), 'testLib');
	},
	'It should accept an array of dependencies and pass those as arguments to the callback': function () {
		// Create the first library
		libraryLoader('testLibOne', [], function () {
			return 'I am the dependency';
		});

		// Create the second library, with a dependency to the first one
		libraryLoader('testLibTwo', ['testLibOne'], function (testLibOne) {
			return testLibOne;
		});

		// assign the second library to a local variable
		eq(libraryLoader('testLibTwo'), 'I am the dependency');
	},
	'It should put libraryLoaderUtils on the global object when run in the test enviroment.': function () {
		eq('[object Object]', libraryLoaderUtils);
	},
	'It should be able to return the loaded libraries as an array.': function () {
		var loadedLibraries = libraryLoaderUtils.libraries();
		eq('testLib', loadedLibraries[0]);
	},
	'It should be able to unload libraries.': function () {
		var originalLength = libraryLoaderUtils.libraries().length;
		var firstLoadedLib = libraryLoaderUtils.libraries()[0];
		libraryLoaderUtils.unload(firstLoadedLib.toString());
		eq(originalLength - 1, libraryLoaderUtils.libraries().length);
	},
	'It should be able to return the queue array.': function () {
		// put a library on the queue
		libraryLoader('main', ['nonExistingDependency'], function (nonExistingDependency) {
			return nonExistingDependency;
		});
		
		// get a reference to the queue
		var queuedCallbacks = libraryLoaderUtils.loaderQueue();
		
		// add a variable to indicate whether or not the queued callback is found
		var queuedLibraryFound = false;
		// Check the queuedCallbacks array for the libraryName main
		queuedCallbacks.forEach(function (queueItem) {
			if (queueItem.libraryName === 'main') {
				queuedLibraryFound = true;
			}
		});
		// check that the queue has the expected library
		eq(true, queuedLibraryFound);
		// Do not clear this queue, next test would fail otherwise
	},
	'It should be able to clear the queue.': function () {
		// The main library loaded in the previous test, check that it still exists
		// get a reference to the queue
		var queuedCallbacks = libraryLoaderUtils.loaderQueue();
		
		// add a variable to indicate whether or not the queued callback is found
		var queuedLibraryFound = false;
		// Check the queuedCallbacks array for the libraryName main
		queuedCallbacks.forEach(function (queueItem) {
			if (queueItem.libraryName === 'main') {
				queuedLibraryFound = true;
			}
		});
		if (!queuedLibraryFound) {
			fail('main should still be found at this point');
		}

		libraryLoaderUtils.clearQueue();
		queuedCallbacks = libraryLoaderUtils.loaderQueue(); // refresh the reference
		eq(0, queuedCallbacks.length);
	},
	'It should throw an exception if library has not been defined.': function () {
		var thrownError;
		try {
			libraryLoader('undefinedLib');
		}
		catch (e) {
			thrownError = e;
		}

		eq(thrownError, 'Library not defined');
	},
	'It should load a library only after all dependencies are done loading': function () {
		libraryLoader('app', ['router'], function(router) {
			return {
				name: 'App module',
				router: router
			};
		});

		libraryLoader('router', [], function() {
			return 'I am the router!';
		});

		eq(libraryLoader('app').name, 'App module');
		eq(libraryLoader('app').router, 'I am the router!');
	},
	'It should handle dependencies that have dependencies':function () {
		libraryLoader('main', ['util'], function(util) {
			return {
				util: util
			};
		});

		// create an unused library, to trigger queued items to be processed
		libraryLoader('bmw', [], function() {
			return 'I am unused';
		});

		// Because the storage dependency is never met, main should throw an erro
		try {
			var main = libraryLoader('main');
		}
		catch (e) {
			eq(e, 'Library not defined');
		}
		eq(main, undefined);		
	}
});
