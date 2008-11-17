

(function () {
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

	['reduce', 'reduceRight', 'equals', 'contains', 'append', 'top', 'filter', 'map', 'forEach', 'some', 'every', 'indexOf', 'lastIndexOf', 'join', 'sort', 'reverse', 'push', 'pop', 'shift', 'unshift', 'splice', 'concat', 'slice'].forEach(function (func) {
		if (!(func in Array) && func in Array.prototype) {
			Array[func] = function (obj) {
				return this.prototype[func].apply(obj, Array.prototype.slice.call(arguments, 1));
			};
		}
	});
})();
