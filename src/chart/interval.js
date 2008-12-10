var Interval = function () {
	var PI_from = 13176794 / (1 << 22),
		PI_to = 13176795 / (1 << 22),
		PI_twice = {from: PI_from * 2, to: PI_to * 2},
		PI_half = {from: PI_from / 2, to: PI_to / 2};

	return {
		PI: {
			from: PI_from,
			to: PI_to
		},
		neg: function (a) {
			return {
				from: -a.to,
				to: -a.from
			};
		},
		add: function (a, b) {
			return {
				from: a.from + b.from,
				to: a.to + b.to
			};
		},
		sub: function (a, b) {
			return {
				from: a.from - b.from,
				to: a.to - b.to
			};
		},
		mul: function (a, b) {
			var r = [a.from * b.from, a.from * b.to, a.to * b.from, a.to * b.to];
			return {
				from: Math.min.apply(null, r),
				to: Math.max.apply(null, r)
			};
		},
		inv: function (a) {
			return {
				from: 1 / a.to,
				to: 1 / a.from
			};
		},
		div: function (a, b) {
			return Interval.mul(a, Interval.inv(b));
		},
		empty: function (a) {
			return !(a.from <= a.to);
		},
		subset: function (a, b) {
			return Interval.empty(a) || (!Interval.empty(a) && b.from <= a.from && a.to <= b.to);
		},
		contains: function (a, x) {
			return !Interval.empty(a) && a.from <= x && x <= a.to;
		},
		eq: function (a, b) {
			return (Interval.empty(a) && Interval.empty(b)) || (!Interval.empty(b) && a.from === b.from && a.to === b.to);
		},
		lt: function (a, b) {
			if (!Interval.empty(a)) {
				if (a.to < b.from) {
					return true;
				}
				else if (a.from >= b.to) {
					return false;
				}
			}
			throw new RangeError("First value can not be empty.");
		},
		gt: function (a, b) {
			if (!Interval.empty(a)) {
				if (a.from > b.to) {
					return true;
				}
				else if (a.to <= b.from) {
					return false;
				}
			}
			throw new RangeError("First value can not be empty.");
		},
		le: function (a, b) {
			if (!Interval.empty(a)) {
				if (a.to <= b.from) {
					return true;
				}
				else if (a.from <= b.to) {
					return false;
				}
			}
			throw new RangeError("First value can not be empty.");		
		},
		ge: function (a, b) {
			if (!Interval.empty(a)) {
				if (a.from >= b.to) {
					return true;
				}
				else if (a.to < b.from) {
					return false;
				}
			}
			throw new RangeError("First value can not be empty.");
		},
		width: function (a) {
			return a.to - a.from;
		},
		distance: function (a, b) {
			return Math.max(Math.abs(a.from - b.from), Math.abs(a.to - b.to));
		},
		abs: function (a) {
			if (Interval.empty(a)) {
				return {
					from: 1, 
					to: 0
				};
			}
			if (Math.isPositive(a.from)) {
				return {
					from: a.from,
					to: a.to
				};
			}
	        if (Math.isNegative(a.to)) {
	            return Interval.neg(a);
	        }
			return {
				from: 0,
				to: Math.max(-a.from, a.to)
			};
	    },
		pow: function (x, i) {
			function powAux(v, j) {
				var v1 = v, l = 1;

				for (; l < j; l += 1) {
					v1 = v1 * v;
				}
				return v1;
			}

			if (i === 0) {
				return {
					from: 0,
					to: 0
				};
			}
			else if (i < 0) {
				return Interval.pow(Interval.inv(x), -i);
			}

			if (x.from > 0) {
				return {
					from: powAux(x.from, i),
					to: powAux(x.to, i)
				};
			}
			if (x.to < 0) {
				if (Math.isEven(i)) {
					return {
						from: powAux(-x.to, i),
						to: powAux(-x.from, i)
					};
				}
				else {
					return {
						from: -powAux(-x.from, i),
						to: -powAux(-x.to, i)
					};
				}
			}

			if (Math.isEven(i)) {
				return {
					from: 0,
					to: powAux(Math.max(Math.abs(x.from), Math.abs(x.to)), i)
				};
			}
			else {
				return {
					from: -powAux(-x.from, i),
					to: powAux(x.to, i)
				}
			}
	    },
		fmod: function (a, b) {
			var n = Math.floor(a.from / (Math.isNegative(a.from) ? b.from : b.to));
			return Interval.sub(a, {from: b.from * n, to: b.to * n});
		},
		cos: function (x) {
			var tmp, f, t;

			if (Interval.empty(x)) {
				return {
					from: 0,
					to: 0
				};
			}

			tmp = Interval.fmod(x, PI_twice);	

			if (Interval.width(tmp) >= PI_twice.from) {
				return {
					from: -1,
					to: 1
				};
			}
			if (tmp.from >= PI_to) {
				return Interval.neg(Interval.cos(Interval.sub(tmp, Interval.PI)));
			}
			f = tmp.from;
			t = tmp.to;
			if (t <= PI_from) {
				return {
					from: Math.cos(t),
					to: Math.cos(f)
				};
			}
			else if (t <= PI_twice.from) {
				return {
					from: -1,
					to: Math.cos(Math.min(PI_twice.from - t, f))
				};
			}
			else {
				return {
					from: -1,
					to: 1
				};
			}
		},
		sin: function (x) {
			return Interval.cos(Interval.sub(x, PI_half));
		},
	    sqrt: function (x) {
			if (Math.isNegative(x.from)) {
				throw new TypeError('Negative argument to sqrt()');
			}
			else {
				return {
					from: Math.sqrt(x.from),
					to: Math.sqrt(x.to)
				};
			}
	    },
	    exp: function (x) {
			var r = {
				from: Math.exp(x.from),
				to: Math.exp(x.to)
			};
	        if (Math.isNegative(r.from)) {
				r.from = 0;
	        }
	        return r;
	    },
	    log: function (x) {
	        if (Math.isNegative(x.from)) {
				throw new TypeError('Negative argument to ln()');
	        }
	        else {
				return {
					from: Math.log(x.from), 
					to: Math.log(x.to)
				};
	        }
	    }
	};
}();
/*
(function () {
	var PI_from = 13176794 / (1 << 22),
		PI_to = 13176795 / (1 << 22),
		PI_twice = new Interval(PI_from * 2, PI_to * 2),
		PI_half = new Interval(PI_from / 2, PI_to / 2);

	Object.extend(Interval.prototype, {
		toString: function () {
			return "(" + this.from + ", " + this.to + ")";
		},
		negate: function () {
			return new Interval(-this.to, -this.from);
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
			return this;
		},
		invert: function (x) {
			return new Interval(1 / this.to, 1 / this.from);
		},
		divide: function (x) {
			if (Object.isNumber(x)) {
				return this.multiply(1 / x);
			}
			else {
				return this.multiply(x.invert());
			}
		},
		hasSubset: function (x) {
			return this.isEmpty() || (!this.isEmpty() && x.from <= this.from && this.to <= x.to);
		},
		has: function (x) {
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
		width: function () {
			return this.to - this.from;
		}
	});

	Object.extend(Interval, {
		PI: new Interval(PI_from, PI_to),
		abs: function (x) {
	    	if (x.isEmpty()) {
	    		return new Interval(1, 0);
	        }
	        if (Math.isPositive(x.from)) {
	            return new Interval(x.from, x.to);
	        }
	        if (Math.isNegative(x.to)) {
	            return x.negate();
	        }
	        return new Interval(0, Math.max(-x.from, x.to));
	    },
		pow: function (x, i) {
			function powAux(v, j) {
				var v1 = v, l = 1;

				for (; l < j; l += 1) {
					v1 = v1 * v;
				}
				return v1;
			}

			if (i === 0) {
				return new Interval(0, 0);
			}
			else if (i < 0) {
				return Interval.pow(x.invert(), -i);
			}

			if (x.from > 0) {
				return new Interval(powAux(x.from, i), powAux(x.to, i));	
			}
			if (x.to < 0) {
				if (Math.isEven(i)) {
					return new Interval(powAux(-x.to, i), powAux(-x.from, i));
				}
				else {
					return new Interval(-powAux(-x.from, i), -powAux(-x.to, i));
				}
			}

			if (Math.isEven(i)) {
				return new Interval(0, powAux(Math.max(Math.abs(x.from), Math.abs(x.to)), i));
			}
			else {
				return new Interval(-powAux(-x.from, i), powAux(x.to, i));
			}
	    },
		fmod: function (x, y) {
			var n;
		//	if (Object.isNumber(y)) {
		//		n = Math.floor(x.from / y);
		//		return x.subtract(y * n);
		//	}
		//	else {
			n = Math.floor(x.from / (Math.isNegative(x.from) ? y.from : y.to));
			return x.subtract(y.multiply(n));
		//	}
		},
		cos: function (x) {
			var tmp, f, t;

			if (x.isEmpty()) {
				return new Interval(0, 0);
			}

			tmp = Interval.fmod(x, PI_twice);	

			if (tmp.width() >= PI_twice.from) {
				return new Interval(-1, 1);
			}
			if (tmp.from >= PI_to) {
				return Interval.cos(tmp.subtract(Interval.PI)).negate();
			}
			f = tmp.from;
			t = tmp.to;
			if (t <= PI_from) {
				return new Interval(Math.cos(t), Math.cos(f));
			}
			else if (t <= PI_twice.from) {
				return new Interval(-1, Math.cos(Math.min(PI_twice.from - t, f)));
			}
			else {
				return new Interval(-1, 1);
			}
		},
		sin: function (x) {
			return Interval.cos(x.subtract(PI_half));
		},
	    sqrt: function (x) {
			if (Math.isNegative(x.from)) {
				throw new TypeError('Negative argument to sqrt()');
			}
			else {
				return new Interval(Math.sqrt(x.from), Math.sqrt(x.to));
			}
	    },
	    exp: function (x) {
	        var r = new Interval(Math.exp(x.from), Math.exp(x.to));
	        if (Math.isNegative(r.from)) {
				r.from = 0;
	        }
	        return r;
	    },
	    log: function (x) {
	        if (Math.isNegative(this.from)) {
				throw new TypeError('Negative argument to ln()');
	        }
	        else {
				return new Interval(Math.log(x.from), Math.log(x.to));
	        }
	    }
	});
})();
*/
