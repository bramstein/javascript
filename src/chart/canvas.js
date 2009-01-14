
/*global bounds, insets, maximum, Interval*/
var canvas = function () {
	return function (graphics, options) {
		var that = {},
			spacing = {
				horizontal: options.hspace || 10,
				vertical: options.vspace || 5
			},
			ratio = {
				horizontal: 1,
				vertical: 1
			},
			grid = options.grid && options.grid === true || false;

		if (options.horizontalAxis !== undefined && options.verticalAxis !== undefined && options.horizontalAxis.majorTicks.length !== 0 && options.verticalAxis.majorTicks.length !== 0) {

			if (options.ratio === undefined) {
				ratio.horizontal = options.horizontalAxis.majorTicks.length;
				ratio.vertical = options.verticalAxis.majorTicks.length;
			}
			else {
				ratio.horizontal = (options.ratio.horizontal * options.horizontalAxis.majorTicks.length);
				ratio.vertical = (options.ratio.vertical * options.verticalAxis.majorTicks.length);
			}
		}
		else if (options.horizontalAxis !== undefined || options.verticalAxis !== undefined) {
			if (options.horizontalAxis === undefined) {
				ratio.horizontal = options.verticalAxis.majorTicks.length;
				ratio.vertical = options.verticalAxis.majorTicks.length;
			}
			else {
				ratio.horizontal = options.horizontalAxis.majorTicks.length;
				ratio.vertical = options.horizontalAxis.majorTicks.length;				
			}
		}

		that = bounds(that);
		that = insets(that);
		that = maximum(that);

		Object.extend(that, {
			doLayout: function () {
			},
			isVisible: function () {
				return true;
			},
			preferredSize: function () {
				var preferred = that.minimumSize(),
					size = Math.max(preferred.width / ratio.horizontal, preferred.height / ratio.vertical);

				preferred.width = size * ratio.horizontal;
				preferred.height = size * ratio.vertical;

				return preferred;
			},
			minimumSize: function () {
				var result = {
					width: 0,
					height: 0
				};
				if (options.verticalAxis) {
					options.verticalAxis.majorTicks.forEach(function (t) {
						result.height = Math.max(graphics.textSize(t).height, result.height);
					});
					result.height *= options.verticalAxis.majorTicks.length;
					result.height += (options.verticalAxis.majorTicks.length - 1) * spacing['vertical'];
				}

				if (options.horizontalAxis) {
					options.horizontalAxis.majorTicks.forEach(function (t) {
						result.width = Math.max(graphics.textSize(t).width, result.width);
					});
					result.width *= options.horizontalAxis.majorTicks.length;
					result.width += (options.horizontalAxis.majorTicks.length - 1) * spacing['horizontal'];
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
/*
					graphics.
						beginPath().
							moveTo(range['horizontal'].from, range['vertical'].from).
							lineTo(range['horizontal'].to, range['vertical'].from).
						endPath().
					stroke(defaults.color.grid);
*/
					graphics.
						beginPath().
							moveTo(range['horizontal'].from, offset['horizontal']).
							lineTo(range['horizontal'].to, offset['horizontal']).
						endPath().
					stroke(defaults.color.axes);

					options.horizontalAxis.majorTicks.forEach(function (s, i, a) {
						var size = (Interval.width(range['horizontal']) / (a.length));

						if (typeof s === 'number' && !isNaN(s)) {


							if (s !== offset['vertical'] || range['vertical'].from >= 0 || range['vertical'].to <= 0) {
								if (grid) {
									graphics.beginPath().
										moveTo(s, range['vertical'].from).
										lineTo(s, range['vertical'].to).
									endPath().
									stroke(defaults.color.grid);
								}
								graphics.beginPath().
									moveTo(s, offset['horizontal']).
									lineTo(s, offset['horizontal'] + tick['horizontal'] * -sign['horizontal']).
								endPath().
								stroke(defaults.color.axes).
								text(s, offset['horizontal'] + (tick['horizontal'] * 1.5) * -sign['horizontal'], s, {
									textAlign: 'center', 
									textBaseLine: (Math.isNegative(sign['horizontal']) ? 'bottom' : 'top'),
									background: defaults.color.background
								}).
								fill(defaults.color.text);
							}
						}
						else {
							graphics.
								text(size * i + (size / 2), range['vertical'].from + (tick['horizontal'] * 1.5) * -1, s, {
									textAlign: 'center', 
									textBaseLine: 'top',
									background: defaults.color.background
								}).
								fill(defaults.color.text);
						}
					});

					options.horizontalAxis.minorTicks.forEach(function (i) {
						if (typeof i === 'number' && !isNaN(i) && i !== 0) {
							graphics.beginPath().
								moveTo(i, offset['horizontal']).
								lineTo(i, offset['horizontal'] + (tick['horizontal'] * 0.5) * -sign['horizontal']).
							endPath().
							stroke(defaults.color.axes);
						}
					});

/*					
					graphics.
						beginPath().
							moveTo(range['horizontal'].from, range['vertical'].from).
							lineTo(range['horizontal'].from, range['vertical'].to).
						endPath().
					stroke(defaults.color.grid);
*/
					graphics.
						beginPath().
							moveTo(offset['vertical'], range['vertical'].from).
							lineTo(offset['vertical'], range['vertical'].to).
						endPath().
					stroke(defaults.color.axes);

					options.verticalAxis.majorTicks.forEach(function (s, i, a) {
						var size = (Interval.width(range['vertical']) / (a.length));

						if (typeof s === 'number' && !isNaN(s)) {
							// don't draw the tick or the label where the axes cross
							if (s !== offset['horizontal'] || range['horizontal'].from >= 0 || range['horizontal'].to <= 0) {
								if (grid) {
									graphics.beginPath().
										moveTo(range['horizontal'].from, s).
										lineTo(range['horizontal'].to, s).
									endPath().
									stroke(defaults.color.grid);
								}

								graphics.beginPath().
									moveTo(offset['vertical'], s).
									lineTo(offset['vertical'] + tick['vertical'] * -sign['vertical'], s).
								endPath().
								stroke(defaults.color.axes).
								text(
									offset['vertical'] + (tick['vertical'] * 1.5) * -sign['vertical'], 
									s, 
									s, {
										textAlign: (Math.isNegative(sign['vertical']) ? 'left' : 'right'), 
										textBaseLine: 'middle',
										background: defaults.color.background
									}
								).
								fill(defaults.color.text);
							}
						}
						else {
							graphics.
								text(range['horizontal'].from + (tick['vertical'] * 1.5) * -1, size * i + (size / 2), s, {
									textAlign: 'right', 
									textBaseLine: 'middle',
									background: defaults.color.background
								}).
								fill(defaults.color.text);
						}
					});

					options.verticalAxis.minorTicks.forEach(function (i) {
						if (typeof i === 'number' && !isNaN(i) && i !== 0) {
							graphics.beginPath().
								moveTo(offset['vertical'], i).
								lineTo(offset['vertical'] + (tick['vertical'] * 0.5) * -sign['vertical'], i).
							endPath().
							stroke(defaults.color.axes);
						}
					});

					graphics.closeViewport();
				}
			}
		});
		return that;

	}.defaults({});
}();
