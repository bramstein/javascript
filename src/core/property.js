
/**
 * This creates a function that will add a getter
 * and setter method to any object. This allows
 * "classes" to be composed out of simpler parts.
 */
var property = function (propertyName, options) {
	return function (that) {
		var opts = options;

		that[propertyName] = function (value) {
			if (value !== undefined) {
				opts = Object.map(opts, function (currentValue, key) {	
					if (key in value) {
						return value[key];
					}
					else {
						return currentValue;
					}
				});
				return that;
			}
			else {
				return opts;
			}
		};
		return that;
	};
};
