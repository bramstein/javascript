
/*global fun*/
(function () {
	Object.extend(Math, {
		ceilInt: function (x, precision) {
			var t = Math.pow(10, precision || 1);
			return Math.ceil(x / t) * t;
		},
		log10: function (x) {
			return Math.log(x) / Math.log(10);
		},
		digits: function (x) {
			return Math.floor(Math.log10(Math.abs(x !== 0 ? x : 1))) + 1;
		},
		characters: function (x) {
			return x.toString().length;
		},
		isNegative: function (x) {
			return x < 0;
		},
		isPositive: function (x) {
			return !Math.isNegative(x);
		},
		isEven: function (x) {
			return x % 2 === 0;
		},
		precision: function (x) {
			var decimals = 0;
			var difference;

			do {
				difference = Math.round(x);
				
				difference -= x;
				x = difference * 10;
				decimals += 1;
				console.log(difference);
			}
			while (difference !== 0);
/*
			tmp -= x;
			while (Math.round(x % 10) === 0) {
				x *= 10;
				decimals++;
			}
*/
			return decimals;
		}
	});
})();
