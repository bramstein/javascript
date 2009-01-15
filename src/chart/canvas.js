
/*global bounds, insets, maximum, Interval*/
var canvas = function () {
	return function (graphics, options) {
		var that = {},

			// The minimum amount of spacing between labels
			spacing = {
				horizontal: options.hspace || 10,
				vertical: options.vspace || 5
			},

			// The aspect ratio of the data area of the chart
			ratio = {
				horizontal: (options.ratio && options.ratio.horizontal) || 1,
				vertical: (options.ratio && options.ratio.vertical) || 1
			},

			// Enables or disables drawing of a grid
			grid = options.grid && options.grid === true || false,

			// Axis tick mark lengths
			tick = {
				len: 0.016,
				horizontal: 0,
				vertical: 0
			},

			// Available axes
			axes = {
				horizontal: undefined,
				vertical: undefined,
				polar: undefined
			},

			// An offset to draw axes that do not start at zero
			offset = {
				horizontal: 0,
				vertical: 0
			},

			// The horizontal and vertical data range
			range = { 
				horizontal: {
					from: 0,
					to: 1
				},
				vertical: {
					from: 0,
					to: 1
				}
			},

			// Determines whether an axis is negative or positive.
			sign = {
				horizontal: 1,
				vertical: 1
			},
	
			// True if the chart is cartesian, if false, it is considered
			// to be a polar chart.
			cartesian = true,

			// Some variables to generalize axis code
			allAxes = ['horizontal', 'vertical', 'polar'],
			cartesianAxes = ['horizontal', 'vertical'],
			cartesianOppositeAxes = [].append(cartesianAxes).reverse();

		// Mix-in the following properties:
		that = bounds(that);
		that = insets(that);
		that = maximum(that);

		that.insets({left: 0, bottom: 0, top: 0, right: 0});

		allAxes.forEach(function (n) {
			axes[n] = (options[n + 'Axis'] !== undefined && options[n + 'Axis']) || undefined;
		});

		cartesian = axes.polar === undefined;

		if (cartesian) {
			// Calculate the correct aspect ratio
			if (axes.horizontal && axes.vertical) {
				ratio.horizontal *= axes.horizontal.majorTicks.length;
				ratio.vertical *= axes.vertical.majorTicks.length;
			}
			else if (axes.horizontal && !axes.vertical) {
				ratio.horizontal *= axes.horizontal.majorTicks.length;
				ratio.vertical *= axes.horizontal.majorTicks.length;
			}
			else if (!axes.horizontal && axes.vertical) {
				ratio.horizontal *= axes.vertical.majorTicks.length;
				ratio.vertical *= axes.vertical.majorTicks.length;
			}

			// The horizontal and vertical range equal the range of 
			// numerical axes, or 0..1 for categorical axes.
			cartesianAxes.forEach(function (n) {
				range[n] = !Interval.empty(options[n + 'Axis']) ? {from: options[n + 'Axis'].from, to: options[n + 'Axis'].to, numerical: true} : range[n];
			});

			cartesianAxes.forEach(function (axis, i) {
				var opposite = cartesianOppositeAxes[i];

				// The sign determines on which side of the axis the
				// labels are drawn.
				sign[axis] = range[opposite].to <= 0 ? -1 : 1;

				// If the axes do not start at zero or contain zero,
				// this will adjust the opposite axis to draw at the
				// correct location.
				if (!Interval.contains(range[axis], 0)) {
					offset[opposite] = range[axis].to < 0 ? range[axis].to : range[axis].from;
				}
			});
		}
		else {
			// TODO: polar...
		}

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
					},
					maxHeight = 0,
					maxWidth = 0;
				if (options.verticalAxis) {
					options.verticalAxis.majorTicks.forEach(function (t) {
						maxHeight = Math.max(graphics.textSize(t).height, maxHeight);
					});
					result.height = options.verticalAxis.majorTicks.length * maxHeight;
					result.height += (options.verticalAxis.majorTicks.length - 1) * spacing['vertical'];
				}

				if (options.horizontalAxis) {
					options.horizontalAxis.majorTicks.forEach(function (t) {
						maxWidth = Math.max(graphics.textSize(t).width, maxWidth);
					});
					result.width = options.horizontalAxis.majorTicks.length * maxWidth;
					result.width += (options.horizontalAxis.majorTicks.length - 1) * spacing['horizontal'];
				}
				result.width += that.insets().left + that.insets().right;
				result.height += that.insets().bottom + that.insets().top;

				return result;
			},
			drawPolarAxes: function (g) {
			},
			drawCartesianAxes: function (g) {
				var b = that.bounds();

				// Adjust the tick size using the aspect ratio (height / width).
				tick['horizontal'] = (Interval.width(range.vertical) * tick.len);
				tick['vertical'] = (Interval.width(range.horizontal) * tick.len) * (b.height / b.width);

				if (!range['horizontal'].numerical) {
					g.beginPath().
						moveTo(range['horizontal'].from, range['vertical'].from).
						lineTo(range['horizontal'].to, range['vertical'].from).
					endPath().
					stroke(defaults.color.axes);
				}

				// The base horizontal axis
				g.beginPath().
					moveTo(range['horizontal'].from, offset['horizontal']).
					lineTo(range['horizontal'].to, offset['horizontal']).
				endPath().
				stroke(defaults.color.axes);

				// Horizontal major ticks and labels
				axes.horizontal.majorTicks.forEach(function (s, i, a) {
					var size = (Interval.width(range['horizontal']) / (a.length));

					if (typeof s === 'number' && !isNaN(s)) {
						if (s !== offset['vertical'] || range['vertical'].from >= 0 || range['vertical'].to <= 0) {
							if (grid) {
								g.beginPath().
									moveTo(s, range['vertical'].from).
									lineTo(s, range['vertical'].to).
								endPath().
								stroke(defaults.color.grid);
							}
							g.beginPath().
								moveTo(s, offset['horizontal']).
								lineTo(s, offset['horizontal'] + tick['horizontal'] * -sign['horizontal']).
							endPath().
							stroke(defaults.color.axes);

							g.text(s, offset['horizontal'] + (tick['horizontal'] * 1.5) * -sign['horizontal'], s, {
								textAlign: 'center', 
								textBaseLine: (Math.isNegative(sign['horizontal']) ? 'bottom' : 'top'),
								background: defaults.color.background
							}).
							fill(defaults.color.text);
						}
					}
					else {
						g.text(size * i + (size / 2), range['vertical'].from + tick['horizontal'] * -1.5, s, {
							textAlign: 'center', 
							textBaseLine: 'top',
							background: defaults.color.background
						}).
						fill(defaults.color.text);
					}
				});

				// Horizontal minor ticks
				axes.horizontal.minorTicks.forEach(function (i) {
					if (typeof i === 'number' && !isNaN(i) && i !== 0) {
						g.beginPath().
							moveTo(i, offset['horizontal']).
							lineTo(i, offset['horizontal'] + (tick['horizontal'] * 0.5) * -sign['horizontal']).
						endPath().
						stroke(defaults.color.axes);
					}
				});

				// The base vertical axis
				g.beginPath().
					moveTo(offset['vertical'], range['vertical'].from).
					lineTo(offset['vertical'], range['vertical'].to).
				endPath().
				stroke(defaults.color.axes);

				// Vertical major ticks and labels
				axes.vertical.majorTicks.forEach(function (s, i, a) {
					var size = (Interval.width(range['vertical']) / (a.length));

					if (typeof s === 'number' && !isNaN(s)) {
						// don't draw the tick or the label where the axes cross
						if (s !== offset['horizontal'] || range['horizontal'].from >= 0 || range['horizontal'].to <= 0) {
							if (grid) {
								g.beginPath().
									moveTo(range['horizontal'].from, s).
									lineTo(range['horizontal'].to, s).
								endPath().
								stroke(defaults.color.grid);
							}

							g.beginPath().
								moveTo(offset['vertical'], s).
								lineTo(offset['vertical'] + tick['vertical'] * -sign['vertical'], s).
							endPath().
							stroke(defaults.color.axes).

							text(
								offset['vertical'] + (tick['vertical'] * 1.5) * -sign['vertical'], s, s, {
									textAlign: (Math.isNegative(sign['vertical']) ? 'left' : 'right'), 
									textBaseLine: 'middle',
									background: defaults.color.background
								}
							).
							fill(defaults.color.text);
						}
					}
					else {
						g.text(range['horizontal'].from + tick['vertical'] * -1.5, size * i + (size / 2), s, {
							textAlign: 'right', 
							textBaseLine: 'middle',
							background: defaults.color.background
						}).
						fill(defaults.color.text);
					}
				});

				// Vertical minor ticks
				axes.vertical.minorTicks.forEach(function (i) {
					if (typeof i === 'number' && !isNaN(i) && i !== 0) {
						g.beginPath().
							moveTo(offset['vertical'], i).
							lineTo(offset['vertical'] + (tick['vertical'] * 0.5) * -sign['vertical'], i).
						endPath().
						stroke(defaults.color.axes);
					}
				});
			},
			draw: function () {
				var b = that.bounds(),
					i = that.insets();

				if (cartesian) {
					
					graphics.beginViewport(b.x + i.left, b.y + i.bottom, b.width - (i.left + i.right), b.height - (i.bottom + i.top), range.horizontal, range.vertical);
					//graphics.beginViewport(b.x, b.y, b.width, b.height, range.horizontal, range.vertical);
					
					that.drawCartesianAxes(graphics);
					graphics.closeViewport();
					graphics.rect(b.x, b.y, b.width, b.height).stroke('rgb(255,0,0)');
				}
				else {
					// TODO: polar		
				}
			}
		});
		return that;

	}.defaults({});
}();
