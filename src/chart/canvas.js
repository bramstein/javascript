
/*global bounds, insets, maximum, Interval*/
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
						text(i, (hTickLength * 1.35) * -hSign, i.toString(), {
							textAlign: 'center', 
							textBaseLine: (Math.isNegative(hSign) ? 'bottom' : 'top'), 
							numerical: true
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
							i.toString(), {
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

				graphics.closeViewport();


			},
			preferredSize: function () {
				return bounds();
			}
		});
		return that;

	}.defaults({});
}();
