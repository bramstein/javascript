
/*global bounds, insets, graphics, jLayout, container, title, canvas*/
var chart = function () {
	return function (g, axes, titleString, subtitleString) {
		var	c = canvas(g, {
				axes: axes,
				ratio: {
					horizontal: 1,
					vertical: 1
				},
				grid: true
			}),

			t = title(g, {
				title: titleString,
				subtitle: subtitleString
			}),

			layout = jLayout.border({
				vgap: 0,
				hgap: 0,
				center: c,
				south: t
			});

//		t.insets({top: 5, bottom: 5});

		var that = {
			draw: function () {
				var b = that.bounds();
				g.beginViewport(b.x, b.y, b.width, b.height);
				c.draw();
				t.draw();
				g.closeViewport();
			//	g.rect(b.x, b.y, b.width, b.height).stroke('rgb(0,0,255)');
			}
		};

		that = bounds(that);
		that = insets(that);
		that = container(that, layout);

		return that;
	};
}();
