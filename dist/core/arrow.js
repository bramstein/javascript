
/*global console*/
function Arrow(cps) {
	this.cps = cps;
}

function ProgressArrow() {
	if (! (this instanceof ProgressArrow)) {
		return new ProgressArrow();
	}
	this.cancellers = [];
	this.observers = [];
}

ProgressArrow.prototype = new Arrow(function (value, progressArrow, continuation) {
	this.observers.push(function (y) {
		continuation(y, progressArrow);
	});
});

/*
function Repeat(x) {
	return {
		Repeat: true,
		value: x
	};
}

function Done(x) {
	return {
		Done: true,
		value: x
	}
}
*/

Object.extend(Arrow.prototype, {
	Arrow: function () {
		// we override this method because we're
		// already an Arrow.
		return this;
	},
	next: function (g) {
		var f = this;
		// lift g into an Arrow
		g = g.Arrow();
		return new Arrow(function (value, progressArrow, continuation) {
			f.cps(value, progressArrow, function (y, q) {
				g.cps(y, q, continuation);
			});
		});
	},
	run: function (value, progressArrow) {
		// create a new ProgressArrow if one doesn't exist,
		// and call the continuation with the value, ProgressArrow
		// and an empty function
		progressArrow = progressArrow || new ProgressArrow();
		this.cps(value, progressArrow, function () {});
		return progressArrow;
	}/*,
	repeat: function(interval) {
		var f = this;
		interval = interval || 0;
		return new Arrow(function rep (x, p, k) {
			return f.cps(x, p, function (y, q) {
				var tid;
				if (y.Repeat) {
					function cancel() {
						clearTimeout(tid);
					}
					q.addCanceller(cancel);
					tid = setTimeout(function () {
						q.advance(cancel);
						rep(y.value, q, k);
					}, interval);
				}
				else if (y.Done) {
					k(y.value, q);
				}
				else {
					throw new TypeError('Function must return either Repeat or Done.');
				}
			});
		});
	},
	or: function (g) {
		var f = this;
		// lift g into an Arrow
		g = g.Arrow();
		return new Arrow(function (x, p, k) {
			var p1 = new ProgressArrow();
			var p2 = new ProgressArrow();

			p1.next(function () {
				p2.cancel();
				p2 = null;
			}).run();
			p2.next(function () {
				p1.cancel();
				p1 = null;
			}).run();

			function cancel() {
				if (p1) {
					p1.cancel();
				}
				if (p2) {
					p2.cancel();
				}
			}

			function join(y, q) {
				p.advance(cancel);
				k(y, q);
			}
			p.addCanceller(cancel);
			f.cps(x, p1, join);
			f.cps(x, p2, join);
		});
	}*/
});

Object.extend(Function.prototype, {
	// this lifts a function into an Arrow.
	Arrow: function () {
		var f = this;
		return new Arrow(function (value, progressArrow, continuation) {
			continuation(f(value), progressArrow);
		});
	},
	A: function () {
		return this;
	},
	next: function (g) {
		var f = this;
		g = g.A();
		return function (x) {
			return g(f(x));
		};
	}/*,
	// this lifts a function into an Arrow, and
	// calls the arrow's repeat method.
	repeat: function (interval) {
		return this.Arrow().repeat(interval);
	}*/
});

Object.extend(ProgressArrow.prototype, {
	addCanceller: function (canceller) {
		this.cancellers.push(canceller);
	},
	advance: function (canceller) {
		var index = this.cancellers.indexOf(canceller);
		if (index >= 0) {
			this.cancellers.splice(index, 1);
		}
		while (this.observers.length > 0) {
			this.observers.pop()();
		}
	},
	cancel: function () {
		while (this.cancellers.length > 0) {
			this.cancellers.pop()();
		}
	}
});
