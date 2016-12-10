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
				name: 'App module',
				util: util
			};
		});

		libraryLoader('util', ['storage'], function(storage) {
			return storage;
		});
		libraryLoader('storage', ['coral'], function () {
			return 'I am the storage!';
		});
		libraryLoader('bmw', [], function() {
			return 'I am unused';
		});

		eq(libraryLoader('main').name, 'App module');
		eq(libraryLoader('main').util, 'I am the storage!');
	}
});
