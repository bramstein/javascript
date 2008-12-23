
var canvas = function () {
	return function (graphics, options) {
		var that = {},
			ratio = 1,
			spacing = options.spacing || 5;
		
		that = bounds(that);
		that = insets(that);
		that = maximum(that);

		if (options.horizontalAxis !== undefined && options.verticalAxis !== undefined && options.ratio === undefined) {
			if (options.horizontalAxis.majorTicks.length !== 0 && options.verticalAxis.majorTicks.length !== 0) {
				ratio = options.verticalAxis.majorTicks.length / options.horizontalAxis.majorTicks.length;
			}
		}
		else if (options.verticalAxis === undefined && options.horizontalAxis === undefined && options.ratio !== undefined) {
			ratio = options.ratio;
		}

		Object.extend(that, {
			isVisible: function () {
				return true;
			},
			minimumSize: function () {
				var result = {
					width: 0,
					height: 0
				};
				if (options.verticalAxis && isNumeric(options.verticalAxis)) {
					options.verticalAxis.majorTicks.forEach(function (t) {
						result.height += graphics.textSize(t.toString()).height;
					});
					result.height += (options.verticalAxis.majorTicks.length - 1) * spacing;
				}

				if (options.horizontalAxis && isNumeric(options.horizontalAxis)) {
					options.horizontalAxis.majorTicks.forEach(function (t) {
						result.width += graphics.textSize(t.toString()).width;
					});
					result.width += (options.horizontalAxis.majorTicks.length - 1) * spacing;
				}

				return result;
			},
			drawAxes: function () {
				graphics.
				beginPath().
					moveTo(options.horizontalAxis.from, 0).
					lineTo(options.horizontalAxis.to, 0).
				closePath().stroke();
					
			},
			preferredSize: function () {
				return bounds();
			}
		});
		return that;

	}.defaults({});

/*
	function isNumeric(axis) {
		return !Object.isArray(axis) && axis.majorTicks && axis.from && axis.to && axis.minorTicks;
	}

	// The "length" of a categorical axis is the length of the spacing between major tick marks
	// of the opposite axis multiplied by the number of categories and a 1:1 spacing. This results
	// in roughly a 1:2 ratio for the chart.
	function calculateRatio(categoricalAxis, numericalAxis) {
		var tmp;
		if (numericalAxis.majorTicks.length !== 0) {
			tmp = (Interval.width(numericalAxis) / numericalAxis.majorTicks.length) * categoricalAxis.length * 2;
			return ratio = tmp / Interval.width(numericalAxis);
		}
		else {
			return 1;
		}
	}

	return function (graphics, options) {
		var that = {},
			ratio = 1,
			tmp = null, 
			spacing = options.spacing || 5;
		
		that = bounds(that);
		that = insets(that);
		that = maximum(that);

		if (options.horizontalAxis !== undefined && options.verticalAxis !== undefined && options.ratio === undefined) {
			// Both axes are numerical.
			if (isNumeric(options.horizontalAxis) && isNumeric(options.verticalAxis)) {
				ratio = Interval.width(options.verticalAxis) / Interval.width(options.horizontalAxis);			
			}
			// The horizontal axis is categorical and the vertical axis is numerical.
			else if (!isNumeric(options.horizontalAxis) && isNumeric(options.verticalAxis)) {
				ratio = calculateRatio(options.horizontalAxis, options.verticalAxis);
			}
			// The vertical axis is categorical and the horizontal axis is numerical.
			else {
				ratio = 1 / calculateRatio(options.verticalAxis, options.horizontalAxis);
			}
		}
		else if (options.verticalAxis === undefined && options.horizontalAxis === undefined && options.ratio !== undefined) {
			ratio = options.ratio;
		}

		Object.extend(that, {
			isVisible: function () {
				return true;
			},
			minimumSize: function () {
				var result = {
					width: 0,
					height: 0
				};
				if (options.verticalAxis && isNumeric(options.verticalAxis)) {
					options.verticalAxis.majorTicks.forEach(function (t) {
						result.height += graphics.textSize(t.toString()).height;
					});
					result.height += (options.verticalAxis.majorTicks.length - 1) * spacing;
				}

				if (options.horizontalAxis && isNumeric(options.horizontalAxis)) {
					options.horizontalAxis.majorTicks.forEach(function (t) {
						result.width += graphics.textSize(t.toString()).width;
					});
					result.width += (options.horizontalAxis.majorTicks.length - 1) * spacing;
				}

				return result;
			},
			drawAxes: function () {
				graphics.
				beginPath().
					moveTo(options.horizontalAxis.from, 0).
					lineTo(options.horizontalAxis.to, 0).
				closePath().stroke();
					
			},
			preferredSize: function () {
				return bounds();
			}
		});

		return that;
	}.defaults({});
*/
}();
