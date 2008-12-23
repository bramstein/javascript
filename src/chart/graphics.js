/*
 * var c = graphics(ctx);
 * c.beginPath().
 *	moveTo(10, 12).
 *  lineTo(50, 20).
 *  lineTo(200, 10).
 * closePath().
 * fill();
 */
/*global document*/
var graphics = function () {
	var path = {};
	var shape = {};

	return function (identifier, horizontalRange, verticalRange) {
		var context = null,
			canvas = document.getElementById(identifier),
			fontHeight = /([0-9]*)px/i;

		if (canvas && canvas.getContext !== undefined && canvas.getContext('2d') !== undefined) {
			context = canvas.getContext('2d');
/*
			if (!horizontalRange) {
				horizontalRange = {
					from: 0,
					to: canvas.width
				};
			}

			if (!verticalRange) {
				verticalRange = {
					from: 0,
					to: canvas.height
				};
			}
*/
			// Invert the y axis so the 0, 0 point is in the
			// lower left corner of the canvas.
			context.scale(1, -1);
			context.translate(0, -canvas.height);

			if (context.font !== undefined) {
				context.font = '16px sans-serif';
			}
			if (context.mozTextStyle !== undefined) {
				context.mozTextStyle = '16px sans-serif';
			}

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
				context.closePath();
				return shape;
			};

			shape.beginPath = function () {
				context.beginPath();
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

			shape.clear = function () {
				context.clearRect(0, 0, canvas.width, canvas.height);
			};

			shape.viewport = function (x, y, width, height) {
				context.beginPath();
				context.rect(x, y, width, height);
				context.closePath();
				context.clip();
				context.translate(x, y);
			};

			if (context.fillText && context.measureText) {
				shape.text = function (x, y, str, options) {
					var xOffset = 0;				

					options = options || {};
			
					if (options.textAlign) {
						context.textAlign = options.textAlign;
					}
				
					if (options.font) {
						context.font = options.font;
					}

					context.save();
					context.scale(1, -1);
					context.fillText(str, x, - y);
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
					result.width = context.measureText(str).width;
					result.height = new Number(fontHeight.exec(context.font)[1]) || 16;
					context.font = previousFont;
					return textMetrics.width;
				};
			}
			else if (context.mozDrawText && context.mozMeasureText) {
				shape.text = function (x, y, str, options) {
					var xOffset = 0;
			
					options = options || {};

					if (options.textAlign) {
						xOffset = -context.mozMeasureText(str);
	
						if (options.textAlign === "center") {
							xOffset /= 2;
						}
						else if (options.textAlign === "left" || options.textAlign === "start") {
							xOffset = 0;
						}
					}

					if (options.font) {
						context.mozTextStyle = options.font;
					}

					context.save();
					context.scale(1, -1);
					context.translate(x + xOffset, -y);
					context.mozDrawText(str);
					context.restore();
					return shape;
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
					
					result.width = context.mozMeasureText(str);
					result.height = new Number(fontHeight.exec(context.mozTextStyle)[1]) || 16;
					context.mozTextStyle = previousFont;
					return result;
				};
			}
			return shape;
		}
		else {
			throw new TypeError('The canvas element identifier was not found, or the canvas context is not available.');
		}
	};
}();
