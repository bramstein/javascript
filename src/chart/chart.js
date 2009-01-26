
/*global bounds, insets, graphics, jLayout, container, title, canvas, defaults*/
var chart = function () {
	return function (axes, titleString, subtitleString) {
		var	c = canvas({
				axes: axes,
				ratio: {
					horizontal: 1.61,
					vertical: 1
				},
				draw: {
					horizontal: {
						grid: false,
						labels: true,
						tight: false
					},
					vertical: {
						tight: true,
						grid: true,
						tight: false
					}
				}
			}),

			t = title({
				title: titleString,
				subtitle: subtitleString
			}),

			layout = jLayout.border({
				vgap: 0,
				hgap: 0,
				center: c,
				south: t
			});

		var that = {
			draw: function (g) {
				var b = that.bounds();
				g.beginViewport(b.x, b.y, b.width, b.height).
					rect(0, 0, b.width, b.height).
					fill(defaults.color.background.chart);
				c.draw(g);
				t.draw(g);
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
