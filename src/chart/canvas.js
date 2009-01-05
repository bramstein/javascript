
/*global bounds, insets, maximum, Interval*/
var canvas = function () {
	function drawAxis(graphics, range, majorTicks, minorTicks, orientation) {
		var sign = range.to <= 0 ? -1 : 1;

		if (orientation === 'horizontal') {
			graphics.
				beginPath().
					moveTo(range.horizontal.from, 0).
					lineTo(range.horizontal.to, 0).
				stroke();

			majorTicks.forEach(function (i) {
				if (i !== 0 || options.verticalAxis.from >= 0 || options.verticalAxis.to <= 0) {
					graphics.beginPath().
						moveTo(i, 0).
						lineTo(i, hTickLength * -hSign).
					closePath().
					stroke().
					text(i, (hTickLength * 1.35) * -hSign, i, {
						textAlign: 'center', 
						textBaseLine: (Math.isNegative(hSign) ? 'bottom' : 'top')
					});
				}
			});
		}
		else {
			graphics.
				beginPath().
					moveTo(0, range.vertical.from).
					lineTo(0, range.vertical.to).
				stroke();
		}
	}

	function drawPolarAxis(graphics, bounds, axis, orientation) {
	}

	function drawGrid(graphics, bounds, axis, orientation) {
	}

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
				if (options.verticalAxis) {
					options.verticalAxis.majorTicks.forEach(function (t) {
						result.height += graphics.textSize(t.toString()).height;
					});
					result.height += (options.verticalAxis.majorTicks.length - 1) * spacing;
				}

				if (options.horizontalAxis) {
					options.horizontalAxis.majorTicks.forEach(function (t) {
						result.width += graphics.textSize(t.toString()).width;
					});
					result.width += (options.horizontalAxis.majorTicks.length - 1) * spacing;
				}

				return result;
			},
			drawAxes: function () {
				var b = that.bounds(),
					tick = {len: 15, horizontal: 0, vertical: 0},
					axes = ['horizontal', 'vertical'],
					range = { 
						horizontal: {from: 0, to: 10},
						vertical: {from: 0, to: 1}
					},
					sign = {
						horizontal: 1,
						vertical: 1
					};


				if (options.polarAxis !== undefined) {
				}
				else if (options.horizontalAxis !== undefined && options.verticalAxis !== undefined) {
					tick['horizontal'] = b.width - b.x;
					tick['vertical'] = b.height - b.y;

					axes.forEach(function (n) {
						range[n] = !Interval.empty(options[n + 'Axis']) ? {from: options[n + 'Axis'].from, to: options[n + 'Axis'].to} : range[n];
						tick[n] = tick.len * (Interval.width(range[n]) / tick[n]);
						sign[n] = range[n].to <= 0 ? -1 : 1;
					});


					graphics.beginViewport(b.x, b.y, b.width, b.height, range.horizontal, range.vertical);

					var t = graphics.itransform_length(5, 5);
					tick['horizontal'] = t.e(2);
					tick['vertical'] = t.e(1);
					//console.log(graphics.itransform_length(5, 5));
					graphics.
						beginPath().
							moveTo(range['horizontal'].from, 0).
							lineTo(range['horizontal'].to, 0).
						stroke();

					console.log(tick);

					options.horizontalAxis.majorTicks.forEach(function (s, i, a) {
						if (typeof s === 'number' && !isNaN(s)) {
							if (s !== 0 || options.verticalAxis.from >= 0 || options.verticalAxis.to <= 0) {
								graphics.beginPath().
									moveTo(s, 0).
									lineTo(s, tick['horizontal'] * -sign['horizontal']).
								closePath().
								stroke().
								text(s, (tick['horizontal'] * 1.35) * -sign['horizontal'], s, {
									textAlign: 'center', 
									textBaseLine: (Math.isNegative(sign['horizontal']) ? 'bottom' : 'top')
								});
							}
						}
						else {
							var p = (Interval.width(range['horizontal']) / a.length) * i;
							console.log((Interval.width(range['horizontal']) / a.length) * i);
							console.log(s);
							graphics.beginPath().
									moveTo(p, 0).
									lineTo(p, tick['horizontal'] * -sign['horizontal']).
								closePath().
								stroke().
								text(p, (tick['horizontal'] * 1.35) * -sign['horizontal'], s, {
									textAlign: 'left', 
									textBaseLine: (Math.isNegative(sign['horizontal']) ? 'bottom' : 'top')
								});
						}
					});

				//	console.log(tick);

				//	axes.forEach(function (n) {
				//		drawAxis(graphics, range, options[n + 'Axis'], n);
				//	});
				}


//				graphics.beginViewport(b.x, b.y, b.width, b.height, options.horizontalAxis !== undefined ? options.horizontalAxis : options.polarAxis, options.verticalAxis);

/*
				['horizontal', 'vertical'].forEach(function (n) {
				//	tickLength[n] = tickLength.len * Interval.width(xrange);
					drawAxis(graphics, options[n + 'Axis'], n);
				});
*/

				graphics.closeViewport();
/*
				var tickLength = 0.15,
					hTickLength = tickLength * ((that.bounds().width - that.bounds().x) / Interval.width(options.horizontalAxis)),
					vTickLength = tickLength * ((that.bounds().height - that.bounds().y) / Interval.width(options.verticalAxis));

				graphics.beginViewport(that.bounds().x, that.bounds().y, that.bounds().width, that.bounds().height, options.horizontalAxis, options.verticalAxis);

				graphics.
					beginPath().
						moveTo(options.horizontalAxis.from, 0).
						lineTo(options.horizontalAxis.to, 0).
						moveTo(0, options.verticalAxis.from).
						lineTo(0, options.verticalAxis.to).
					closePath().
				stroke();

				var vSign = options.horizontalAxis.to <= 0 ? -1 : 1;
				var hSign = options.verticalAxis.to <= 0 ? -1 : 1;

				options.horizontalAxis.majorTicks.forEach(function (i) {
					if (i !== 0 || options.verticalAxis.from >= 0 || options.verticalAxis.to <= 0) {
						graphics.beginPath().
							moveTo(i, 0).
							lineTo(i, hTickLength * -hSign).
						closePath().
						stroke().
						text(i, (hTickLength * 1.35) * -hSign, i, {
							textAlign: 'center', 
							textBaseLine: (Math.isNegative(hSign) ? 'bottom' : 'top')
						});
					}
				});

				

				options.verticalAxis.majorTicks.forEach(function (i) {
					if (i !== 0 || options.horizontalAxis.from >= 0 || options.horizontalAxis.to <= 0) {
						graphics.beginPath().
							moveTo(0, i).
							lineTo(vTickLength * -vSign, i).
						closePath().
						stroke().
						text(
							(vTickLength * 1.35) * -vSign, 
							i, 
							i, {
								textAlign: (Math.isNegative(vSign) ? 'left' : 'right'), 
								textBaseLine: 'middle'
							}
						);
					}
				});

				options.horizontalAxis.minorTicks.forEach(function (i) {
					if (i !== 0) {
						graphics.beginPath().
							moveTo(i, 0).
							lineTo(i, (hTickLength * 0.5) * -hSign).
						closePath().
						stroke();
					}
				});

				options.verticalAxis.minorTicks.forEach(function (i) {
					if (i !== 0) {
						graphics.beginPath().
							moveTo(0, i).
							lineTo((vTickLength * 0.5) * -vSign, i).
						closePath().
						stroke();
					}
				});
*/
				/*

				graphics.color('rgb(255,0,0)');
				var p = graphics.beginPath();
				//p.moveTo(options.horizontalAxis.from, 0);
				options.horizontalAxis.majorTicks.forEach(function (i) {
				//for (var i = options.horizontalAxis.from; i < options.horizontalAxis.to; i += 1) {
					
					p.lineTo(i, Math.randomInt(options.verticalAxis.from, options.verticalAxis.to / Math.randomInt(1,2)));
				//}
				});
				p.stroke();
				//p.closePath().stroke();
*/
//				graphics.closeViewport();


			},
			preferredSize: function () {
				return bounds();
			}
		});
		return that;

	}.defaults({});
}();
