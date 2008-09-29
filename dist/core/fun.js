
/*global fun, buildMatch*/
var fun = function () {
	function matchAtom(patternAtom) {
		var type = typeof patternAtom,
			value = patternAtom;

		return function (valueAtom, bindings) {
			return (typeof valueAtom === type && valueAtom === value) || 
					(typeof value === 'number' && isNaN(valueAtom) && isNaN(value));
		};
	}

	function matchFunction(patternFunction) {
		return function (value, bindings) {
			return value.constructor === patternFunction && 
				bindings.push(value) > 0;
		};
	}

	function matchArray(patternArray) {
		var patternLength = patternArray.length,
			subMatches = patternArray.map(function (value) {
				return buildMatch(value);
			});

		return function (valueArray, bindings) {
			return patternLength === valueArray.length && 
				valueArray.every(function (value, i) {
					return (i in subMatches) && subMatches[i](valueArray[i], bindings);
				});
		};
	}

	function matchObject(patternObject) {
		var type = patternObject.constructor,
			patternLength = 0,
			// Figure out the number of properties in the object
			// and the keys we need to check for. We put these
			// in another object so access is very fast. The build_match
			// function creates new subtests which we execute later.
			subMatches = Object.map(patternObject, function (value, key) {
				patternLength += 1;
				return buildMatch(value);
			});

		// We then return a function which uses that information
		// to check against the object passed to it. 
		return function (valueObject, bindings) {
			var valueLength = 0;

			// Checking the object type is very fast so we do it first.
			// Then we iterate through the value object and check the keys
			// it contains against the hash object we built earlier.
			// We also count the number of keys in the value object,
			// so we can also test against it as a final check.
			return valueObject.constructor === type &&
				Object.every(valueObject, function (value, key) {
					valueLength += 1;
					return (key in subMatches) && subMatches[key](valueObject[key], bindings);
				}) && 
				valueLength === patternLength;
		};
	}

	function buildMatch(pattern) {
		if (pattern && pattern.constructor === fun.parameter.constructor) {
			return function (value, bindings) {
				return bindings.push(value) > 0;
			};
		}
		else if (pattern && pattern.constructor === fun.wildcard.constructor) {
			return function () { 
				return true;
			};
		}
		else if (Object.isAtom(pattern)) {
			return matchAtom(pattern);
		}
		else if (Object.isObject(pattern)) {
			return matchObject(pattern);
		}
		else if (Object.isArray(pattern)) {
			return matchArray(pattern);
		}
		else if (Object.isFunction(pattern)) {
			return matchFunction(pattern);
		}
	}
	

	return function () {
		// we save the environment (in case the function is bound)
		// and precompile the patterns
		var thisObj = this,
			patterns = Array.slice(arguments).map(function (value, i) {
				var len = value.length;
				return {
					m: buildMatch(value.slice(0, len - 1)), 
					c: value[len - 1]
				};
			});	

		return function () {
			var value = Array.slice(arguments), result = [], i = 0, len = patterns.length;

			for (; i < len; i += 1) {
				if (patterns[i].m(value, result)) {
					return patterns[i].c.apply(thisObj, result);
				}
				result = [];
			}
			// no matches were made so we throw an exception.
			throw 'No match for: ' + value;
		};
	};
}();

fun.parameter = function () {
	function Parameter() {}
	return new Parameter();
}();

fun.wildcard = function () {
	function Wildcard() {}
	return new Wildcard();
}();
