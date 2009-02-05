
Object.extend(defaults.type, {
	bar: function (d, options) {
		var my = {
				ratio: {
					horizontal: 1.61,
					vertical: 1
				},
				draw: {
					vertical: {
						grid: true
					},
					horizontal: {
						grid: true
					}
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

			input = data(d),

			that;

		if (input.categories.isEmpty()) {
			throw new TypeError('A bar chart must contain at least one category');
		}
		else if (input.subcategories.isEmpty()) {
			// one or more categories
			input.values.forEach(function (v) {
				range.vertical.from = Math.min(range.vertical.from, v);
				range.vertical.to = Math.max(range.vertical.to, v);
			});
		}
		else {
			// one or more categories and subcategories
			input.values.forEach(function (set) {
				set.forEach(function (v) {
					range.vertical.from = Math.min(range.vertical.from, v);
					range.vertical.to = Math.max(range.vertical.to, v);
				});
			});
		}

		if (range.vertical.from > 0) {
			range.vertical.from = 0;
		}

		my.axes = {
			horizontal: axis({categories: input.categories}),
			vertical: axis(Object.extend(range.vertical, {ticks: {major: 10}}))
		};

		that = chart(options, my);

		Object.extend(that, {
			plot: function (g) {
				var i = 0;
				if (input.subcategories.isEmpty()) {
					input.values.forEach(function (v) {
						g.rect(i + 0.25, 0, 0.5, v).
						fill(defaults.color.data.qualitative[0]);
						i += 1;
					});
				}
				else {
					input.values.forEach(function (set) {
						var size = 0.5 / set.length,
							start =  0, j = 0;
						set.forEach(function (v) {
							g.rect(i + 0.25 + start, 0, size, v).
							fill(defaults.color.data.qualitative[j]);
							start += size;
							j += 1;
						});
						i += 1;
					});
				}				
			}
		});
		return that;
	}
});
