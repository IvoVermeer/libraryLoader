/* globals tests:false, eq:false, libraryLoader: flase, libraryLoaderUtils:false */
/*
No deps:
	libraryLoader('myLibrary', [], function(){
		var foo = 'bar';

		return foo
	});
	
	var myLib = libraryLoader('myLibrary');
	console.log(myLib); // ==> 'bar'

 */
tests({
	'It should call the callback exactly once.': function () {
		var timesCallbackHasRun = 0;
		libraryLoader('testLib', [], function () {
			timesCallbackHasRun++;
		});
		eq(1, timesCallbackHasRun);
		libraryLoaderUtils.unLoad('testLib');
	},
	'It should return the library when called with one argument.': function () {
		// Create the library
		libraryLoader('testLib', [], function () {
			return {
				foo: 'bar'
			};
		});

		// Assign the library to a local variable
		var testLib = libraryLoader('testLib');
		eq(testLib.foo, 'bar');
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
		var testLibTwo = libraryLoader('testLibTwo');
		eq(testLibTwo, 'I am the dependency');
	},
	'If library has not been defined, throw an exception': function () {
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
