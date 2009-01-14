
/*global defaults*/
Object.extend(defaults.text, {
	fill: function (context, x, y, str, options) {
		if (options.textAlign) {
			context.textAlign = options.textAlign;
		}
	
		if (options.font) {
			context.font = options.font.toString();
		}

		context.save();
		context.scale(1, -1);
		context.fillText(str, x, -y);
		context.restore();
	},
	stroke: function (context, x, y, str, options) {
		if (options.textAlign) {
			context.textAlign = options.textAlign;
		}
	
		if (options.font) {
			context.font = options.font.toString();
		}

		context.save();
		context.scale(1, -1);
		context.strokeText(str, x, -y);
		context.restore();
	},
	size: function (context, str, font) {
		var result = {
				width: 0,
				height: 0
			},
			previousFont = context.font;

		context.font = font.toString();
		
		if (str !== undefined) {
			result.width = context.measureText(str).width;
			result.height = font.size * 0.85;
		}
		context.font = previousFont;
	}
});
