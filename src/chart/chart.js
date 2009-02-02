
/*global bounds, insets, graphics, jLayout, container, title, canvas, defaults*/
var chart = function () {
	return function (options, shared) {
		var that = {},
			c, t, l,
			my = shared || {};

		if (my.axes === undefined) {
			throw new TypeError('A subclass of chart must specify axes.');

		}
		// Axes can be overridden by a user supplied value
		if (options.axes) {
			my.axes = {
				horizontal: options.axes.horizontal || my.axes.horizontal,
				vertical: options.axes.vertical || my.axes.vertical
			};
		}

		// Title & Subtitle
		if ((options.title && options.subtitle) || options.title) {
			t = title({
				title: options.title,
				subtitle: options.subtitle || undefined
			});
		}
		else {
			t = title();
		}

		// Aspect Ratio
		my.ratio = {
			horizontal: my.ratio.horizontal || 1,
			vertical: my.ratio.vertical || 1
		};

		if (options.ratio) {
			my.ratio.horizontal = options.ratio.horizontal || my.ratio.horizontal;
			my.ratio.vertical = options.ratio.vertical || my.ratio.vertical;
		}

		c = canvas({
			ratio: my.ratio,
			axes: my.axes
		});

		l = jLayout.border({
			center: c,
			south: t
		});

		// Mixin the following properties
		that = bounds(that);
		that = insets(that);
		that = container(that, l);

		Object.extend(that, {
			plot: function (g) {
				// sub classes override this method and do their custom
				// painting.
			},
			// Define a basic draw function
			draw: function (g) {
				var b = that.bounds();

				g.beginViewport(b.x, b.y, b.width, b.height).
					rect(0, 0, b.width, b.height).
					fill(defaults.color.background.chart);
				t.draw(g);
				c.draw(g, that.plot);
				g.closeViewport();
			}
		});
		return that;
	};
}();
