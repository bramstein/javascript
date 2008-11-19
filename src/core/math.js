
/*global fun*/
(function () {
	function Interval(from, to) {
		if (! (this instanceof Interval)) {
			return new Interval(from, to);
		}
		this.from = from;
		this.to = to;
	}

	Object.extend(Interval.prototype, {
		negate: function () {
			return new Interval(-this.from, -this.to);
		},
		abs: function () {
			if (this.isEmpty()) {
				return new Interval(1, 0);
			}
			if (Math.isPositive(this.from)) {
				return new Interval(this.from, this.to);
			}
			if (Math.isNegative(this.to)) {
				return this.negate();
			}
			return new Interval(0, Math.max(-this.from, this.to));
		},
		add: function (x) {
			if (Object.isNumber(x)) {
				return new Interval(this.from + x, this.to + x);
			}
			else {
				return new Interval(this.from + x.from, this.to + x.to);
			}
		},
		subtract: function (x) {
			if (Object.isNumber(x)) {
				return new Interval(this.from - x, this.to - x);
			}
			else {
				return new Interval(this.from - x.from, this.to - x.to);
			}
		},
		multiply: function (x) {
			if (Object.isNumber(x)) {
				return new Interval(this.from * x, this.to * x);
			}
			else {
				var r = [this.from * x.from, this.from * x.to, this.to * x.from, this.to * x.to];
				return new Interval(Math.min.apply(null, r), Math.max.apply(null, r));
			}
		},
		divide: function (x) {
			if (Object.isNumber(x)) {
				return this.multiply(1 / x);
			}
			else {
				return this.multiply(new Interval(1 / x.to, 1 / x.from));
			}
		},
		isSubset: function (x) {
			return this.isEmpty() || (!this.isEmpty() && x.from <= this.from && this.to <= x.to);
		},
		isIn: function (x) {
			return !this.isEmpty() && this.from <= x && x <= this.to;
		},
		equals: function (x) {
			return (this.isEmpty() && x.isEmpty()) || (!x.isEmpty() && this.from === x.from && this.to === x.to);
		},
		isEmpty: function () {
			return !(this.from <= this.to);
		},
		distance: function (x) {
			return Math.max(Math.abs(this.from - x.from), Math.abs(this.to - x.to));
		},
		length: function () {
			return this.to - this.from;
		}
	});
	/*jslint white: true*/

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
		Interval: Interval
	});
})();
