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
	'It should call the callback function once.': function () {
		var timesCallbackHasRun = 0;
		libraryLoader('testLib', [], function () {
			timesCallbackHasRun++;
		});
		eq(1, timesCallbackHasRun);
	},
	'It should return the library when called with one argument.': function () {
		// Create the library
		libraryLoader('testLib', [], function () {
			return {
				foo: 'bar'
			};
		});

		// assign the library to a local variable
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
	// 'If library has not been defined, throw an exception': function () {
	// 	var thrownError;
	// 	try {
	// 		libraryLoader('undefinedLib');
	// 	}
	// 	catch (e) {
	// 		thrownError = e;
	// 	}
	// 	finally {
	// 		eq(thrownError, 'Library not defined');
	// 	}
	// }
});
