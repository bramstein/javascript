/*!
 * JavaScript Core String v0.01
 *
 * Licensed under the new BSD License.
 * Copyright 2008-2009, Bram Stein
 * All rights reserved.
 */
(function () {

	Object.extend(String.prototype, {
		startsWith: function (str) {
			return this.indexOf(str) === 0;
		},
		endsWith: function (str) {
			var len = this.length - str.length;
			return len >= 0 && str.lastIndexOf(str, len) === len;
		},
		trim: function () {
			return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		}
	});
}());
