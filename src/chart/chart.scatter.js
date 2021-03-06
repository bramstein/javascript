/*global defaults, data, legend, axis, chart*/
Object.extend(defaults.type, {
	scatter: function (canvasIdentifier, d, options) {
		var my = {
				ratio: {
					horizontal: 1,
					vertical: 1
				}
			},
			range = {
				horizontal: {
					from: Number.MAX_VALUE,
					to: Number.MIN_VALUE
				},
				vertical: {
					from: Number.MAX_VALUE,
					to: Number.MIN_VALUE
				}
			},
			that = {},

			input = data(d);

		if (!input.subcategories.isEmpty()) {
			throw new TypeError('Scatter charts do not support sub categories.');
		}

		if (!input.categories.isEmpty()) {
			// multiple categories
			input.values.forEach(function (set) {	
				set.forEach(function (v) {
					range.horizontal.from = Math.min(range.horizontal.from, v[0]);
					range.horizontal.to = Math.max(range.horizontal.to, v[0]);
	
					range.vertical.from = Math.min(range.vertical.from, v[1]);
					range.vertical.to = Math.max(range.vertical.to, v[1]);	
				});
			});

			my.legend = legend({
				labels: input.categories,
				type: 'point',
				colors: defaults.color.data.qualitative_highlight
			});
		}
		else {
			if (Object.isArray(input.values[0]) && input.values[0].length === 2) {
				// no category
				input.values.forEach(function (v) {
					range.horizontal.from = Math.min(range.horizontal.from, v[0]);
					range.horizontal.to = Math.max(range.horizontal.to, v[0]);
	
					range.vertical.from = Math.min(range.vertical.from, v[1]);
					range.vertical.to = Math.max(range.vertical.to, v[1]);	
				});
			}
		}

		// This adds a small value to the range
		// to make sure all data point lie within
		// the range and not on the boundaries (i.e.
		// the inclusion property.)
		range.vertical.from -= 0.001;
		range.vertical.to += 0.001;

		range.horizontal.from -= 0.001;
		range.horizontal.to += 0.001;

		my.axes = {
			horizontal: axis(Object.extend(range.horizontal, { ticks: { major: 10 } })),
			vertical: axis(Object.extend(range.vertical, { ticks: { major: 10 } }))
		};

		that = chart(canvasIdentifier, options, my);

		Object.extend(that, {
			plot: function (g) {
				var i = 0;

				if (!input.categories.isEmpty()) {
					input.values.forEach(function (set) {
						set.forEach(function (v) {
							g[defaults.point[i]](v[0], v[1], 6.5).stroke(defaults.color.data.qualitative_highlight[i]);
						});
						i += 1;
					});
				}
				else {
					if (Object.isArray(input.values[0]) && input.values[0].length === 2) {
						// no category
						input.values.forEach(function (v) {
							g[defaults.point[i]](v[0], v[1], 6.5).stroke(defaults.color.data.standard);
							
						});
					}
				}
			}
		});
		return that;
	}
});
