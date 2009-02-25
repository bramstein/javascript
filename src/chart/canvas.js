/*global bounds, insets, maximum, Interval, font, defaults*/
var canvas = function () {
	return function (options) {
		var that = {},

			size = {
				width: 0,
				height: 0,
				x: 0,
				y: 0
			},

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

			// Axis tick mark size
			tickSize = 4,

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

			maximumLabelSize = {
				horizontal: {
					width: 0,
					height: 0
				},
				vertical: {
					width: 0,
					height: 0
				}
			},

			// True if the chart is cartesian, false if it is polar
			cartesian = true,

			// Some variables to generalize axis code
			cartesianAxes = ['horizontal', 'vertical'],
			cartesianOppositeAxes = [].append(cartesianAxes).reverse();

		// Mix-in the following properties:
		that = bounds(that);
		that = insets(that);
		that = maximum(that);

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
			range[n] = !Interval.empty(axes[n]) ? {
				from: axes[n].from,
				to: axes[n].to,
				numeric: true
			} : {
				from: 0,
				to: axes[n].ticks.major.length || 1
			};
		});

		options.draw = options.draw || {};

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

			// Calculate the maximum label size for each axis.
			['height', 'width'].forEach(function (t) {
				maximumLabelSize[axis][t] = axes[axis].ticks.major.reduce(function (m, v) {
					return Math.max(m, font.size(v, defaults.font.labels)[t]);
				}, 0);		
			});

			// Clean up the draw options
			options.draw[axis] = options.draw[axis] || {};
			options.draw[axis].grid = options.draw[axis].grid === true || false;
			['label', 'axis', 'labels', 'ticks'].forEach(function (type) {
				if (!Object.isBoolean(options.draw[axis][type])) {
					options.draw[axis][type] = true;
				}
			});
		});

		['minimum', 'preferred'].forEach(function (type) {
			that[type + 'Size'] = function () {
				var r = that[type + 'DataSize'](),
					i = that.insets(),
					m = {
						height: maximumLabelSize.horizontal.height,
						width: maximumLabelSize.vertical.width
					};

				m.width += tickSize * 2;
				m.height += tickSize * 2;

				if (sign.horizontal === -1) {
					padding.top = m.height;
				}
				else {
					padding.bottom = m.height;
				}

				if (sign.vertical === -1) {
					padding.right = m.width;
				}
				else {
					padding.left = m.width;
				}

				if (axes.horizontal.label) {
					padding.bottom += font.size(axes.horizontal.label, defaults.font.labels).height + (tickSize * 2);
				}

				if (axes.vertical.label) {
					padding.top += font.size(axes.vertical.label, defaults.font.labels).height + (tickSize * 2);
					padding.left += (font.size(axes.vertical.label, defaults.font.labels).width + (tickSize * 2)) - padding.left;
				}

				r.width += i.left + i.right + padding.right + padding.left;
				r.height += i.bottom + i.top + padding.bottom + padding.top;

				return r;
			};
		});

		Object.extend(that, {
			doLayout: function () {
			},
			isVisible: function () {
				return true;
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
						width: maximumLabelSize.horizontal.width,
						height: maximumLabelSize.vertical.height
					};

				result.height *= axes.vertical.ticks.major.length;
				result.height += (axes.vertical.ticks.major.length - 1) * spacing.vertical;

				result.width *= axes.horizontal.ticks.major.length;
				result.width += (axes.horizontal.ticks.major.length - 1) * spacing.horizontal;

				return result;
			},
			drawAxes: function (g) {
				var b = that.bounds();

				if (options.draw.vertical.grid && !cartesian) {
					g.beginClip(range.horizontal.from, range.vertical.from, Interval.width(range.horizontal), Interval.width(range.vertical));
					axes.horizontal.ticks.major.forEach(function (s) {
						if (range.horizontal.numeric) {
							g.ellipse(0, 0, Math.abs(s), Math.abs(s)).
							stroke(defaults.color.grid);
						}
					});
					g.closeClip();
				}

				// Horizontal major ticks and labels
				axes.horizontal.ticks.major.forEach(function (s, i, a) {
					var size = (Interval.width(range.horizontal) / (a.length));

					if (range.horizontal.numeric) {
						if (s !== offset.vertical || range.vertical.from >= 0 || range.vertical.to <= 0) {
							if (options.draw.vertical.grid && cartesian) {
								g.line(s, range.vertical.from, s, range.vertical.to).
								stroke(defaults.color.grid);
							}
					
							if (options.draw.horizontal.labels) {
								g.text(s, offset.horizontal, axes.horizontal.ticks.labels[i] || s, {
									textAlign: 'center', 
									textBaseLine: (Math.isNegative(sign.horizontal) ? 'bottom' : 'top'),
									background: defaults.color.background.data,
									font: defaults.font.labels,
									padding: {
										top: (Math.isNegative(sign.horizontal) ? 0 : tickSize * 2),
										bottom: (Math.isNegative(sign.horizontal) ? tickSize * 2 : 0)
									}
								}).
								fill(defaults.color.label);
							}
	
							if (options.draw.horizontal.ticks) {
								g.vdash(s, offset.horizontal, tickSize * -sign.horizontal).
								stroke(defaults.color.axes);
							}
						}
					}
					else if (options.draw.horizontal.labels) {
						g.text(size * i + (size / 2), range['vertical'].from /*+ tick['horizontal'] * -2*/, s, {
							textAlign: 'center', 
							textBaseLine: 'top',
							background: defaults.color.background.data,
							font: defaults.font.labels,
							padding: {
								top: tickSize * 2
							}
						}).
						fill(defaults.color.label);
					}
				});

				// Horizontal minor ticks
				if (options.draw.horizontal.ticks) {
					axes.horizontal.ticks.minor.forEach(function (i) {
						if (range.horizontal.numeric && i !== 0) {
							g.vdash(i, offset.horizontal, Math.ceil(tickSize / 2) * -sign.horizontal).
							stroke(defaults.color.axes);
						}
					});
				}

				// Vertical major ticks and labels
				axes.vertical.ticks.major.forEach(function (s, i, a) {
					var size = (Interval.width(range['vertical']) / (a.length));

					if (range.vertical.numeric) {
						// don't draw the tick or the label where the axes cross
						if (s !== offset['horizontal'] || range['horizontal'].from >= 0 || range['horizontal'].to <= 0) { 
							if (options.draw.horizontal.grid && cartesian) {
								g.line(range.horizontal.from, s, range.horizontal.to, s).
								stroke(defaults.color.grid);
							}

							if (options.draw.vertical.labels) {
								g.text(
									offset.vertical, s, axes.vertical.ticks.labels[i] || s, {
										textAlign: (Math.isNegative(sign['vertical']) ? 'left' : 'right'), 
										textBaseLine: 'middle',
										background: defaults.color.background.data,
										font: defaults.font.labels,
										padding: {
											right: (Math.isNegative(sign.vertical) ? 0 : tickSize * 2),
											left: (Math.isNegative(sign.vertical) ? tickSize * 2 : 0)
										}
									}
								).
								fill(defaults.color.label);
							}

							if (options.draw.vertical.ticks) {
								g.hdash(offset.vertical, s, tickSize * -sign.vertical).
								stroke(defaults.color.axes);
							}
						}
					}
					else if (options.draw.vertical.labels) {
						g.text(range['horizontal'].from, size * i + (size / 2), s, {
							textAlign: 'right', 
							textBaseLine: 'middle',
							background: defaults.color.background.data,
							font: defaults.font.labels,
							padding: {
								right: tickSize * 2
							}
						}).
						fill(defaults.color.label);
					}
				});

				// Vertical minor ticks
				if (options.draw.vertical.ticks) {
					axes.vertical.ticks.minor.forEach(function (i) {
						if (range.vertical.numeric && i !== 0) {
							g.hdash(offset.vertical, i, Math.ceil(tickSize / 2) * -sign.vertical).
							stroke(defaults.color.axes);
						}
					});
				}

				// The base horizontal axis
				if (options.draw.horizontal.axis) {
					g.line(
						range['horizontal'].from, 
						offset['horizontal'],
						range['horizontal'].to,
						offset['horizontal']
					).stroke(defaults.color.axes);
				}

				// The base vertical axis
				if (options.draw.vertical.axis) {
					g.line(
						offset['vertical'],
						range['vertical'].from,
						offset['vertical'],
						range['vertical'].to
					).stroke(defaults.color.axes);
				}
			},
			draw: function (g, f) {
				var b = that.bounds(),
					i = that.insets(),
					data = {
						x: i.left + padding.left,
						y: i.bottom + padding.bottom,
						width: b.width - (i.right + i.left + padding.left + padding.right),
						height: b.height - (i.bottom + i.top + padding.bottom + padding.top)
					};
				g.beginViewport(b.x, b.y, b.width, b.height).
					beginViewport(data.x, data.y, data.width, data.height, {range: range}).
						rect(range.horizontal.from, range.vertical.from, Interval.width(range.horizontal), Interval.width(range.vertical)).
						fill(defaults.color.background.data);
						that.drawAxes(g);

						if (f) {
							if (!cartesian) {
								g.beginViewport(range.horizontal.from, range.vertical.from, Interval.width(range.horizontal), Interval.width(range.vertical), { polar: true});
								f(g);
								g.closeViewport();	
							}
							else {
								f(g);
							}
						}
					g.closeViewport();
					//g.rect(data.x, data.y, data.width, data.height).stroke('rgb(255, 0, 0)');

					if (axes.horizontal.label && options.draw.horizontal.label) {
						g.text(data.x + (data.width / 2), 0, axes.horizontal.label, {
							textAlign: 'center'
						}).
						fill(defaults.color.label);
					}

					if (axes.vertical.label && options.draw.vertical.label) {
						g.text(0, b.height, axes.vertical.label, {
							textBaseLine: 'top'
						}).
						fill(defaults.color.label);
					}
				g.closeViewport();
				//g.rect(b.x, b.y, b.width, b.height).stroke('rgb(0,0,255)');
			}
		});

		// calculate the minimumSize (and thus correctly setting the padding);
		that.minimumSize();

		return that;

	}.defaults({});
}();
