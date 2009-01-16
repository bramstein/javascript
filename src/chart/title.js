
/*global bounds, insets, maximum*/
var title = function () {
	return function (graphics, options) {
		var that = {},
			title = options.title,
			subtitle = options.subtitle;

		if (!title || title.length === 0) {
			throw new TypeError('A title must contain at least one character.');
		}

		that = bounds(that);
		that = insets(that);
		that = maximum(that);

		Object.extend(that, {
			doLayout: function () {
			},
			isVisible: function () {
				return true;
			},
			preferredSize: function () {
				return that.minimumSize();
			},
			minimumSize: function () {
				var titleSize = graphics.textSize(title, options.font),
					subtitleSize = graphics.textSize(subtitle, options.font),
					insets = that.insets();
				
				return {
					width: Math.max(titleSize.width, subtitleSize.width) + insets.left + insets.right,
					height: titleSize.height + subtitleSize.height + (subtitleSize.height * 0.6) + insets.top + insets.bottom
				};
			},
			draw: function () {
				var b = that.bounds();
				graphics.beginViewport(b.x, b.y, b.width, b.height);
				graphics.text(b.width / 2, b.height - that.insets().top, title, Object.extend(options, { textAlign: 'center', textBaseLine: 'top'})).fill(defaults.color.title);
				graphics.text(b.width / 2, that.insets().bottom, subtitle, Object.extend(options, {textAlign: 'center', textBaseLine: 'bottom', font: {weight: 'normal', style: 'italic' }})).fill(defaults.color.subtitle);
				graphics.closeViewport();
			//	graphics.rect(b.x, b.y, b.width, b.height).stroke('rgb(0, 255, 0)');
			}
		});

		return that;
	}.defaults({});
}();
