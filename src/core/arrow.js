
function Event() {
	this.listeners = [];
	this.newValue = function (v) {
		this.listeners.forEach(function (f) {
			f(v);
		});
	};
	return this;
}

function Behaviour(e, init) {
	var that = this;
	Event.call(this);
	this.valueNow = init;
	
	e.listeners.push(function (v) {
		if (v !== that.valueNow) {
			that.valueNow = v;
			that.newValue(v);
		}
	});
	return this;
}

function timer_e(m) {
	var e = new Event();
	window.setInterval(function () {
		e.newValue(new Date().getTime());
	}, m);
	return e;
}

function hold_e(e) {
	var held = new Event();
	var valueNow;

	e.listeners.push(function (v) {
		if (v !== valueNow) {
			valueNow = v;
			held.newValue(v);
		}
	});
	return held;
}

function lift_e(f, e) {
	var lifted = new Event();
	e.listeners.push(function (v) {
		lifted.newValue(f(v));
	});
	return lifted;
}

function lift_b(f, b) {
	return new Behaviour(lift_e(f, b), f(b.valueNow));
}

function showStream(e) {
	e.listeners.push(function (v) {
		console.log(e.valueNow);
		console.log(v);
	});
}
