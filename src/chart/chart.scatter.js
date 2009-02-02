
Object.extend(defaults.type, {
	scatter: function (d, options) {
		var my = {
				ratio: {
					horizontal: 1.61,
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
			};

		// Check that:
		// * the data has x,y
		// * category or not
		if (data.isValid(d)) {
			if (d.labels() !== undefined) {
				d.data().forEach(function (category) {
					range.horizontal.from = Math.min(range.horizontal.from, category.min()[0]);
					range.horizontal.to = Math.max(range.horizontal.to, category.max()[0]);
	
					range.vertical.from = Math.min(range.vertical.from, category.min()[1]);
					range.vertical.to = Math.max(range.vertical.to, category.max()[1]);	
				});

			}
			else {
				range.horizontal.from = d.min()[0];
				range.horizontal.to = d.max()[0];
	
				range.vertical.from = d.min()[1];
				range.vertical.to = d.max()[1];		
			}
		}

		my.axes = {
			horizontal: axis(Object.extend(range.horizontal, { ticks: { major: 10 } })),
			vertical: axis(Object.extend(range.vertical, { ticks: { major: 10 } }))
		};

		that = chart(options, my);

		Object.extend(that, {
			plot: function (g) {
				var type = 0;
				if (d.labels() !== undefined && d.labels().length > 1) {
					// More than one category
					d.data().forEach(function (category) {
						category.data().forEach(function (pair) {
							g[defaults.point[type]](pair[0], pair[1], 6.5).stroke(defaults.color.data.qualitative_highlight[type]);
						});
						type += 1;
					});
				}
				else if (d.labels() !== undefined) {
					// One category
					d.data().forEach(function (category) {
						category.data().forEach(function (pair) {
							g[defaults.point[0]](pair[0], pair[1], 6.5).stroke(defaults.color.data.standard);
						});
					});
				}
				else {
					// No category
					d.data().forEach (function (pair) {
						g[defaults.point[0]](pair[0], pair[1], 6.5).stroke(defaults.color.data.standard);
					});
				}
			}
		});
		return that;
	}
});
