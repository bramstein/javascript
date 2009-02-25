
/*
	var items = {
		labels: ['Set1', 'Set2', 'Set3']
		type: 'point|bar|line'
	};
 */
var legend = function () {
	var item = function () {
		return function (label, color, type) {
			var that = {};

			if (type === undefined || color === undefined || label === undefined) {
				throw new TypeError('Missing arguments for legend item.');
			}

			that = bounds(that);
			that = insets(that);
			that = maximum(that);

			Object.extend(that, {
				doLayout: function () {},
				isVisible: function () { return true; },
				preferredSize: function () { return that.minimumSize(); },
				minimumSize: function () {
					var insets = that.insets(),
						labelSize = font.size(label, defaults.font.labels);

					return {
						width: insets.left + insets.right + labelSize.width + 9 + 4.5,
						height: insets.bottom + insets.top + labelSize.height
					};				
				},
				draw: function (g) {
					var b = that.bounds(),
						insets = that.insets(),
						labelSize = font.size(label, defaults.font.labels);

					g.beginViewport(b.x, b.y, b.width, b.height);
				
					if (type === 'bar') {
						g.rect(insets.left, (b.height / 2) - 5, 9, 9).
						fill(color);
					}
					else if (type === 'line') {
						g.hdash(insets.left, (b.height / 2), 9).
						stroke(color, 1.5);
					}
					else {
						defaults.point.forEach(function (t) {
							if (t === type) {
								g[t](insets.left + 4.5, b.height / 2, 6.5).
								stroke(color);
							}
						});
					}
					g.text(insets.left + 9 + 4.5, (b.height / 2), label, {
						font: defaults.font.labels,
						textBaseLine: 'middle'
					}).
					fill(defaults.color.label);
					g.closeViewport();
				//	g.rect(b.x, b.y, b.width, b.height).stroke('rgb(0, 255, 0)');
				}
			});
			return that;
		}
	}();

	return function (items) {
		var that = {},
			l,
			myitems = [],
			i = 0,
			rows = 0;

		if (items && items.labels && Object.isArray(items.labels) && 
			items.type && Object.isString(items.type) && 
			items.colors && Object.isArray(items.colors)) {

			items.labels.forEach(function (s) {
				var t = items.type;

				if (t === 'point') {
					t = defaults.point[i];
				}

				myitems.push(item(s, items.colors[i], t));
				i += 1;
			});

			rows = items.labels.length;
		}

		l = jLayout.grid({
			'rows': 1,
			'columns': rows,
			'items': myitems.reverse()
		});

		that = bounds(that);
		that = insets(that);
		that = container(that, l);

		Object.extend(that, {
			draw: function (g) {
				var b = that.bounds();
				g.beginViewport(b.x, b.y, b.width, b.height);
				myitems.forEach(function (j) {
					j.draw(g);
				});
				g.closeViewport();
			}
		});

		that.insets({
			top: 15,
			bottom: 0,
			left: 35,
			right: 5
		});

		return that;
	};
}();
