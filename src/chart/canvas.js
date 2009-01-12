
/*global bounds, insets, maximum, Interval*/
var canvas = function () {
	return function (graphics, options) {
		var that = {},
			spacing = options.spacing || 10;
		
		that = bounds(that);
		that = insets(that);
		that = maximum(that);

		Object.extend(that, {
			doLayout: function () {
			},
			isVisible: function () {
				return true;
			},
			minimumSize: function () {
				var result = {
					width: 0,
					height: 0
				};
				if (options.verticalAxis) {
					options.verticalAxis.majorTicks.forEach(function (t) {
						result.height += graphics.textSize(t).height;
					});
					result.height += (options.verticalAxis.majorTicks.length - 1) * spacing;
				}

				if (options.horizontalAxis) {
					options.horizontalAxis.majorTicks.forEach(function (t) {
						result.width += graphics.textSize(t).width;
					});
					result.width += (options.horizontalAxis.majorTicks.length - 1) * spacing;
				}
				return result;
			},
			draw: function () {
				var b = that.bounds(),
					tick = {len: 0.016, horizontal: 0, vertical: 0},
					axes = ['horizontal', 'vertical'],
					offset = {
						horizontal: 0,
						vertical: 0
					},
					range = { 
						horizontal: {from: 0, to: 1},
						vertical: {from: 0, to: 1}
					},
					sign = {
						horizontal: 1,
						vertical: 1
					};

				if (options.polarAxis !== undefined) {
				}
				else if (options.horizontalAxis !== undefined && options.verticalAxis !== undefined) {
					axes.forEach(function (n) {
						range[n] = !Interval.empty(options[n + 'Axis']) ? {from: options[n + 'Axis'].from, to: options[n + 'Axis'].to} : range[n];
					});
					// Adjusted for the aspect ratio (height / width) where the height always equals 1.
					tick['horizontal'] = (Interval.width(range.vertical) * tick.len);
					tick['vertical'] = (Interval.width(range.horizontal) * tick.len) * (b.height / b.width);

					sign['horizontal'] = range['vertical'].to <= 0 ? -1 : 1;
					sign['vertical'] = range['horizontal'].to <= 0 ? -1 : 1;
	
					// If the axes do not start at zero or contain zero,
					// this will adjust the opposite axis to draw at the
					// correct location.
					if (!Interval.contains(range['horizontal'], 0)) {
						if (range['horizontal'].to < 0) {
							offset['vertical'] = range['horizontal'].to;
						}
						else if (range['horizontal'].from > 0) {
							offset['vertical'] = range['horizontal'].from;
						}
					}

					if (!Interval.contains(range['vertical'], 0)) {
						if (range['vertical'].to < 0) {
							offset['horizontal'] = range['vertical'].to;
						}
						else if (range['vertical'].from > 0) {
							offset['horizontal'] = range['vertical'].from;
						}
					}

					graphics.beginViewport(b.x, b.y, b.width, b.height, range.horizontal, range.vertical);

					graphics.
						beginPath().
							moveTo(range['horizontal'].from, offset['horizontal']).
							lineTo(range['horizontal'].to, offset['horizontal']).
						endPath().
					stroke();

					options.horizontalAxis.majorTicks.forEach(function (s, i, a) {
						var size = (Interval.width(range['horizontal']) / (a.length));

						if (typeof s === 'number' && !isNaN(s)) {
							if (s !== offset['vertical'] || options.verticalAxis.from >= offset['vertical'] || options.verticalAxis.to <= offset['vertical']) {
								graphics.beginPath().
									moveTo(s, offset['horizontal']).
									lineTo(s, offset['horizontal'] + tick['horizontal'] * -sign['horizontal']).
								endPath().
								stroke().
								text(s, offset['horizontal'] + (tick['horizontal'] * 2) * -sign['horizontal'], s, {
									textAlign: 'center', 
									textBaseLine: (Math.isNegative(sign['horizontal']) ? 'bottom' : 'top')
								}).
								fill();
							}
						}
						else {
							graphics.
								text(size * i + (size / 2), offset['horizontal'] + (tick['horizontal'] * 2) * -sign['horizontal'], s, {
									textAlign: 'center', 
									textBaseLine: (Math.isNegative(sign['horizontal']) ? 'bottom' : 'top')
								}).
								fill();
						}
					});

					options.horizontalAxis.minorTicks.forEach(function (i) {
						if (typeof i === 'number' && !isNaN(i) && i !== 0) {
							graphics.beginPath().
								moveTo(i, offset['horizontal']).
								lineTo(i, offset['horizontal'] + (tick['horizontal'] * 0.5) * -sign['horizontal']).
							endPath().
							stroke();
						}
					});


					graphics.
						beginPath().
							moveTo(offset['vertical'], range['vertical'].from).
							lineTo(offset['vertical'], range['vertical'].to).
						endPath().
					stroke();

					options.verticalAxis.majorTicks.forEach(function (s, i, a) {
						var size = (Interval.width(range['vertical']) / (a.length));

						if (typeof s === 'number' && !isNaN(s)) {
							// don't draw the tick or the label where the axes cross
							if (s !== offset['horizontal'] || options.horizontalAxis.from >= offset['horizontal'] || options.horizontalAxis.to <= offset['horizontal']) {
								graphics.beginPath().
									moveTo(offset['vertical'], s).
									lineTo(offset['vertical'] + tick['vertical'] * -sign['vertical'], s).
								endPath().
								stroke().
								text(
									offset['vertical'] + (tick['vertical'] * 2) * -sign['vertical'], 
									s, 
									s, {
										textAlign: (Math.isNegative(sign['vertical']) ? 'left' : 'right'), 
										textBaseLine: 'middle'
									}
								).
								fill();
							}
						}
						else {
							graphics.
								text(offset['vertical'] + (tick['vertical'] * 2) * -sign['vertical'], size * i + (size / 2), s, {
									textAlign: (Math.isNegative(sign['vertical']) ? 'left' : 'right'), 
									textBaseLine: 'middle'
								}).
								fill();
						}
					});

					options.verticalAxis.minorTicks.forEach(function (i) {
						if (typeof i === 'number' && !isNaN(i) && i !== 0) {
							graphics.beginPath().
								moveTo(offset['vertical'], i).
								lineTo(offset['vertical'] + (tick['vertical'] * 0.5) * -sign['vertical'], i).
							endPath().
							stroke();
						}
					});

					graphics.closeViewport();
				}
			},
			preferredSize: function () {
				return bounds();
			}
		});
		return that;

	}.defaults({});
}();
