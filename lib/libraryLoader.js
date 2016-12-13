( function ( root, undefined ) {
	'use strict';
	var libraryStorage = { };

	// Provide an array to queue callbacks with unsatisfied dependencies
	var queue = [ ];
	
	function libraryLoader ( libraryName, dependencies, callback ) {
		if ( arguments.length > 1 ) {
			// if dependencies is provided, check they exist and pass them in
			if (Array.isArray( dependencies ) === false ) {
				throw new TypeError('Provide an array of dependencies!');
			}

			// for each dependency, get the module
			var modules = [];
			var queueCallback = false;
			dependencies.forEach( function( dep ) {
				// check for undefined dependencies
				if ( libraryStorage[ dep ] === undefined ) {
					queueCallback = true;
				} else {
					modules.push( libraryStorage[ dep ]);
				}
			});

			if (queueCallback) {
				// save the callback for later processing
				queue.push({
					libraryName: libraryName,
					dependencies: dependencies,
					callback: callback
				});
			} else {
				// process the callback
				libraryStorage[ libraryName ] = callback.apply( null, modules );
				
				// if queue.length > 0, process queue
				if ( queue.length > 0 ) {
					var queueItem = queue.pop();
					libraryLoader(queueItem.libraryName, queueItem.dependencies, queueItem.callback);
				}
			}
		} else {
			if ( libraryStorage[ libraryName ] === undefined ) {
				throw new TypeError('Library not defined');
			}
			return libraryStorage[ libraryName ];
		}
	}

	root[ 'libraryLoader' ] = libraryLoader;
})( this );
