
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
			size = font.size(str, options.font),
			fillStyle = context.fillStyle;

		context.mozTextStyle = options.font.toString();

		if (options.textAlign) {
			if (numerical && Math.isNegative(str) && options.textAlign === 'center') {
				xOffset = -font.size(Math.abs(str).toLocaleString(), options.font).width;
				xOffset -= font.size('-', options.font).width * 2;
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

		context.translate(x + xOffset, -y + yOffset - options.font.size / 4);
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
		}
	});
})();
