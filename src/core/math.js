
/*global fun*/
(function () {
	var decimalSeparator = (1.5).toString()[1];

	Object.extend(Math, {
		ceilInt: function (x, precision) {
			var t = Math.pow(10, precision || 1);
			return Math.ceil(x / t) * t;
		},
		truncate: function (x, precision) {
			var t = Math.pow(10, precision || 1);
			return Math.round(x * t) / t;
		},
		roundTo: function (x, precision) {
			return Math.round(x / precision) * precision;
		},
		log2: function (x) {
			return Math.log(x) / Math.LN2;
		},
		log10: function (x) {
			return Math.log(x) / Math.LN10;
		},
		isNegative: function (x) {
			return x < 0;
		},
		isPositive: function (x) {
			return x >= 0;
		},
		isEven: function (x) {
			return x % 2 === 0;
		},
		randomInt: function (from, to) {
			from -= 0.449;
			to += 0.499;
			return Math.round(from + (to - from) * Math.random());
		},

		// These loosely use the Mathematica definitions of accuracy and
		// precision. The decimal separator is based on the locale so
		// it is extracted from a known number and then used to parse
		// further numbers. If anyone knows an algebraic way of calculating
		// these numbers, I'd like to know.

		/**
		 * The number of signification decimal digits to the right
		 * of the decimal point in x.
		 */
		accuracy: function (x) {
			var str = x.toString(),
				position = str.indexOf(decimalSeparator);
			return position === -1 ? 0 : str.length -  (position + 1);
		},

		/**
		 * The total number of signification decimal digits in x.
		 */
		precision: function (x) {
			var str = Math.abs(x).toString(),
				position = str.indexOf(decimalSeparator);
			return position === -1 ? str.length : str.length - 1;
		},

		/**
		 * The number of signification decimal digits to the left of
		 * the decimal point in x.
		 */
		digits: function (x) {
			//return Math.floor(Math.log10(Math.abs(x !== 0 ? x : 1))) + 1;
			var str = Math.abs(x).toString(),
				position = str.indexOf(decimalSeparator);
			return position === -1 ? str.length : position;
		},

		/**
		 * The total number of characters in x.
		 */
		characters: function (x) {
			return x.toString().length;
		}
	});
})();
