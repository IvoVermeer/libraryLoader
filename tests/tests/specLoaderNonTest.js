/* globals libraryLoaderUtils: false, tests: false, eq:false */
/*
Test the libraryLoader in a non-test enviroment
This script ust be run with the test enviroment loaded as:
	<!-- Load the ibrary first -->
	<script src="../lib/libraryLoader.js"></script>
	<script src="js/simpletest.js"></script>
	<!-- Run tests for non-test enviroments -->
	<script src="tests/specLoaderNonTest.js"></script>

Order matters! The libraryLoader checks for tests() to exist
 */

tests({
	'It should not add the libraryLoaderUtils object in a non-test enviroment': function () {
		eq('undefined', typeof libraryLoaderUtils);
	}
});
