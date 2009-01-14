
/*global bounds, insets, graphics, jLayout, container, title, canvas*/
var chart = function () {
	return function (elementIdentifier, ha, va, titleString, subtitleString) {
		var g = graphics(elementIdentifier),

			c = canvas(g, {
				horizontalAxis: ha,
				verticalAxis: va,
				ratio: {
					horizontal: 1,
					vertical: 1
				}
			}),

			t = title(g, {
				title: titleString,
				subtitle: subtitleString,
				font: {
					size: 12,
					weight: 'bold'
				}
			}),

			layout = jLayout.border({
				vgap: 5,
				hgap: 5,
				center: c,
				south: t
			});

		t.insets({top: 10, bottom: 10});

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
