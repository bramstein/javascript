
/*global bounds, insets, graphics, jLayout, container*/
var chart = function () {
	return function (elementIdentifier, ha, va, str) {
		var g = graphics(elementIdentifier),
			c = canvas(g, {horizontalAxis: ha, verticalAxis: va}),
			t = title(g, {title: str }),
			layout = jLayout.border({
				vgap: 5,
				hgap: 5,
				center: c,
				south: t
			});

		var that = {
			draw: function () {
				var b = that.bounds();
				g.beginViewport(b.x, b.y, b.width, b.height);
				c.draw();
				t.draw();
				g.closeViewport();
			}
		};

		that = bounds(that);
		that = insets(that);
		that = container(that, layout);

		return that;
	};
}();
