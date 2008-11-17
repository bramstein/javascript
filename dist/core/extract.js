
/*global fun, buildExtractor*/
var extract = function () {

	function extractObject(pattern) {
		var subExtractors = Object.map(pattern, function (value) {
			return buildExtractor(value);
		});
		return function (value, bindings) {
			Object.forEach(value, function (v) {
				
			});
		};
	}

	function extractArray(pattern) {
	}

	function extractFunction(pattern) {
	}

	function buildExtractor(pattern) {
		if (pattern && (pattern === fun.parameter || pattern.constructor.name === fun.parameter().constructor.name)) {
			return function (value, bindings) {
				bindings.push(value);
				return bindings;
			};
		}
		else if (pattern && pattern.constructor === fun.wildcard.constructor) {
			return function (value, bindings) { 
				return bindings;
			};
		}
		else if (Object.isAtom(pattern)) {
			return function (value, bindings) {
				return bindings;
			};
		}
		else if (Object.isObject(pattern)) {
			return extractObject(pattern);
		}
		else if (Object.isArray(pattern)) {
			return extractArray(pattern);
		}
		else if (Object.isFunction(pattern)) {
			return extractFunction(pattern);
		}
	}

	return function (pattern) {
		return function (obj) {
			
		};
	};
}();


Object.extend(Object, {
	extract: extract
});
