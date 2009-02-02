/*global bounds, insets, maximum, font, defaults*/
var title = function () {
	return function (options) {
		var that = {},
			title = options.title || "",
			subtitle = options.subtitle || "";

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
				var titleSize = font.size(title, defaults.font.title),
					subtitleSize = font.size(subtitle, defaults.font.subtitle),
					insets = that.insets();

				return {
					width: Math.max(titleSize.width, subtitleSize.width) + insets.left + insets.right,
					height: titleSize.height + subtitleSize.height + (subtitleSize.height * 0.2) + insets.top + insets.bottom
				};
			},
			draw: function (g) {
				var b = that.bounds();
				g.beginViewport(b.x, b.y, b.width, b.height);
				if (title.length !== 0) {
					g.text(b.width / 2, b.height - that.insets().top, title, {textAlign: 'center', textBaseLine: 'top', font: defaults.font.title}).fill(defaults.color.title);
				}
				if (subtitle.length !== 0) {
					g.text(b.width / 2, that.insets().bottom, subtitle, {textAlign: 'center', textBaseLine: 'bottom', font: defaults.font.subtitle}).fill(defaults.color.subtitle);
				}
				g.closeViewport();
			//	graphics.rect(b.x, b.y, b.width, b.height).stroke('rgb(0, 255, 0)');
			}
		});

		return that;
	}.defaults({});
}();
