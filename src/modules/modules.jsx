/*
Static dependency analysis. Errs on the side of caution (i.e. might include files not needed because
of dynamic program flow.) Works as follows:
  for each input file
    grep for require function calls (!!! this fails if require is assigned to a variable !!!)
	build a list of all dependencies, and their dependencies, breaking cycles if necessary
	add all dependencies to output file

Problems:
 * keeping track of require variable/function
 * dynamic dependencies => require('something' + value);

Valid identifiers are:
 1) [a-Z0-9\.]
 2) absolute
 3) Java-like (packages are lower case, separated by dots, modules CamelCase)
 4) file system independent
 
Examples:
 dk.dtu.dtic.infonet.ui.Template
 com.bramstein.js.jquery.Column

Command line use:
 > rhino modules.js output.js input1.js input2.js

  

*/

(function () {
	var modules = {},

		/**
		 * TODO: find out who to credit for the original version of this code
		 */
		require = (function() {
			// memoized export objects
			var exportsObjects = {}
		 
			// don't want outsider redefining "require" and don't want
			// to use arguments.callee so name the function here.
			var require = function(name) {
				if (exportsObject.hasOwnProperty(name)) {
					return exportsObject[name];
				}
				var exports = {};
				// memoize before executing module for cyclic dependencies
				exportsObject[name] = exports;
				modules[name](require, exports);
				return exports;
			};

			return require;
		})();		

// "math"
		modules['math'] = function (require, exports) {
exports.add = function () {
	var sum = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		sum += arguments[i];
	}
	return sum;
};
		};

// "increment"
		modules['increment'] = function (require, exports) {
var add = require('math').add;

exports.increment = function (val) {
	add(val, 1);
};
		};

// "program"
		modules['program'] = function (require, exports) {
var inc = require('increment').increment;
var a = 1;
inc(a); // 2
		};
}());
