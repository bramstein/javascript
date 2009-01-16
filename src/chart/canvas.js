
/*global bounds, insets, maximum, Interval*/
var canvas = function () {
	return function (graphics, options) {
		var that = {},

			// The minimum amount of spacing between labels
			spacing = {
				horizontal: options.hspace || 10,
				vertical: options.vspace || 15
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
	//		tick = {
	//			len: 0.026,
	//			horizontal: 0,
	//			vertical: 0
	//		},

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

		that.insets({left: 10, right: 10, top: 10, bottom: 10});

		allAxes.forEach(function (n) {
			axes[n] = (options[n + 'Axis'] !== undefined && options[n + 'Axis']) || undefined;
		});

		cartesian = axes.polar === undefined;

		if (cartesian) {
			// Calculate the correct aspect ratio
			if (axes.horizontal && axes.vertical) {
				ratio.horizontal *= axes.horizontal.majorTicks.length - 1;
				ratio.vertical *= axes.vertical.majorTicks.length - 1;
			}
			else if (axes.horizontal && !axes.vertical) {
				ratio.horizontal *= axes.horizontal.majorTicks.length - 1;
				ratio.vertical *= axes.horizontal.majorTicks.length - 1;
			}
			else if (!axes.horizontal && axes.vertical) {
				ratio.horizontal *= axes.vertical.majorTicks.length - 1;
				ratio.vertical *= axes.vertical.majorTicks.length - 1;
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

		//	cartesianAxes.forEach(function (axis, i) {
		//	}
			//if (axes.vertical.to > 0 && axes.horizontal.from < 0
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
			minimumSize: function () {
				var r = that.minimumDataSize(),
					i = that.insets(),
					tick = {
						horizontal: (Interval.width(range.vertical) * tickLength),
						vertical: (Interval.width(range.horizontal) * tickLength) * (r.height / r.width)
					};

				r.width += i.left + i.right;
				r.height += i.bottom + i.top;

				return r;
			},
			preferredSize: function () {
				var preferred = that.minimumDataSize(),
					i = that.insets(),
					size = Math.max(preferred.width / ratio.horizontal, preferred.height / ratio.vertical),
					maxHeight = 0,
					maxWidth = 0;

				if (axes.vertical) {
					axes.vertical.majorTicks.forEach(function (t) {
						maxWidth = Math.max(graphics.textSize(t).width, maxWidth);
					});
				}

				if (axes.horizontal) {
					axes.horizontal.majorTicks.forEach(function (t) {
						maxHeight = Math.max(graphics.textSize(t).height, maxHeight);
					});
				}

				maxHeight *= 1.3;
				maxWidth *= 1.3;

				if (i.right < maxWidth || i.left < maxWidth) {
					i.right = maxWidth;
					i.left = maxWidth;
				}
				if (i.bottom < maxHeight || i.top < maxHeight) {
					i.bottom = maxHeight;
					i.top = maxHeight;
				}

				preferred.width = size * ratio.horizontal;
				preferred.height = size * ratio.vertical;

				preferred.width += i.left + i.right;
				preferred.height += i.bottom + i.top;
				
				return preferred;
			},
			preferredDataSize: function () {
				var preferred = that.dataSize(),
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
				if (axes.vertical) {
					axes.vertical.majorTicks.forEach(function (t) {
						maxHeight = Math.max(graphics.textSize(t).height, maxHeight);
					});
					result.height = axes.vertical.majorTicks.length * maxHeight;
					result.height += (axes.vertical.majorTicks.length - 1) * spacing['vertical'];
				}

				if (axes.horizontal) {
					axes.horizontal.majorTicks.forEach(function (t) {
						maxWidth = Math.max(graphics.textSize(t).width, maxWidth);
					});
					result.width = axes.horizontal.majorTicks.length * maxWidth;
					result.width += (axes.horizontal.majorTicks.length - 1) * spacing['horizontal'];
				}
				return result;
			},
			drawPolarAxes: function (g) {
			},
			drawCartesianAxes: function (g) {
				var b = that.bounds(),
					// Adjust the tick size using the aspect ratio (height / width).
					tick = {
						horizontal: (Interval.width(range.vertical) * tickLength),
						vertical: (Interval.width(range.horizontal) * tickLength) * (b.height / b.width)
					};

				// Horizontal major ticks and labels
				axes.horizontal.majorTicks.forEach(function (s, i, a) {
					var size = (Interval.width(range['horizontal']) / (a.length));

					if (typeof s === 'number' && !isNaN(s)) {
						if (s !== offset['vertical'] || range['vertical'].from >= 0 || range['vertical'].to <= 0) {
							if (grid) {
								g.line(s, range['vertical'].from, s, range['vertical'].to).
								stroke(defaults.color.grid);
							}
							g.line(s, offset['horizontal'], s, offset['horizontal'] + tick['horizontal'] * -sign['horizontal']).
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
						g.line(i, offset['horizontal'], i, offset['horizontal'] + (tick['horizontal'] * 0.5) * -sign['horizontal']).
						stroke(defaults.color.axes);
					}
				});

				// Vertical major ticks and labels
				axes.vertical.majorTicks.forEach(function (s, i, a) {
					var size = (Interval.width(range['vertical']) / (a.length));

					if (typeof s === 'number' && !isNaN(s)) {
						// don't draw the tick or the label where the axes cross
						if (s !== offset['horizontal'] || range['horizontal'].from >= 0 || range['horizontal'].to <= 0) {
							if (grid) {
								g.line(range['horizontal'].from, s, range['horizontal'].to, s).
								stroke(defaults.color.grid);
							}
							g.line(offset['vertical'], s, offset['vertical'] + tick['vertical'] * -sign['vertical'], s).
							stroke(defaults.color.axes);

							g.text(
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
						g.line(offset['vertical'], i, offset['vertical'] + (tick['vertical'] * 0.5) * -sign['vertical'], i).
						stroke(defaults.color.axes);
					}
				});


				if (!range['horizontal'].numerical) {
					g.line(range['horizontal'].from, range['vertical'].from, range['horizontal'].to, range['vertical'].from).
					stroke(defaults.color.axes);
				}

				// The base horizontal axis
				g.line(range['horizontal'].from, offset['horizontal'], range['horizontal'].to, offset['horizontal']).
				stroke(defaults.color.axes);

				// The base vertical axis
				g.line(offset['vertical'], range['vertical'].from, offset['vertical'], range['vertical'].to).
				stroke(defaults.color.axes);


				g.ellipse(0, 0, 4, 8000).
				stroke(defaults.color.grid);

				g.ellipse(0, 0, 3, 6000).
				stroke(defaults.color.grid);

				g.ellipse(0, 0, 2, 4000).
				stroke(defaults.color.grid);

				g.ellipse(0, 0, 1, 2000).
				stroke(defaults.color.grid);
			},
			draw: function () {
				var b = that.bounds(),
					i = that.insets();

				if (cartesian) {
					graphics.beginViewport(b.x, b.y, b.width, b.height);
						graphics.beginViewport(i.left, i.bottom, b.width - (i.right + i.left), b.height - (i.bottom + i.top), range.horizontal, range.vertical);
							that.drawCartesianAxes(graphics);
						graphics.closeViewport();
					//	graphics.rect(i.left, i.bottom, b.width - (i.right + i.left), b.height - (i.bottom + i.top)).stroke('rgb(255, 0, 0)');
					graphics.closeViewport();
				//	graphics.rect(b.x, b.y, b.width, b.height).stroke('rgb(255,0,0)');
				}
				else {
					// TODO: polar		
				}
			}
		});
		return that;

	}.defaults({});
}();
