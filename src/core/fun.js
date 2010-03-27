/**
 * @preserve jFun - JavaScript Pattern Matching v0.12
 *
 * Licensed under the new BSD License.
 * Copyright 2008, Bram Stein
 * All rights reserved.
 */
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
			subMatches = Object.map(patternObject, function (value) {
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
		// A parameter can either be a function, or the result of invoking that
		// function so we need to check for both.
		if (pattern && (pattern === fun.parameter || pattern.constructor.name === fun.parameter().constructor.name)) {
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
		var patterns = Array.slice(arguments, 0).map(function (value, i) {
				var len = value.length;
				return {
					m: buildMatch(value.slice(0, len - 1)), 
					c: value[len - 1]
				};
			});	

		return function () {
			var value = Array.slice(arguments, 0), result = [], i = 0, len = patterns.length;

			for (; i < len; i += 1) {
				if (patterns[i].m(value, result)) {
					return patterns[i].c.apply(this, result);
				}
				result = [];
			}
			// no matches were made so we throw an exception.
			throw 'No match for: ' + value;
		};
	};
}();

/**
 * Parameter
 */
fun.parameter = function (name, orElse) {
	function Parameter(n, o) { 
		this.name = n;
		this.orElse = o;
	}
	return new Parameter(name, orElse);
};

fun.wildcard = function () {
	function Wildcard() {}
	return new Wildcard();
}();

/**
 * Extract
 */
var extract = function () {
	function bindVariables(pattern, value, result) {
		if (pattern && pattern.constructor.name === fun.parameter().constructor.name) {
			result[pattern.name] = pattern.orElse ? value || pattern.orElse : value;
		}
		else if (pattern && pattern.constructor === fun.wildcard.constructor) {
			// we ignore wildcards
		}
		// it would be nice if we could safely extend Object.prototype
		// and collapse the code for Object and Array into one.
		else if (Object.isObject(pattern) && Object.isObject(value)) {
			Object.forEach(pattern, function (v, key) {
				if (key in value) {
					bindVariables(v, value[key], result);
				}
				else if (v.hasOwnProperty('orElse')) {
					result[v.name] = v.orElse;
				}
			});
		}
		else if (Object.isArray(pattern) && Object.isArray(value)) {
			Array.forEach(pattern, function (v, key) {
				if (key in value) {
					bindVariables(v, value[key], result);
				}
				else if (v.hasOwnProperty('orElse')) {
					result[v.name] = v.orElse;
				}
			});
		}
		else if (pattern !== undefined) {
			throw new TypeError('The pattern should only contain variables.');
		}
	}

	return function (pattern, value, result) {
		result = result || {};
		bindVariables(pattern, value, result);
		return result;
	};
}();
