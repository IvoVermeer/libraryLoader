# libraryLoader
Trying to build my own library loader supporting dependencies.

This code is not targeted for production usage! I'm buildig this as part of my curiculum. However, feel free to play around and make suggestions for improvements. Please log those as issues.

libraryLoader is (currently) only targeted at browser usage. Node and AMD are on my ToDo list.

# Usage
`libraryLoader()` is exposed on the global object (`window`). There are two ways of calling it: register a new library or retrieve an existing one.

## Registering a new library
`libraryLoader('libraryName', [[dependencyOne, dependencyTwo]], callback);`
- Dependencies are optional, send an empty array (`[]`) when you have none. The dependencies are passed as arguments to the callback in the order as they appear in the array. Make sure you define them as parameters in the callback.
- The callback must `return` the library. Anything goes `string`, `object`, `array`, etc.


## Retrieving an existing library
`libraryLoader(libraryName);`
Will return the library

## Examples
### no dependencies:
```javascript
libraryLoader('main', [], function(){
    return 'Main Library';
    });

console.log(libraryLoader('main')); // returns 'Main Library'
```

### with dependencies:
```javascript
libraryLoader('router', [], function(){
    return 'I am the router';
    });

libraryLoader('main', ['router'], function(router){
    return router;
    });

console.log(libraryLoader('main')); // returns 'I am the router'
```

## Features
### Queueing
`libraryLoader()` will queue the library registration if the provided dependencies are not met. Every time a library is registered successfully, `libraryLoader()` will attempt to process the queue. So this will work:
```javascript
libraryLoader('main', ['router'], function(router){
    return router;
    });

libraryLoader('router', [], function(){
    return 'I am the router';
    });

console.log(libraryLoader('main')); // returns 'I am the router'
```

queued items are on an array and are processed front to back.
