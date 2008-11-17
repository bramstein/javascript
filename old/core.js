
/*!
 * Core - JavaScript Utilities
 *
 * Licensed under the new BSD License.
 * Copyright 2008, Bram Stein
 * All rights reserved.
 */

(function () {
/*
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

	function clone(obj) {
		function Clone() {}
		Clone.prototype = obj;
		return new Clone();
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
		clone: clone,
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
*/
/*
	Object.extend(Array.prototype, {
		append: function () {
			var i = 0, len = arguments.length;
			// interestingly enough, push() beats both
			// concat()---which was expected---and splice()
			for (; i < len; i += 1) {
				this.push.apply(this, arguments[i]);
			}
			return this;
		},
		clone: clone,
		top: function () {
			return this[this.length - 1];
		},
		equals: function (a) {
			return a && this.length === a.length && this.every(function (value, i) {
				// we did not extend Object.prototype, so we need to add an exception here.
				return (Object.isObject(value) && Object.equals(value, a[i])) ||
						value.equals(a[i]);
			});
		},
		contains: function (v) {
			return this.indexOf(v) !== -1;
		},
		filter: function (fun, thisObj) {
			var i = 0, r = [], val, len = this.length;
			thisObj = thisObj || this;
			for (; i < len; i += 1) {
				if (i in this) {
					val = this[i];
					if (fun.call(thisObj, val, i, this)) {
						r.push(val);
					}
				}
			}
			return r;
		},
		map: function (fun, thisObj) {
			var i = 0, r = [], len = this.length;
			thisObj = thisObj || this;
			for (; i < len; i += 1) {
				if (i in this) {
					r[i] = fun.call(thisObj, this[i], i, this);
				}
			}
			return r;
		},
		forEach: function (fun, thisObj) {
			var i = 0, len = this.length;
			thisObj = thisObj || this;
			for (; i < len; i += 1) {
				if (i in this) {
					fun.call(thisObj, this[i], i, this);
				}
			}
		},
		every: function (fun, thisObj) {
			var i = 0, len = this.length;
			thisObj = thisObj || this;
			for (; i < len; i += 1) {
				if (i in this && !fun.call(thisObj, this[i], i, this)) {
					return false;
				}
			}
			return true;
		},
		some: function (fun, thisObj) {
			var i = 0, len = this.length;
			thisObj = thisObj || this;
			for (; i < len; i += 1) {
				if (i in this && fun.call(thisObj, this[i], i, this)) {
					return true;
				}
			}
			return false;
		},
		indexOf: function (element, from) {
			var len = this.length;
			from = Number(from) || 0;
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			from = (from < 0) ? from + len : from;

			for (; from < len; from += 1) {
				if (from in this && this[from] === element) {
					return from;
				}
			}
			return -1;
		},
		lastIndexOf: function (element, from) {
			var len = this.length;
			from = Number(from) || (len - 1);
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			from = (from < 0) ? from + len : from;
			from = (from >= len) ? len : from;

			for (; from > -1; from -= 1) {
				if (from in this && this[from] === element) {
					return from;
				}
			}
			return -1;
		},
		reduce: function (fun, initial) {
			var i = 0, len = this.length;
			
			if (len === 0 && initial === undefined) {
				throw new TypeError();
			}
			if (initial === undefined) {
				do {
					if (i in this) {
						initial = this[i];
						i += 1;
						break;
					}
					i += 1;
					if (i >= len) {
						throw new TypeError();
					}
				}
				while (true);
			}
			for (; i < len; i += 1) {
				if (i in this) {
					initial = fun.call(null, initial, this[i], i, this);
				}
			}
			return initial;
		},
		reduceRight: function (fun, initial) {
			var len = this.length, i = len - 1;

			if (len === 0 && initial === undefined) {
				throw new TypeError();
			}
			if (initial === undefined) {
				do {
					if (i in this) {
						initial = this[i];
						i -= 1;
						break;
					}
					i -= 1;
					if (i < 0) {
						throw new TypeError();
					}
				}
				while (true);
			}
			for (; i >= 0; i -= 1) {
				if (i in this) {
					initial = fun.call(null, initial, this[i], i, this);
				}
			}
			return initial;
		}
	});
*/

	/*jslint eqeqeq: false */
/*
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
*/
	/*jslint eqeqeq: true */
/*
	['reduce', 'reduceRight', 'equals', 'contains', 'append', 'top', 'filter', 'map', 'forEach', 'some', 'every', 'indexOf', 'lastIndexOf', 'join', 'sort', 'reverse', 'push', 'pop', 'shift', 'unshift', 'splice', 'concat', 'slice'].forEach(function (func) {
		if (!(func in Array) && func in Array.prototype) {
			Array[func] = function (obj) {
				return this.prototype[func].apply(obj, Array.prototype.slice.call(arguments, 1));
			};
		}
	});
*/
/*
	Object.extend(Function.prototype, {
		bind: function (obj) {
			var method = this;
			return function () {
				return method.apply(obj, arguments);
			};
		},
		curry: function () {
			var method = this,
				args = Array.slice(arguments, 0);
			if (arguments.length === 0) {
				return this;
			}
			return function () {
				return method.apply(this, args.concat(Array.slice(arguments, 0)));
			};
		},

		defaults: function () {
			var method = this,
				args = arguments;
			return function () {
				var i = arguments.length, len = args.length;
				for (; i < len; i += 1) {
					arguments[i] = args[i];
				}
				arguments.length = i;
				return method.apply(this, arguments);
			};
		},
		chain: function (method) {
			method = method || this;
			return function () {
				var rv = method.apply(this, arguments);
				// This was changed because 'rv || this' also returns 
				// 'this' if the method returns a falsy value.
				return rv === undefined ? this : rv;
			};
		}
	});
*/
})();
