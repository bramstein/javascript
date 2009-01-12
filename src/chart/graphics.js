/*
 * var c = graphics(ctx);
 * c.beginPath().
 *	moveTo(10, 12).
 *  lineTo(50, 20).
 *  lineTo(200, 10).
 * closePath().
 * fill();
 */
/*global document, $V, $M, Interval*/
var graphics = function () {
	var path = {};
	var shape = {};
	var text = {};

	return function (identifier, horizontalRange, verticalRange) {
		var context = null,
			canvas = document.getElementById(identifier),
			fontHeight = /([0-9]*)px/i,
			transformation = [],
			textBuffer = [];

		function transform(x, y) {
			return transformation.reduceRight(function (i, item) {
				return item.multiply(i);
			}, $V([x, y, 1]));
		}

		function transform_length(w, h) {
			var o = transform(0, 0),
				r = transform(w, h);
			r = r.subtract(o);
			return r;
		}

		if (canvas && canvas.getContext !== undefined && canvas.getContext('2d') !== undefined) {
			context = canvas.getContext('2d');

			['lineTo', 'moveTo', 'arcTo', 'bezierCurveTo', 'quadraticCurveTo'].forEach(function (n) {
				path[n] = function (x, y) {
					var p = transform(x, y);
					context[n].apply(context, [p.e(1), p.e(2)]);
					return path;
				};
			});

			['stroke', 'fill'].forEach(function (n) {
				shape[n] = function () {
					context[n].apply(context, arguments);

					if (!textBuffer.isEmpty()) {
						textBuffer.forEach(function (args) {
							args.push(n);
							text.draw.apply(shape, args);
						});
						textBuffer = [];
					}
					return shape;
				};
			});

			path.closePath = function () {
				context.closePath();
				return shape;
			};

			path.endPath = function () {
				return shape;
			};

			shape.beginPath = function () {
				context.beginPath();
				return path;
			};

			shape.color = function (c) {
				context.fillStyle = c;
				context.strokeStyle = c;
				return shape;
			};

			shape.rect = function (x, y, width, height) {
				var p = transform(x, y);
				var d = transform_length(width, height);
				context.beginPath();
				context.rect(p.e(1), p.e(2), d.e(1), d.e(2));
				context.closePath();
				return shape;
			};

			shape.circle = function (x, y, radius) {
				var p = transform(x, y),
					r = transform_length(radius, 0).e(1);
				context.beginPath();
				context.arc(p.e(1), p.e(2), r, 0, Math.PI * 2, false);
				context.closePath();
				return shape;
			};

			shape.roundedRect = function (x, y, width, height, radius) {
				var p = transform(x, y);
				var d = transform_length(width, height);
				var r = transform_length(r, 0);
				x = p.e(1);
				y = p.e(2);
				width = d.e(1);
				height = d.e(2);
				radius = r.e(1);
				context.beginPath();
				context.moveTo(x, y + radius);
				context.lineTo(x, y + height - radius);
				context.quadraticCurveTo(x, y + height, x + radius, y + height);
				context.lineTo(x + width - radius, y + height);
				context.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
				context.lineTo(x + width, y + radius);
				context.quadraticCurveTo(x + width, y, x + width - radius, y);
				context.lineTo(x + radius, y);
				context.quadraticCurveTo(x, y, x, y + radius);
				context.closePath();
				return shape;
			};

			shape.square = function (x, y, s) {
				return shape.rect(x, y, s, s);
			};

			shape.text = function () {
				textBuffer.push(Array.slice(arguments));
				return shape;
			};

			shape.clear = function () {
				context.clearRect(0, 0, canvas.width, canvas.height);
				textBuffer = [];
				return shape;
			};

			shape.beginViewport = function (x, y, width, height, xrange, yrange) {
				var origin = transform(x, y),
					view_xrange = {from: x, to: x + width},
					view_yrange = {from: y, to: y + height},
					x_scale = 1,
					y_scale = 1;

				xrange = xrange || {from: 0, to: Interval.width(view_xrange)};
				yrange = yrange || {from: 0, to: Interval.width(view_yrange)};

				x_scale = Interval.width(view_xrange) / Interval.width(xrange);
				y_scale = Interval.width(view_yrange) / Interval.width(yrange);

				context.save();
				context.translate(origin.e(1), origin.e(2));
			
				transformation.push($M([
						[x_scale, 0, -xrange.from * x_scale],
						[0, y_scale, -yrange.from * y_scale],
						[0, 0, 1]
					]));
				return shape;
			};

			shape.closeViewport = function () {
				transformation.pop();
				context.restore();
				textBuffer = [];
				return shape;
			};

			if (context.fillText && context.measureText && context.strokeText) {
				text.draw = function (x, y, str, options, type) {
					var p = transform(x, y);		
					options = options || {};
			
					if (options.textAlign) {
						context.textAlign = options.textAlign;
					}
				
					if (options.font) {
						context.font = options.font;
					}

					context.save();
					context.scale(1, -1);
					if (type === 'stroke') {
						context.strokeText(str, p.e(1), -p.e(2));
					}
					else if (type === 'fill') {
						context.fillText(str, p.e(1), -p.e(2));
					}
					context.restore();
					return shape;
				};

				shape.textSize = function (str, options) {
					// TODO: test this
					var result = {
							width: 0,
							height: 0
						},
						previousFont = context.font;

					if (options && options.font) {
						context.font = options.font;
					}
					if (str) {
						result.width = context.measureText(str).width;
						result.height = Number(fontHeight.exec(context.font)[1]) || 10;
					}
					context.font = previousFont;
					return result;
				};
			}
			else if (context.mozDrawText && context.mozMeasureText && context.mozPathText) {
				text.draw = function(x, y, str, options, type) {
					var xOffset = 0,
						yOffset = 0,
						p = transform(x, y),
						previousFont = context.mozTextStyle,
						numerical = (typeof str === 'number' && !isNaN(str)),
						size = shape.textSize(str, options);
	
					options = options || {};

					if (options.font) {
						context.mozTextStyle = options.font;
					}

					if (options.textAlign) {
						if (numerical && Math.isNegative(str) && options.textAlign === 'center') {
							xOffset = -context.mozMeasureText(Math.abs(str));
							xOffset -= context.mozMeasureText('-') * 2;
						}
						else {
							xOffset = -size.width;
						}

						if (options.textAlign === "center") {
							xOffset /= 2;
						}
						else if (options.textAlign === "left" || options.textAlign === "start") {
							xOffset = 0;
						}
					}

					if (options.textBaseLine) {
						yOffset = size.height;
				
						if (options.textBaseLine === 'middle') {
							yOffset /= 2;
						}
						else if (options.textBaseLine === 'bottom') {
							yOffset = 0;
						}
					}

					context.save();
					context.scale(1, -1);
					if (options.anchor && options.anchor === true) {
						context.arc(p.e(1), -p.e(2), 1, 0, Math.PI * 2, false);
						context.fill();
					}
					if (options.box && options.box === true) {
						context.rect(p.e(1) + xOffset, -p.e(2) + yOffset, size.width, -size.height);
						context.stroke();
					}

					context.translate(p.e(1) + xOffset, -p.e(2) + yOffset);

					if (type === 'stroke') {
						context.mozPathText(str);
						context.stroke();
					}
					else if (type === 'fill') {			
						context.mozDrawText(str);
					}			
					context.restore();
					context.mozTextStyle = previousFont;
				};

				shape.textSize = function (str, options) {
					var result = {
							width: 0,
							height: 0
						},
						previousFont = context.mozTextStyle;

					// TODO: Figure out why the initial font size is 16px instead
					// of 10 as the mozilla documentation claims and why the 
					// mozTextStyle property is initially empty. Another good 
					// question would be why a context save/restore does not 
					// correctly reset the font attributes.
					if (options && options.font) {
						context.mozTextStyle = options.font;
					}
					if (str) {
						result.width = context.mozMeasureText(str);
						result.height = (Number(fontHeight.exec(context.mozTextStyle)[1]) || 11) * 0.85;
					}
					context.mozTextStyle = previousFont;
					return result;
				};
			}
			else {
				// not supported
				text.draw = function () {
				};
			}

			// Invert the y axis so the 0, 0 point is in the
			// lower left corner of the canvas.
			context.scale(1, -1);
			context.translate(0, -canvas.height);
			context.translate(0.5, 0.5);
			context.lineWidth = 1.0;
			context.strokeStyle = 'rgb(170,170,170)';
			context.fillStyle = 'rgb(20,20,20)';

			if (!context.font) {
				context.font = '11px sans-serif';
			}
			if (!context.mozTextStyle) {
				context.mozTextStyle = '11px sans-serif';
			}
			return shape;
		}
		else {
			throw new TypeError('The canvas element identifier was not found, or the canvas context is not available.');
		}
	};
}();
