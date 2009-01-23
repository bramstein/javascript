
/*global bounds, insets, maximum, Interval*/
var canvas = function () {
	return function (graphics, options) {
		var that = {},

			// The minimum amount of spacing between labels
			spacing = {
				horizontal: options.hspace || 5,
				vertical: options.vspace || 5
			},

			// The amount of padding around the data area
			padding = {
				top: 0,
				bottom: 0,
				left: 0,
				right: 0
			},

			// The aspect ratio of the data area of the chart
			ratio = {
				horizontal: (options.ratio && options.ratio.horizontal) || 1,
				vertical: (options.ratio && options.ratio.vertical) || 1
			},

			// Enables or disables drawing of a grid
			grid = options.grid && options.grid === true || false,

			// Axis tick mark lengths
			tickLength = 0.026,

			// Available axes
			axes = {
				horizontal: undefined,
				vertical: undefined
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
			cartesianAxes = ['horizontal', 'vertical'],
			cartesianOppositeAxes = [].append(cartesianAxes).reverse();

		// Mix-in the following properties:
		that = bounds(that);
		that = insets(that);
		that = maximum(that);

		//that.insets({left: 10, right: 10, top: 10, bottom: 10});

		cartesian = options.axes.polar === undefined;

		if (!cartesian) {
			axes.horizontal = options.axes.polar;
			axes.vertical = options.axes.polar;
		}
		else if (cartesian && options.axes.horizontal !== undefined && options.axes.vertical !== undefined) {
			axes.horizontal = options.axes.horizontal;
			axes.vertical = options.axes.vertical;
		}
		else {
			throw new TypeError('No axes specified for chart.');
		}

		// The horizontal and vertical range equal the range of 
		// numerical axes, or 0..1 for categorical axes.
		cartesianAxes.forEach(function (n) {
			range[n] = !Interval.empty(axes[n]) ? {from: axes[n].from, to: axes[n].to, numeric: true} : range[n];
		});

		cartesianAxes.forEach(function (axis, i) {
			var opposite = cartesianOppositeAxes[i];

			// calculate the correct aspect ratio
			ratio[axis] *= axes[axis].ticks.major.length - 1;

			// The sign determines on which side of the axis the
			// labels are drawn. 1 means on the left side, -1 on the right side
			// for a vertical axes. For a horizontal axis 1 means below,
			// -1 means above the axis.
			sign[axis] = range[opposite].to <= 0 ? -1 : 1;

			// If the axes do not start at zero or contain zero,
			// this will adjust the opposite axis to draw at the
			// correct location.
			if (!Interval.contains(range[axis], 0)) {
				offset[opposite] = range[axis].to < 0 ? range[axis].to : range[axis].from;
			}
		});

		Object.extend(that, {
			doLayout: function () {
			},
			isVisible: function () {
				return true;
			},
			minimumSize: function () {
				var r = that.minimumDataSize(),
					i = that.insets(),
					tick = {
						horizontal: (Interval.width(range.vertical) * tickLength),
						vertical: (Interval.width(range.horizontal) * tickLength) * (r.height / r.width)
					},
					maxHeight = 0,
					maxWidth = 0,
					maxLabel = 0;

				axes.vertical.ticks.major.forEach(function (t) {
					maxWidth = Math.max(font.size(t, defaults.font.labels).width, maxWidth);
				});

				axes.horizontal.ticks.major.forEach(function (t) {
					maxHeight = Math.max(font.size(t, defaults.font.labels).height, maxHeight);
				});

				maxWidth += (r.height * tickLength) * 1.5;
				maxHeight += ((r.width * tickLength) * (r.height / r.width)) * 1.5;

				padding.left = maxWidth;
				padding.right = maxWidth;

				padding.bottom = maxHeight;
				padding.top = maxHeight;

				r.width += i.left + i.right;
				r.height += i.bottom + i.top;

				r.width += padding.left + padding.right;
				r.height += padding.top + padding.bottom;

				return r;
			},
			preferredSize: function () {
				var preferred = that.minimumDataSize(),
					i = that.insets(),
					size = Math.max(preferred.width / ratio.horizontal, preferred.height / ratio.vertical),
					maxHeight = 0,
					maxWidth = 0,
					maxLabel = 0;

				axes.vertical.ticks.major.forEach(function (t) {
					maxWidth = Math.max(font.size(t, defaults.font.labels).width, maxWidth);
				});

				axes.horizontal.ticks.major.forEach(function (t) {
					maxHeight = Math.max(font.size(t, defaults.font.labels).height, maxHeight);
				});

				preferred.width = size * ratio.horizontal;
				preferred.height = size * ratio.vertical;

				maxWidth += (preferred.height * tickLength) * 1.5;
				maxHeight += ((preferred.width * tickLength) * (preferred.height / preferred.width)) * 1.5;
				padding.left = maxWidth;
				padding.right = maxWidth;

				padding.bottom = maxHeight;
				padding.top = maxHeight;

				preferred.width += i.left + i.right;
				preferred.height += i.bottom + i.top;

				preferred.width += padding.right + padding.left;
				preferred.height += padding.bottom + padding.top;				

				return preferred;
			},
			preferredDataSize: function () {
				var preferred = that.minimumDataSize(),
					size = Math.max(preferred.width / ratio.horizontal, preferred.height / ratio.vertical);

				preferred.width = size * ratio.horizontal;
				preferred.height = size * ratio.vertical;
				
				return preferred;
			},
			minimumDataSize: function () {
				var result = {
						width: 0,
						height: 0
					},
					maxHeight = 0,
					maxWidth = 0;			

				axes.vertical.ticks.major.forEach(function (t) {
					maxHeight = Math.max(font.size(t, defaults.font.labels).height, maxHeight);
				});
				result.height = axes.vertical.ticks.major.length * maxHeight;
				result.height += (axes.vertical.ticks.major.length - 1) * spacing.vertical;

				axes.horizontal.ticks.major.forEach(function (t) {
					maxWidth = Math.max(font.size(t, defaults.font.labels).width, maxWidth);
				});
				result.width = axes.horizontal.ticks.major.length * maxWidth;
				result.width += (axes.horizontal.ticks.major.length - 1) * spacing.horizontal;

				return result;
			},
			drawAxes: function (g) {
				var b = that.bounds(),
					tick = {};

					// Adjust the tick size using the aspect ratio (height / width).
				tick = {
					horizontal: (Interval.width(range.vertical) * tickLength),
					vertical: (Interval.width(range.horizontal) * tickLength) * (b.height / b.width)
				};

				if (grid && !cartesian) {
					g.beginClip(range.horizontal.from, range.vertical.from, Interval.width(range.horizontal), Interval.width(range.vertical));
					axes.horizontal.ticks.major.forEach(function (s) {
						if (range.horizontal.numeric) {
							g.ellipse(0, 0, Math.abs(s), Math.abs(s)).
							stroke(defaults.color.grid);
						}
					});
					graphics.closeClip();
				}

				// Horizontal major ticks and labels
				axes.horizontal.ticks.major.forEach(function (s, i, a) {
					var size = (Interval.width(range['horizontal']) / (a.length));

					if (range.horizontal.numeric) {
						if (s !== offset['vertical'] || range['vertical'].from >= 0 || range['vertical'].to <= 0) {
							if (grid && cartesian) {
								g.line(s, range['vertical'].from, s, range['vertical'].to).
								stroke(defaults.color.grid);
							}
							g.line(s, offset['horizontal'], s, offset['horizontal'] + tick['horizontal'] * -sign['horizontal']).
							stroke(defaults.color.axes);

							g.text(s, offset['horizontal'] + (tick['horizontal'] * 1.5) * -sign['horizontal'], axes.horizontal.ticks.labels[i] || s, {
								textAlign: 'center', 
								textBaseLine: (Math.isNegative(sign['horizontal']) ? 'bottom' : 'top'),
								background: defaults.color.background,
								font: defaults.font.labels
							}).
							fill(defaults.color.text);
						}
					}
					else {
						g.text(size * i + (size / 2), range['vertical'].from + tick['horizontal'] * -1.5, s, {
							textAlign: 'center', 
							textBaseLine: 'top',
							background: defaults.color.background,
							font: defaults.font.labels
						}).
						fill(defaults.color.text);
					}
				});

				// Horizontal minor ticks
				axes.horizontal.ticks.minor.forEach(function (i) {
					if (range.horizontal.numeric && i !== 0) {
						g.line(i, offset['horizontal'], i, offset['horizontal'] + (tick['horizontal'] * 0.5) * -sign['horizontal']).
						stroke(defaults.color.axes);
					}
				});

				// Vertical major ticks and labels
				axes.vertical.ticks.major.forEach(function (s, i, a) {
					var size = (Interval.width(range['vertical']) / (a.length));

					if (range.vertical.numeric) {
						// don't draw the tick or the label where the axes cross
						if (s !== offset['horizontal'] || range['horizontal'].from >= 0 || range['horizontal'].to <= 0) {
							if (grid && cartesian) {
								g.line(range['horizontal'].from, s, range['horizontal'].to, s).
								stroke(defaults.color.grid);
							}
							g.line(offset['vertical'], s, offset['vertical'] + tick['vertical'] * -sign['vertical'], s).
							stroke(defaults.color.axes);

							g.text(
								offset['vertical'] + (tick['vertical'] * 1.5) * -sign['vertical'], s, axes.vertical.ticks.labels[i] || s, {
									textAlign: (Math.isNegative(sign['vertical']) ? 'left' : 'right'), 
									textBaseLine: 'middle',
									background: defaults.color.background,
									font: defaults.font.labels
								}
							).
							fill(defaults.color.text);
						}
					}
					else {
						g.text(range['horizontal'].from + tick['vertical'] * -1.5, size * i + (size / 2), s, {
							textAlign: 'right', 
							textBaseLine: 'middle',
							background: defaults.color.background,
							font: defaults.font.labels
						}).
						fill(defaults.color.text);
					}
				});

				// Vertical minor ticks
				axes.vertical.ticks.minor.forEach(function (i) {
					if (range.vertical.numeric && i !== 0) {
						g.line(offset['vertical'], i, offset['vertical'] + (tick['vertical'] * 0.5) * -sign['vertical'], i).
						stroke(defaults.color.axes);
					}
				});


				if (!range.horizontal.numeric) {
					g.line(range['horizontal'].from, range['vertical'].from, range['horizontal'].to, range['vertical'].from).
					stroke(defaults.color.axes);
				}

				// The base horizontal axis
				g.line(range['horizontal'].from, offset['horizontal'], range['horizontal'].to, offset['horizontal']).
				stroke(defaults.color.axes);

				// The base vertical axis
				g.line(offset['vertical'], range['vertical'].from, offset['vertical'], range['vertical'].to).
				stroke(defaults.color.axes);
			},
			draw: function () {
				var b = that.bounds(),
					i = that.insets();
			
				graphics.beginViewport(b.x, b.y, b.width, b.height);
					graphics.beginViewport(i.left + padding.left, i.bottom + padding.bottom, b.width - (i.right + i.left + padding.left + padding.right), b.height - (i.bottom + i.top + padding.bottom + padding.top), {range: range});
						that.drawAxes(graphics);
					//	graphics.beginViewport(range.horizontal.from, range.vertical.from, Interval.width(range.horizontal), Interval.width(range.vertical), {polar: true});
					//		graphics.line(0, 0, 3, Math.PI / 4).stroke('rgb(0, 0, 255)');
					//	graphics.closeViewport();

					graphics.closeViewport();
			//		graphics.rect(i.left + padding.left, i.bottom + padding.bottom, b.width - (i.right + i.left + padding.right + padding.left), b.height - (i.bottom + i.top + padding.bottom + padding.top)).stroke('rgb(255, 0, 0)');
				graphics.closeViewport();
			//	graphics.rect(b.x, b.y, b.width, b.height).stroke('rgb(255,0,0)');
			}
		});
		return that;

	}.defaults({});
}();
