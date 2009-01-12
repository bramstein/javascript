
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
				var titleSize = graphics.textSize(title, options);
					subtitleSize = graphics.textSize(subtitle, options),
					insets = that.insets();
				
				return {
					width: Math.max(titleSize.width, subtitleSize.width) + insets.left + insets.right,
					height: titleSize.height + subtitleSize.height + insets.top + insets.bottom
				};
			},
			draw: function () {
				var b = that.bounds();
				console.log(b);
				graphics.beginViewport(b.x, b.y, b.width, b.height);
				graphics.text(b.width / 2, b.height / 2, title, { textAlign: 'center', textBaseLine: 'middle'}).fill();
				graphics.closeViewport();
			}
		});

		return that;
	}.defaults({});
}();
