
/*global fun*/
(function () {
	var $ = fun.parameter;

	function Interval(from, to) {
		if (! (this instanceof Interval)) {
			return new Interval(from, to);
		}
		this.from = from;
		this.to = to;
	}

	/*jslint white: false*/
	Object.extend(Interval.prototype, {
		add: fun(
			[Interval($, $), function (f, t) {
				return Interval(this.from + f, this.to + t);
			}],
			[Number, function (x) {
				return Interval(this.from + x, this.to + x);
			}]
		),
		subtract: fun(
			[Interval($, $), function (f, t) {
				return Interval(this.from - t, this.to - f);
			}],
			[Number, function (x) {
				return Interval(this.from - x, this.to - x);
			}]
		),
		multiply: fun(
			[Interval($, $), function (f, t) {
				var r = [this.from * f, this.from * t, this.to * f, this.to * t];
				return Interval(Math.min.apply(null, r), Math.max.apply(null, r));
			}],
			[Number, function (x) {
				return Interval(this.from * x, this.to * x);
			}]
		),
		divide: fun(
			[Interval($, $), function (f, t) {
				return this.multiply(Interval(1 / t, 1 / f));
			}],
			[Number, function (x) {
				return this.multiply(1 / x);
			}]
		),
		isIn: fun(
			[Interval($, $), function (f, t) {
				return f <= this.from && this.to <= t;
			}],
			[Number, function (x) {
				return this.from <= x && x <= this.to;
			}]
		),
		equals: function (i) {
			return this.from === i.from && this.to === i.to;	
		},
		isEmpty: function () {
			return !(this.from <= this.to);
		},
		distance: function (i) {
			return Math.max(Math.abs(this.from - i.from), Math.abs(this.to - i.to));
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
