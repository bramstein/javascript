/*global defaults, data, legend, axis, chart*/
Object.extend(defaults.type, {
	bar: function (canvasIdentifier, d, options) {
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

			that,
			
			reverse = options.reverse && options.reverse === true,
			stacked = options.stacked && options.stacked === true;

		if (input.categories.isEmpty()) {
			throw new TypeError('A bar chart must contain at least one category');
		}
		else if (input.subcategories.isEmpty()) {
			// one or more categories
			input.values.forEach(function (v) {
				range.vertical.from = Math.min(range.vertical.from, v);
				range.vertical.to = Math.max(range.vertical.to, v);
			});

			if (reverse) {
				input.categories.reverse();
				input.subcategories.reverse();
				input.values.reverse();
			}
		}
		else {
			if (reverse) {
				input.categories.reverse();
				input.subcategories.reverse();
				input.values.reverse();
				input.values = input.values.map(Array.reverse);
			}

			if (!stacked) {
				// one or more categories and subcategories
				input.values.forEach(function (set) {
					set.forEach(function (v) {
						range.vertical.from = Math.min(range.vertical.from, v);
						range.vertical.to = Math.max(range.vertical.to, v);
					});
				});
			}
			else {
				input.values.forEach(function (set) {
					var t = 0;
					set.forEach(function (v) {
						t += v;
					});
					range.vertical.from = Math.min(range.vertical.from, t);
					range.vertical.to = Math.max(range.vertical.to, t);
				});
			}

			my.legend = legend({
				labels: input.subcategories,
				type: 'bar',
				colors: defaults.color.data.qualitative
			});
		}

		if (range.vertical.from > 0) {
			range.vertical.from = 0;
		}

		if (reverse) {
			my.axes = {
				horizontal: axis(Object.extend(range.vertical, {ticks: {major: 10}})),
				vertical: axis({categories: input.categories})
			};
		}
		else {
			my.axes = {
				horizontal: axis({categories: input.categories}),
				vertical: axis(Object.extend(range.vertical, {ticks: {major: 10}}))
			};
		}

		that = chart(canvasIdentifier, options, my);

		Object.extend(that, {
			plot: function (g) {
				var i = 0;
				if (input.subcategories.isEmpty()) {					
					input.values.forEach(function (v) {
						if (reverse) {
							g.rect(0, i + 0.25, v, 0.5).
							fill(defaults.color.data.qualitative[0]);
						}
						else {
							g.rect(i + 0.25, 0, 0.5, v).
							fill(defaults.color.data.qualitative[0]);
						}
						i += 1;
					});
				}
				else if (!stacked) {
					input.values.forEach(function (set) {
						var size = input.values.length / (set.length * input.values.length + 2),
							start =  size / 2, j = 0;
						set.forEach(function (v) {
							if (reverse) {
								g.rect(0, i + start, v, size).
								fill(defaults.color.data.qualitative[j]);
							}
							else {
								g.rect(i + start, 0, size, v).
								fill(defaults.color.data.qualitative[j]);
							}
							start += size;
							j += 1;
						});
						i += 1;
					});
				}
				else if (stacked) {
					input.values.forEach(function (set) {
						var start = 0, j = 0;
						set.forEach(function (v) {
							if (reverse) {
								g.rect(start, i + 0.25, v, 0.5).
								fill(defaults.color.data.qualitative[j]);
							}
							else {
								g.rect(i + 0.25, start, 0.5, v).
								fill(defaults.color.data.qualitative[j]);
							}
							start += v;
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
