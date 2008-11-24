

var coordinate = function () {
	// the polar axis is equivalent to the cartesian x-axis
	function toPolar(x, y) {
		return [Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2)), Math.atan2(x, y)];
	}

	function toCartesian(r, t) {
		return [r * Math.cos(t), r * Math.sin(t)];
	}

	// A 2d cartesian coordinate system has two axes, x and y
	// An axis represents an interval (range) of continuous numbers
	// in that interval. An axis has both minor and major tick marks
	// which mark discrete points in the interval. All tick marks should
	// fall within the interval.
	// 
	// Combined, the x and y axis represent a 2 dimensional data space in
	// which a function is analysed (plotted). Any data or points outside
	// the space defined by the x and y axis intervals is not plotted.
	// This space is called the user space.

	return {
		toPolar: toPolar,
		toCartesian: toCartesian
	};
}();
