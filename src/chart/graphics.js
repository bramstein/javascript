/*
 * var c = graphics(ctx);
 * c.beginPath().
 *	moveTo(10, 12).
 *  lineTo(50, 20).
 *  lineTo(200, 10).
 * closePath().
 * fill();
 */
/*global document, $V, $M, Interval, defaults*/
var graphics = function () {
	var path = {};
	var shape = {};
	var text = {};

	var parseFont = function (font) {
		var r = {
			size: 11,
			family: 'sans-serif',
			toString: function () {
				return this.style + " " + this.variant + " " + this.weight + " " + this.size + "px " + this.family;
			}
		};

		font = font || {};

		Object.forEach({ 
				style: ['normal', 'italic', 'oblique'],
				variant: ['normal', 'small-caps'],
				weight: ['normal', 'bold', 'bolder', 'lighter']
			}, function (n, k) {
				r[k] = n.contains(font[k]) && font[k] || n[0];
			});

		if (font.size) {
			r.size = (typeof font.size === 'number' && !isNaN(font.size) && font.size) || r.size;
		}

		if (font.family) {
			r.family = font.family || r.family;
		}
		return r;
	};

	return function (identifier) {
		var context = null,
			canvas = document.getElementById(identifier),
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
				shape[n] = function (c) {
					var fillStyle = context.fillStyle,
						strokeStyle = context.strokeStyle;

					if (c) {
						context.fillStyle = c;
						context.strokeStyle = c;
					}
					context[n].apply(context, []);

					if (!textBuffer.isEmpty()) {
						textBuffer.forEach(function (args) {
							defaults.text[n].apply(shape, args);
						});
						textBuffer = [];
					}
					if (c) {
						context.fillStyle = fillStyle;
						context.strokeStyle = strokeStyle;
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

			shape.text = function (x, y, str, options) {
				var p = transform(x, y);
				options.font = parseFont(options.font);
				textBuffer.push([context, p.e(1), p.e(2), str, options]);
				return shape;
			}.defaults(0, 0, "", {});

			shape.textSize = function (str, font) {
				font = parseFont(font);
				return defaults.text.size(context, str, font);
			}.defaults("", {});

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

			// Invert the y axis so the 0, 0 point is in the
			// lower left corner of the canvas.
			context.scale(1, -1);
			context.translate(0, -canvas.height);
			context.translate(0.5, 0.5);
			context.lineWidth = 1.0;
			//context.strokeStyle = 'rgb(170,170,170)';
			//context.fillStyle = 'rgb(20,20,20)';

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
