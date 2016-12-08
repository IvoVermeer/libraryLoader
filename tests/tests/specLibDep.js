/*
Load dependencies out of order. Example:
	libraryLoader('app', ['router'], function(router) {
	  return {
	    name: 'App module',
	    router: router
	  } 
	});

	libraryLoader('router', [], function() {
	  return "I am the router!";
	});

	console.log(libraryLoader('app')); ==> {name: 'App module', router: 'I am the router'}
 */

tests({
	'It should accept load a library after all dependencies are done loading': function () {
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
	}
});
