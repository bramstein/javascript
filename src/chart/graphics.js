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

	function roundUp(n) {
		var t = Math.roundTo(n, 0.5);
		if (Math.round(n) === t) {
			t += 0.5;
		}
		return t;
	}

	return function (identifier) {
		var context = null,
			canvas = document.getElementById(identifier),
			transformation = [],
			coordinate = [],
			textBuffer = [];

		function transform(x, y) {
			return transformation.reduceRight(function (i, item) {
				return item.multiply(i);
			}, coordinate.peek() ? toCartesian($V([x, y, 1])) : $V([x, y, 1]));
		}

		function transform_length(w, h) {
			var o = transform(0, 0),
				r = transform(w, h);
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
				shape[n] = function (c) {
					var p = n + 'Style',
						previous = context[p];

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

					if (c) {
						context[p] = previous;
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
				x = round(p.e(1));
				y = round(p.e(2));
				width = Math.round(d.e(1)) - 1;
				height = Math.round(d.e(2)) - 1;

				console.log(x + " " + y);
				console.log(width + " " + height);	
				context.lineCap = 'square';
				context.beginPath();
				// left
				context.moveTo(roundUp(x), roundUp(y));
				context.lineTo(roundUp(x), round(y + (height - 1)));

				// top
			//	context.moveTo(x, round(y + (height - 1)));
				context.lineTo(round(x + (width - 1)), round(y + (height - 1)));

				// right
			//	context.moveTo(round(x + (width - 1)), y);
				context.lineTo(round(x + (width - 1)), round(y + (height - 1)));

				// bottom
				//context.moveTo(x, roundUp(y));
				context.lineTo(round(x + (width - 1)), roundUp(y));

			//	context.rect(x, y, width, height);
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
				return shape.ellipse(x, y, radius, radius);
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

			shape.square = function (x, y, s) {
				return shape.rect(x, y, s, s);
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

			font = font();

			return shape;
		}
		else {
			throw new TypeError('The canvas element identifier was not found, or the canvas context is not available.');
		}
	};
}();
