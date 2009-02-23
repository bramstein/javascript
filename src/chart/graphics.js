/*
 * var c = graphics(ctx);
 * c.beginPath().
 *	moveTo(10, 12).
 *  lineTo(50, 20).
 *  lineTo(200, 10).
 * closePath().
 * fill();
 */
/*global document, $V, $M, Interval, defaults, font*/
var graphics = function () {
	var path = {};
	var shape = {};
	var text = {};

	/**
	 * Converts polar coordinates to cartesian.
	 */
	function toCartesian(v) {
		return $V([v.e(1) * Math.cos(v.e(2)), v.e(1) * Math.sin(v.e(2)), 1]);
	}

	/**
	 * Rounds numbers to the nearest .5 number.
	 */
	function round(n) {
		var t = Math.roundTo(n, 0.5);
		if (Math.round(n) === t) {
			t -= 0.5;
		}
		return t;
	}

	return function (identifier) {
		var context = null,
			canvas = document.getElementById(identifier),
			transformation = [],
			coordinate = [],
			textBuffer = [];

		function transform(x, y, forceCartesian) {
			if (!forceCartesian) {
				return transformation.reduceRight(function (i, item) {
					return item.multiply(i);
				}, coordinate.peek() ? toCartesian($V([x, y, 1])) : $V([x, y, 1]));
			}
			else {
				return transformation.reduceRight(function (i, item) {
					return item.multiply(i);
				}, $V([x, y, 1]));
			}
		}

		function inverseTransform(x, y) {
			return transformation.reduceRight(function (i, item) {
				return item.inverse().multiply(i);
			}, coordinate.peek() ? toCartesian($V([x, y, 1])) : $V([x, y, 1]));
		}

		function transform_length(w, h) {
			var o = transform(0, 0, true),
				r = transform(w, h, true);
			return r.subtract(o);
		}

		if (canvas && canvas.getContext !== undefined && canvas.getContext('2d') !== undefined) {
			context = canvas.getContext('2d');

			['lineTo', 'moveTo', 'arcTo', 'bezierCurveTo', 'quadraticCurveTo'].forEach(function (n) {
				path[n] = function (x, y) {
					var p = transform(x, y);
					context[n].apply(context, [round(p.e(1)), round(p.e(2))]);
					return path;
				};
			});

			['stroke', 'fill'].forEach(function (n) {
				shape[n] = function (c, w) {
					var p = n + 'Style',
						previousStyle = context[p],
						previousWidth = context.lineWidth;

					if (w) {
						context.lineWidth = w;
					}

					if (c) {
						context[p] = c;
					}

					if (!textBuffer.isEmpty()) {
						textBuffer.forEach(function (args) {
							defaults.text[n].apply(shape, args);
						});
						textBuffer = [];
					}
					else {
						context[n].apply(context, []);
					}

					if (w) {
						context.lineWidth = previousWidth;
					}

					if (c) {
						context[p] = previousStyle;
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

			shape.beginClip = function (x, y, width, height) {
				var p = transform(x, y),
					d = transform_length(width, height);
				x = round(p.e(1));
				y = round(p.e(2));
				width = Math.ceil(d.e(1));
				height = Math.ceil(d.e(2));

				context.save();
				context.beginPath();
					context.rect(x, y, width, height);
				context.clip();
			};

			shape.closeClip = function () {
				context.restore();
			};

			shape.rect = function (x, y, width, height) {
				var p = transform(x, y),
					d = transform_length(width, height);
				x = p.e(1);
				y = p.e(2);
				width = d.e(1);
				height = d.e(2);

				// we don't use the round functions here because a filled
				// rectangle is already drawn crisp. If the rectangular path
				// is stroked lines are however blurred. Fortunately we rarely
				// draw stroked rectangles. Unfortunately this sometimes creates
				// rounding errors in drawings resulting in visual artifacts.
				context.beginPath();
					context.rect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
				context.closePath();
				return shape;
			};

			shape.line = function (x1, y1, x2, y2) {
				var p1 = transform(x1, y1),
					p2 = transform(x2, y2);

				context.beginPath();
					context.moveTo(round(p1.e(1)), round(p1.e(2)));
					context.lineTo(round(p2.e(1)), round(p2.e(2)));
				context.closePath();
				return shape;
			};

			shape.circle = function (x, y, radius) {
				var p = transform(x, y);
				x = round(p.e(1));
				y = round(p.e(2));
				context.beginPath();
				context.arc(x, y, radius / 2, 0, Math.PI * 2, false);
				context.closePath();
				return shape;
			};

			shape.triangle = function (x, y, size) {
				var p = transform(x, y),
					h = size * Math.sqrt(3) / 2;
				x = round(p.e(1));
				y = round(p.e(2));
	
				context.beginPath();
				context.moveTo(x - size /2, y - h / 2); // left
				context.lineTo(x + size / 2, y - h / 2); // right
				context.lineTo(x, y + h /2); // top
				context.closePath();
				return shape;
			};

			shape.cross = function (x, y, size) {
				var p = transform(x, y);

				x = round(p.e(1));
				y = round(p.e(2));

				context.beginPath();
				context.moveTo(x - size / 2, y);
				context.lineTo(x + size / 2, y);
				context.moveTo(x, y - size / 2);
				context.lineTo(x, y + size / 2);
				context.closePath();
				
				return shape;
			};

			shape.diamond = function (x, y, size) {
				var p = transform(x, y);
				context.save();
				context.translate(p.e(1), p.e(2));
				context.rotate(Math.PI / 4);
				context.translate(-p.e(1), -p.e(2));
				shape.square(x, y, size);
				context.restore();
				return shape;
			};

			shape.vdash = function (x, y, size) {
				var p = transform(x, y);

				x = p.e(1);
				y = p.e(2);

				context.beginPath();
				context.moveTo(round(x), round(y));
				context.lineTo(round(x), round(y) + size);
				context.closePath();
				return shape;
				
			};

			shape.hdash = function (x, y, size) {
				var p = transform(x, y);

				x = p.e(1);
				y = p.e(2);

				context.beginPath();
				context.moveTo(round(x), round(y));
				context.lineTo(round(x) + size, round(y));
				context.closePath();
				return shape;
			};

			shape.ellipse = function (x, y, hr, vr) {
				var p = transform(x, y),
					r = transform_length(hr, vr);
				context.save();
				context.translate(round(p.e(1)), round(p.e(2)));
				context.beginPath();
				if (r.e(1) !== 0) {
					context.scale(1, r.e(2) / r.e(1));
				}
				context.arc(0, 0, r.e(1), 0, Math.PI * 2, false);
				context.closePath();
				context.restore();
				return shape;
			};

			shape.square = function (x, y, size) {
				var p = transform(x, y);

				x = Math.round(p.e(1)) - size / 2;
				y = Math.round(p.e(2)) - size / 2;

				context.beginPath();
				context.rect(x, y, size, size);
				context.closePath();
				return shape;
			};

			shape.text = function (x, y, str, options) {
				var p = transform(x, y);
				options.font = font.parse(options.font);
				textBuffer.push([context, round(p.e(1)), round(p.e(2)), str, options]);
				return shape;
			}.defaults(0, 0, "", {});

			shape.clear = function () {
				context.clearRect(0, 0, canvas.width, canvas.height);
				textBuffer = [];
				return shape;
			};

			shape.beginViewport = function (x, y, width, height, options) {
				var origin = transform(x, y),
					view = {
						horizontal: {
							from: x,
							to: x + width
						},
						vertical: {
							from: y,
							to: y + height
						}
					},
					scale = {
						horizontal: 1,
						vertical: 1
					},
					range = {
						horizontal: {
							from: 0,
							to: Interval.width(view.horizontal)
						},
						vertical: {
							from: 0,
							to: Interval.width(view.vertical)
						}
					};

				if (options && options.range) {
					range.horizontal = options.range.horizontal || range.horizontal;
					range.vertical = options.range.vertical || range.vertical;
				}

				scale.horizontal = Interval.width(view.horizontal) / Interval.width(range.horizontal);
				scale.vertical = Interval.width(view.vertical) / Interval.width(range.vertical);

				context.save();
				context.translate(Math.round(origin.e(1)), Math.round(origin.e(2)));
				
				transformation.push($M([
						[scale.horizontal, 0, -range.horizontal.from * scale.horizontal],
						[0, scale.vertical, -range.vertical.from * scale.vertical],
						[0, 0, 1]
					]));

				coordinate.push((options && options.polar === true) || false);

				textBuffer = [];

				return shape;
			};

			shape.pixelSize = function () {
				var origin = inverseTransform(0, 0),
					dimension = inverseTransform(1, 1),
					result = dimension.subtract(origin);

				return {
					horizontal: result.e(1),
					vertical: result.e(2)
				};
			};

			shape.closeViewport = function () {
				transformation.pop();
				coordinate.pop();
				context.restore();
				textBuffer = [];
				return shape;
			};

			// Invert the y axis so the 0, 0 point is in the
			// lower left corner of the canvas.
			context.scale(1, -1);
			context.translate(0, -canvas.height);
			context.lineWidth = 1.0;
			context.strokeStyle = 'rgb(255,255,255)';
			context.fillStyle = 'rgb(255,255,255)';

			return shape;
		}
		else {
			throw new TypeError('The canvas element identifier was not found, or the canvas context is not available.');
		}
	};
}();
