/*global defaults, chart, Interval*/

Object.extend(defaults.type, {
	plot: function (canvasIdentifier, f, options) {
		var my = {
				ratio: {
					horizontal: 1,
					vertical: 1
				}
			},

			range = {},	

			pixel,

			pixelSize = 1,

			that;
	
		options = options || {};

		if (options.axes === undefined && options.axes.horizontal !== undefined && options.axes.vertical !== undefined) {
			throw new TypeError('Plotting requires explicit axes specification.');
		}

		if (options.axes.polar) {
			range.horizontal = {
				from: options.axes.polar.from,
				to: options.axes.polar.to
			};

			range.vertical = {
				from: options.axes.polar.from,
				to: options.axes.polar.to
			};
			
		}
		else {
			range.horizontal = {
				from: options.axes.horizontal.from,
				to: options.axes.horizontal.to
			};

			range.vertical = {
				from: options.axes.vertical.from,
				to: options.axes.vertical.to
			};
		}
		
		that = chart(canvasIdentifier, options, my);

		Object.extend(that, {
			quadtree: function (g, horizontal, vertical) {
				var F = f(horizontal, vertical);

				if (F.from <= 0 && 0 <= F.to) {
					if (Interval.width(horizontal) <= pixel.horizontal && Interval.width(vertical) <= pixel.vertical) {
						g.square((horizontal.from + horizontal.to) / 2, (vertical.from + vertical.to) / 2, pixelSize).fill('rgb(255, 0, 0)');
					}
					else {
						//if (Interval.width(horizontal) > pixel.horizontal * 4 && Interval.width(vertical) > pixel.vertical * 4) {
						//	g.rect(horizontal.from, vertical.from, Interval.width(horizontal), Interval.width(vertical)).stroke('rgb(128, 128, 128)');
						//}
						that.subdivide(g, horizontal, vertical);	
					}
				}
			},
			subdivide: function (g, horizontal, vertical) {
				var hk = (horizontal.from + horizontal.to) / 2;
				var vk = (vertical.from + vertical.to) / 2;

				that.quadtree(g, {from: horizontal.from, to: hk}, {from: vertical.from, to: vk});
				that.quadtree(g, {from: horizontal.from, to: hk}, {from: vk, to: vertical.to});
				that.quadtree(g, {from: hk, to: horizontal.to}, {from: vk, to: vertical.to});
				that.quadtree(g, {from: hk, to: horizontal.to}, {from: vertical.from, to: vk});
			},
			plot: function (g) {
				pixel = g.pixelSize();
				pixel.horizontal *= pixelSize;
				pixel.vertical *= pixelSize;
				if (options.range === undefined) {
					that.quadtree(g, range.horizontal, range.vertical);
				}
				else {
					that.quadtree(g, range.horizontal, options.range);
				}
			}
		});
		return that;
	}
});
