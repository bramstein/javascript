
/**
 * Numerical Axis.
 */
/*global Interval*/
var axis = function () {
	function niceNumber(x, round) {
		var exp = Math.floor(Math.log10(x)),
			f = x / Math.pow(10, exp),
			nf = 0;

		if (round) {
			if (f < 1.5) {
				nf = 1;
			}
			else if (f < 3) {
				nf = 2;
			}
			else {
				nf = 10;
			}
		}
		else {
			if (f <= 1) {
				nf = 1;
			}
			else if (f <= 2) {
				nf = 2;
			}
			else if (f <= 5) {
				nf = 5;
			}
			else {
				nf = 10;
			}
		}
		return nf * Math.pow(10, exp);
	}

	function tickStep(interval, n) {
		var range = niceNumber(Interval.width(interval), false);
		return niceNumber(range / (n - 1), true);
	}

	function calculateTicks(interval, n) {
		var step = tickStep(interval, n),
			minRange = Math.floor(interval.from / step) * step,
			maxRange = Math.ceil(interval.to / step) * step,
			nfrac = Math.max(-Math.floor(Math.log10(step)), 0),
			result = [],
			x = minRange;

		for (; x < maxRange + 0.5 * step; x += step) {
			result.push(Number(x.toFixed(nfrac)));
		}
		return result;				
	}

	function isNumeric(a) {
		return a.every(function (i) {
			return typeof i === 'number' && !isNaN(i);
		});
	}

	return function (options) {
		var minorTicks = [],
			majorTicks = [],
			label = undefined,
			ticks = {
				major: [],
				minor: [],
				labels: []
			},
			from, to, start, end, tmp = [];

		if (options.from === undefined || options.to === undefined || Interval.empty(options)) {
			from = start = 1;
			to = end = 0;
			if (options.categories !== undefined && Object.isArray(options.categories) && options.categories.length > 0) {
				ticks.major = options.categories.map(function (v) {
					return v.toString();
				});
			}
			else {
				throw new TypeError('A category axis must at least contain one category.');
			}
		}
		else if (options.from !== undefined && options.to !== undefined) {
			if (options.ticks !== undefined && options.ticks.major !== undefined && typeof options.ticks.major === 'number' && options.from !== undefined && options.to !== undefined) {
				ticks.major = calculateTicks(options, options.ticks.major);
			}
			else  if (options.ticks !== undefined && options.ticks.major !== undefined && Object.isArray(options.ticks.major) && isNumeric(options.ticks.major)) {
				ticks.major = options.ticks.major;
			}
			else {
				throw new TypeError('A numeric axis must contain a range or major ticks.');
			}

			if (options.ticks !== undefined && options.ticks.minor !== undefined && typeof options.ticks.minor === 'number') {
				ticks.major.forEach(function (v, i) {
					var interval = {
							from: v,
							to: (i !== (ticks.major.length - 1) ? ticks.major[i + 1] : v)
						},
						step = Interval.width(interval) / (options.ticks.minor + 1),
						j = interval.from;

					for (; j < interval.to; j += step) {
						ticks.minor.push(j);
					}
				});
			}
			else if (options.ticks !== undefined && options.ticks.minor !== undefined && Object.isArray(options.ticks.minor) && isNumeric(options.ticks.minor)) {
				ticks.minor = options.ticks.minor;
			}
			else {
				// minor ticks are optional, so we don't throw an error.
			}

			start = options.from;
			end = options.to;

			if (ticks.major.isEmpty()) {
				if (ticks.minor.isEmpty()) {
					// unspecified, so we assume the number of ticks is set to 10
					tmp = calculateTicks(options, 10);
					from = tmp[0];
					to = tmp.peek();
				}
				else {
					from = ticks.minor[0];
					to = ticks.minor.peek();
				}
			}
			else {
				from = ticks.major[0];
				to = ticks.major.peek();
			}

			if (options.ticks && options.ticks.labels !== undefined && Object.isArray(options.ticks.labels)) {
				ticks.labels = options.ticks.labels.map(function (s) {
					if (s !== undefined && s !== null) {
						return s.toString();
					}
					return undefined;
				});
			}
		}
		else {
			throw new TypeError('A numeric axes should contain a from and to property.');
		}

		if (options.label !== undefined) {
			label = options.label.toString();
		}

		// filter out the minor ticks that are also major ticks as
		// there is no point in drawing them.
		if (!ticks.minor.isEmpty() && !ticks.major.isEmpty()) {
			ticks.minor = ticks.minor.filter(function (i) {
				return !ticks.major.contains(i);
			});
		}

		return {
			ticks: ticks,
			label: label,
			from: from,
			to: to,
			start: start,
			end: end
		};
	}.defaults({});
}();
