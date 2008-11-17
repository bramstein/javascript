
Object.extend(Math.prototype, {
	roundInt: function (value, precision) {
		var t = Math.pow(10, precision);
		return Math.ceil(value / t) * t;
	}
});
