/*
 * var c = renderer(ctx);
 * c.beginPath().
 *	moveTo(10, 12).
 *  lineTo(50, 20).
 *  lineTo(200, 10).
 * closePath().
 * fill();
 */
var renderer = function () {
	var path = {};
	var shape = {};

	return function (identifier) {
		var context = null,
			canvas = document.getElementById(identifier);

		if (canvas && canvas.getContext !== undefined && canvas.getContext('2d') !== undefined) {
			context = canvas.getContext('2d');

			// Invert the y axis so the 0, 0 point is in the
			// lower left corner of the canvas.
			context.scale(1, -1);
			context.translate(0, -canvas.height);

			['lineTo', 'moveTo', 'arcTo', 'bezierCurveTo', 'quadraticCurveTo'].forEach(function (n) {
				path[n] = function () {
					context[n].apply(context, arguments);
					return path;
				};
			});

			['stroke', 'fill'].forEach(function (n) {
				shape[n] = function () {
					context[n].apply(context, arguments);
					return shape;
				};
			});

			path.closePath = function () {
				context[n].apply(context, arguments);
				return shape;
			};

			shape.beginPath = function () {
				context[n].apply(context, arguments);
				return path;
			};

			shape.rect = function (x, y, width, height) {
				context.beginPath();
				context.rect(x, y, width, height);
				context.closePath();
				return shape;
			};

			shape.circle = function (x, y, radius) {
				context.beginPath();
				context.arc(x, y, radius, 0, Math.PI * 2, false);
				context.closePath();
				return shape;
			};

			shape.roundedRect = function (x, y, width, height, radius) {
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

			if (context.fillText && context.measureText) {
				shape.text = function (x, y, str) {
					context.save();
					context.scale(1, -1);
					context.fillText(str, x, - y);
					context.restore();
					return shape;
				};
			}
			else if (context.mozDrawText && context.mozMeasureText) {
				shape.text = function (x, y, str) {
					context.save();
					context.scale(1, -1);
					context.translate(x, -y);
					context.mozDrawText(str);
					context.restore();
					return shape;
				};
			}

			return shape;
		}
		else {
			throw new TypeError('The canvas element identifier was not found, or the canvas context is not available.');
		}
	};
}();
