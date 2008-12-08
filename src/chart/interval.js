

function Interval(from, to) {
	if (! (this instanceof Interval)) {
		return new Interval(from, to);
	}
	this.from = from;
	this.to = to;
}

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
