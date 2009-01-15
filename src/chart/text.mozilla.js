
/*global defaults*/
(function () {
	function stroke(context, str) {
		context.beginPath();
		context.mozPathText(str);
		context.stroke();
	}

	function fill(context, str) {
		context.mozDrawText(str);
	}

	function draw(context, x, y, str, options, f) {
		var xOffset = 0,
			yOffset = 0,
			previousFont = context.mozTextStyle,
			numerical = (typeof str === 'number' && !isNaN(str)),
			size = defaults.text.size(context, str, options.font),
			fillStyle = context.fillStyle;

		context.mozTextStyle = options.font.toString();

		if (options.textAlign) {
			if (numerical && Math.isNegative(str) && options.textAlign === 'center') {
				xOffset = -context.mozMeasureText(Math.abs(str).toLocaleString());
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
			context.beginPath();
			context.arc(x, -y, 1, 0, Math.PI * 2, false);
			context.closePath();
			context.fill();
		}
		if (options.box && options.box === true) {
			context.strokeRect(x + xOffset, -y + yOffset, size.width, -size.height);
		}
		if (options.background) {
			context.fillStyle = options.background;
			context.fillRect(x + xOffset, -y + yOffset, size.width, -size.height);
			context.fillStyle = fillStyle;
		}

		context.translate(x + xOffset, -y + yOffset);
		f(context, str.toLocaleString());
		context.restore();
		context.mozTextStyle = previousFont;
	}

	Object.extend(defaults.text, {
		fill: function (context, x, y, str, options) {
			draw(context, x, y, str, options, fill);
		},
		stroke: function (context, x, y, str, options) {
			draw(context, x, y, str, options, stroke);
		},
		size: function (context, str, font) {
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
			context.mozTextStyle = font.toString();
			if (str !== undefined) {
				result.width = context.mozMeasureText(str.toLocaleString());
				result.height = font.size * 0.85;
			}
			context.mozTextStyle = previousFont;
			return result;
		}
	});
})();
