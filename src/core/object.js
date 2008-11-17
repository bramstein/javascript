

(function () {
	Object.extend = function (obj) {
		var i = 1, key, len = arguments.length;
		for (; i < len; i += 1) {
			for (key in arguments[i]) {
				// make sure we do not override built-in functions
				if (arguments[i].hasOwnProperty(key) && (!obj[key] || obj.propertyIsEnumerable(key))) {
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
		equals: function (a, b) {
			var ca = 0;

			// Two objects are considered equal if: they have the same amount
			// of keys; the key names are equal, and the key values are equal.
			// If every property of a is in b and is equal, and both objects are
			// of the same size we know they are equal
			return a && b && Object.isObject(a) && Object.isObject(b) &&  Object.every(a, function (value, key) {
				ca += 1;
				return b.hasOwnProperty(key) && ((Object.isObject(value) && Object.equals(value, b[key])) || value.equals(b[key]));
			}) && ca === Object.reduce(b, function (rv) { 
				return (rv += 1); 
			}, 0);
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

	/*jslint eqeqeq: false */
	[Boolean, String, Function].forEach(function (value) {
		Object.extend(value.prototype, {
			equals: function (v) {
				return this == v;
			}
		});
	});

	Object.extend(Number.prototype, {
		equals: function (v) {
			return this == v || isNaN(this) && isNaN(v);
		}
	});

	Object.extend(Date.prototype, {
		equals: function (v) {
			return this.valueOf() === v.valueOf();
		}
	});

	Object.extend(RegExp.prototype, {
		equals: function (v) {
			return v instanceof RegExp && 
				this.source === v.source &&
				this.global === v.global &&
				this.ignoreCase === v.ignoreCase &&
				this.multiline === v.multiline;
		}
	});
	/*jslint eqeqeq: true */
})();
