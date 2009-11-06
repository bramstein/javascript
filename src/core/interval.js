
/**
 * Interval Arithmetic
 *
 * Implements a simplified version of interval arithmetic without rounding 
 * functions. The result of this is that the inclusion property of interval 
 * arithmetic no longer holds. The upside is that calculations are a lot 
 * faster, especially when used in plotting graphs.
 *
 * Another oddity is a missing Interval constructor, meaning intervals are not
 * typed. The library uses duck-typing instead; if an object has a "from" and a
 * "to" property, it can be used with all interval methods. Again this is done
 * for performance reasons.
 */




function TInterval(from, to) {
	if (!(this instanceof TInterval)) {
		return new TInterval(from, to);
	}

	this.from = from || 0;
	this.to = to || 0;
}

(function () {
	var PI_from = 13176794 / (1 << 22),
		PI_to = 13176795 / (1 << 22),
		PI_twice = {from: PI_from * 2, to: PI_to * 2},
		PI_half = {from: PI_from / 2, to: PI_to / 2},
		emptyError = 'Interval is empty.';

	function powAux(v, j) {
		var v1 = v, l = 1;

		for (; l < j; l += 1) {
			v1 = v1 * v;
		}
		return v1;
	}

	Object.extend(TInterval, {
		EMPTY: new TInterval(0, -1),
		PI: {
			from: PI_from,
			to: PI_to
		},
		abs: function (a) {
			if (a.isEmpty()) {
				return new TInterval(1, 0);
			}
			if (Math.isPositive(a.from)) {
				return a;
			}
	        if (Math.isNegative(a.to)) {
	            return a.negate();
	        }
			return new TInterval(0, Math.max(-a.from, a.to));
	    },
		pow: function (x, i) {
			if (i === 0) {
				return TInterval.EMPTY;
			}
			else if (i < 0) {
				return TInterval.pow(x.invert(), -i);
			}

			if (x.from > 0) {
				return new TInterval(powAux(x.from, i), powAux(x.to, i));
			}
			if (x.to < 0) {
				if (Math.isEven(i)) {
					return new TInterval(powAux(-x.to, i), powAux(-x.from, i));
				}
				else {
					return new TInterval(-powAux(-x.from, i), -powAux(-x.to, i));
				}
			}

			if (Math.isEven(i)) {
				return new TInterval(0, powAux(Math.max(Math.abs(x.from), Math.abs(x.to)), i));
			}
			else {
				return new TInterval(-powAux(-x.from, i), powAux(x.to, i));
			}
	    },
		fmod: function (a, b) {
			var n = Math.floor(a.from / (Math.isNegative(a.from) ? b.from : b.to));
			return a.subtract(new TInterval(b.from * n, b.to * n));
		},
		cos: function (x) {
			var tmp, f, t;

			if (x.isEmpty()) {
				return new TInterval(0, 0);
			}

			tmp = TInterval.fmod(x, PI_twice);	

			if (tmp.width() >= PI_twice.from) {
				return new TInterval(-1, 1);
			}
			if (tmp.from >= PI_to) {
				return TInterval.cos(tmp.subtract(TInterval.PI)).negate();
			}
			f = tmp.from;
			t = tmp.to;
			if (t <= PI_from) {
				return new TInterval(Math.cos(t), Math.cos(f));
			}
			else if (t <= PI_twice.from) {
				return new TInterval(-1, Math.cos(Math.min(PI_twice.from - t, f)));
			}
			else {
				return new TInterval(-1, 1);
			}
		},
		sin: function (x) {
			return TInterval.cos(x.subtract(PI_half));
		},
	    sqrt: function (x) {
			if (Math.isNegative(x.from)) {
				throw new TypeError('Negative argument to sqrt()');
			}
			else {
				return new TInterval(Math.sqrt(x.from), Math.sqrt(x.to));
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
				return new TInterval(Math.log(x.from), Math.log(x.to));
	        }
	    },
		distance: function (a, b) {
			return Math.max(Math.abs(a.from - b.from), Math.abs(a.to - b.to));
		}
	});

	Object.extend(TInterval.prototype, {
		negate: function (a) {
			var f = -this.to,
				t = -this.from;

			this.from = f;
			this.to = t;
			return this;
		},
		add: function (b) {
			this.from += b.from;
			this.to += this.to;
			return this;
		},
		subtract: function (b) {
			this.from -= b.from;
			this.to -= b.to;
			return this;
		},
		multiply: function (b) {
			var r = [this.from * b.from, this.from * b.to, this.to * b.from, this.to * b.to];
			this.from = Math.min.apply(null, r);
			this.to = Math.max.apply(null, r);
			return this;
		},
		invert: function () {
			var f = 1 / this.to,
				t = 1 / this.from;
			this.from = f;
			this.to = t;
			return this;
		},
		divide: function (b) {
			return this.multiply(b.invert());
		},
		isEmpty: function () {
			return !(this.from <= this.to);
		},
		isSubsetOf: function (b) {
			return this.isEmpty() || (!this.isEmpty() && b.from <= this.from && this.to <= b.to);
		},
		contains: function (x) {
			return !this.isEmpty() && this.from <= x && x <= this.to;
		},
		width: function () {
			return this.to - this.from;
		}
	});
}());

var Interval = function () {
	var PI_from = 13176794 / (1 << 22),
		PI_to = 13176795 / (1 << 22),
		PI_twice = {from: PI_from * 2, to: PI_to * 2},
		PI_half = {from: PI_from / 2, to: PI_to / 2},
		emptyError = 'Interval is empty.';

	function powAux(v, j) {
		var v1 = v, l = 1;

		for (; l < j; l += 1) {
			v1 = v1 * v;
		}
		return v1;
	}

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
			throw new RangeError(emptyError);
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
			throw new RangeError(emptyError);
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
			throw new RangeError(emptyError);		
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
			throw new RangeError(emptyError);
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
				};
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
