/**
 * @preserve JavaScript Core Function v0.15
 *
 * Licensed under the new BSD License.
 * Copyright 2008-2009, Bram Stein
 * All rights reserved.
 */
(function () {
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
		/**
		 * Adapted from "Default arguments for functions."
		 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
		 * Licensed under BSD (http://www.opensource.org/licenses/bsd-license.php)
		 * Date: 1/9/2008 
		 *//*
		defaults: function () {
			var method = this,
				args = arguments;
			return function () {
				var i = arguments.length,
					len = args.length;
				for (; i < len; i += 1) {
					arguments[i] = args[i];
				}
				return method.apply(this, Array.slice(arguments, 0, i));
			};
		},*/
		/**
		 * Adapted from Mathieu 'p01' Henri - http://www.p01.org/
		 */
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
}());
