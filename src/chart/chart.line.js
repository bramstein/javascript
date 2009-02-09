
/**
 	{
 		categories: ['2000', '2001', '2003'],
		data: [1, 2, 3]
	}

	or

	{
		categories: ['2001', '2002', '2003', '2005'],
		subcategories: ['Engineering', 'Marketing', 'HR']
		data: [
				[1, 2, 4, 5],
				[2, 4, 6, 9],
				[0, 2, 1, 1]
		]
	}
 */
Object.extend(defaults.type, {
	line: function (canvasIdentifier, d, options) {
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

		if (input.categories.isEmpty()) {
			throw new TypeError('A line chart must contain at least one category or time period.');
		}
		else if (input.subcategories.isEmpty()) {
			input.values.forEach(function (v) {
				range.vertical.from = Math.min(range.vertical.from, v);
				range.vertical.to = Math.max(range.vertical.to, v);
			});
		}
		else {
			input.values.forEach(function (set) {
				set.forEach(function (v) {
					range.vertical.from = Math.min(range.vertical.from, v);
					range.vertical.to = Math.max(range.vertical.to, v);
				});
			});
		}
		range.vertical.from -= 0.001;
		range.vertical.to += 0.001;

		// TODO: what about polar line plots?
		my.axes = {
			horizontal: axis({categories: input.categories}),
			vertical: axis(Object.extend(range.vertical, {ticks: {major: 10}}))
		};

		that = chart(canvasIdentifier, options, my);

		var m = 0;

		// TODO: make sure the labels have at least some spacing between them,
		// otherwise create a legend.
		input.subcategories.forEach(function (c) {
			m = Math.max(font.size(c, defaults.font.inlineLabel).width, m);
		});

		// TODO: perhaps we should set the canvas padding instead of the
		// chart insets.
		that.insets({right: m});

		Object.extend(that, {
			plot: function (g) {
				var i = 0;
				if (input.subcategories.isEmpty()) {

					var p = g.beginPath();					
					p.moveTo(i + 0.5, input.values[0]);
					input.values.forEach(function (v) {
						p.lineTo(i + 0.5, v);
						i += 1;
					});
					p.endPath().
					stroke(defaults.color.data.qualitative_highlight[0], 1.5);
				}
				else {
					input.values.forEach(function (set) {
						var j = 0,
							p = g.beginPath();
						p.moveTo(j + 0.5, set[0]);
						set.forEach(function (v) {
							p.lineTo(j + 0.5, v);
							j += 1;
						});
						p.endPath().
						stroke(defaults.color.data.qualitative_highlight[i], 1.5);

						g.text((j - 1) + 0.5, set.peek(), input.subcategories[i], {
							textBaseLine: 'middle',
							font: defaults.font.inlineLabel,
							padding: {
								left: 8
							}
						}).
						fill(defaults.color.text);
						i += 1;
					});
				}				
			}
		});
		return that;
	}
});
