
/*global defaults*/
Object.extend(defaults.text, {
	fill: function (context, x, y, str, options) {
        var offset = {x: 0, y: 0},
            numerical = (typeof str === 'number' && !isNaN(str)),
            padding = {
                top: 0,
                bottom: 0,
                right: 0,
                left: 0
            };
    
        Object.forEach(padding, function (v, k) {
			padding[k] = options.padding && options.padding[k] || v;
		});
    
		if (options.textAlign) {        
			context.textAlign = options.textAlign;
		}
        
        if (options.textBaseLine) {
            context.textBaseline = options.textBaseLine;
        }
    
		if (options.font) {
			context.font = options.font.toString();
		}

		context.save();
		context.scale(1, -1);
		context.fillText(str, x + padding.left - padding.right, -y + padding.top - padding.bottom);
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
			result.height = font.size * 0.80;
		}
		context.font = previousFont;
	}
});
