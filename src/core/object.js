
/*!
 * JavaScript Core Object v0.51
 *
 * Licensed under the new BSD License.
 * Copyright 2008-2009, Bram Stein
 * All rights reserved.
 */
(function () {
	Object.extend = function (obj) {
		var i = 1, key, len = arguments.length;
		for (; i < len; i += 1) {
			for (key in arguments[i]) {
				// make sure we do not override built-in methods but toString and valueOf
				if (arguments[i].hasOwnProperty(key) && 
					(!obj[key] || obj.propertyIsEnumerable(key) || key === 'toString' || key === 'valueOf')) {
					obj[key] = arguments[i][key];
				}
			}
		}
		return obj;
	};

	function getInternalType(value) {
		return Object.prototype.toString.apply(value);
	}

	Object.extend(Object, {
		isAtom: function (value) {
			return ((typeof value !== 'object' || value === null) && 
				typeof value !== 'function') || 
				Object.isBoolean(value);
		},
		isNumber: function (value) {
			// perhaps NaN should not be considered a number..
			return typeof value === 'number';
		},
		isString: function (value) {
			return typeof value === 'string';
		},
		isBoolean: function (value) {
			return value !== null && 
				typeof value === 'boolean';
		},
		isArray: function (value) {
			return getInternalType(value) === '[object Array]';
		},
		isObject: function (value) {
			return getInternalType(value) === '[object Object]';
		},
		isFunction: function (value) {
			return typeof value === 'function';
		},
		filter: function (obj, fun, thisObj) {
			var key, r = {}, val;
			thisObj = thisObj || obj;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					val = obj[key];
					if (fun.call(thisObj, val, key, obj)) {
						r[key] = val;
					}
				}
			}
			return r;
		},
		map: function (obj, fun, thisObj) {
			var key, r = {};
			thisObj = thisObj || obj;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					r[key] = fun.call(thisObj, obj[key], key, obj);
				}
			}
			return r;
		},
		forEach: function (obj, fun, thisObj) {
			var key;
			thisObj = thisObj || obj;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					fun.call(thisObj, obj[key], key, obj);			
				}
			}
		},
		every: function (obj, fun, thisObj) {
			var key;
			thisObj = thisObj || obj;
			for (key in obj) {
				if (obj.hasOwnProperty(key) && !fun.call(thisObj, obj[key], key, obj)) {
					return false;
				}
			}
			return true;
		},
		some: function (obj, fun, thisObj) {
			var key;
			thisObj = thisObj || obj;
			for (key in obj) {
				if (obj.hasOwnProperty(key) && fun.call(thisObj, obj[key], key, obj)) {
					return true;
				}
			}
			return false;
		},
		isEmpty: function (obj) {
			return Object.every(obj, function (value, key) { 
				return !obj.hasOwnProperty(key); 
			});
		},
		clone: function (obj) {
			function Clone() {}
			Clone.prototype = obj;
			return new Clone();
		},
		reduce: function (obj, fun, initial) {
			var key, initialKey;

			if (Object.isEmpty(obj) && initial === undefined) {
				throw new TypeError();
			}
			if (initial === undefined) {
				for (key in obj) {
					if (obj.hasOwnProperty(key)) {
						initial = obj[key];
						initialKey = key;
						break;
					}
				}
			}
			for (key in obj) {
				if (obj.hasOwnProperty(key) && key !== initialKey) {
					initial = fun.call(null, initial, obj[key], key, obj);
				}
			}
			return initial;
		}
	});
})();
