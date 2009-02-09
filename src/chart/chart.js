
/*global bounds, insets, graphics, jLayout, container, title, canvas, defaults*/
var chart = function () {
	return function (canvasIdentifier, options, shared) {
		var that = {},
			g, c, t, l, le,
			my = shared || {},
			mybounds = {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			};

		if (my.axes === undefined) {
			throw new TypeError('A subclass of chart must specify axes.');
		}

		g = graphics(canvasIdentifier);
	
		options = options || {};

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

		my.draw = my.draw || {};

		if (options.draw) {
			my.draw = options.draw;
		}

		if (my.legend) {
			le = my.legend;
		}
		else {
			le = legend();
		}

		c = canvas({
			ratio: my.ratio,
			axes: my.axes,
			draw: my.draw
		});

		l = jLayout.border({
			center: c,
			south: t,
			east: le
		});

		// Mixin the following properties
		that = insets(that);
		that = container(that, l);

		Object.extend(that, {
			bounds: function (value) {
				if (value) {
					mybounds.x = value.x || mybounds.x;
					mybounds.y = value.y || mybounds.y;
					mybounds.width = value.width || mybounds.width;
					mybounds.height = value.height || mybounds.height;
					that.doLayout();
				}
				else {
					return mybounds;
				}
			},
			plot: function (g) {
				// sub classes override this method and do their custom
				// painting.
			},
			draw: function () {
				var b = that.bounds();

				g.beginViewport(b.x, b.y, b.width, b.height).
					rect(0, 0, b.width, b.height).
					fill(defaults.color.background.chart);
				t.draw(g);
				c.draw(g, that.plot);
				le.draw(g);
				g.closeViewport();
			},
		});
		return that;
	};
}();
