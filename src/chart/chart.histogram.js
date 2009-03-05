/*global defaults, data, axis, chart*/
Object.extend(defaults.type, {
	histogram: function (canvasIdentifier, d, options) {
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
			},

			input = data(d),

			that;

		input.values.forEach(function (v) {
			range.vertical.from = Math.min(range.vertical.from, v);
			range.vertical.to = Math.max(range.vertical.to, v);
		});

		range.vertical.from = range.vertical.from > 0 ? 0 : range.vertical;
		range.vertical.to += 0.001;

		my.axes = {
			horizontal: axis({categories: input.categories, label: 'Height (feet)'}),
			vertical: axis(Object.extend(range.vertical, {ticks: {major: 10}, label: 'Frequency'}))
		};

		that = chart(canvasIdentifier, options, my);

		Object.extend(that, {
			plot: function (g) {
				var i = 0;
				input.values.forEach(function (v) {
					g.rect(i, 0, 1, v).
					fill('rgb(120, 120, 120)');
					i += 1;
				});
			}
		});
		return that;
	}
});
