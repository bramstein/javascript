
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
			from, to, tmp = [];

		if ((options.from === undefined || options.to === undefined || Interval.empty(options)) && options.majorTicks === undefined && options.numMajorTicks === undefined) {
			from = 1;
			to = 0;
			if (options.categories !== undefined && Object.isArray(options.categories) && options.categories.length > 0) {
				majorTicks = options.categories.map(function (v) {
					return v.toString();
				});
			}
			else {
				throw new TypeError('A category axis must at least contain one category.');
			}
		}
		else {
			if (options.numMajorTicks !== undefined && options.from !== undefined && options.to !== undefined) {
				majorTicks = calculateTicks(options, options.numMajorTicks);
			}
			else  if (options.majorTicks !== undefined && Object.isArray(options.majorTicks) && isNumeric(options.majorTicks)) {
				majorTicks = options.majorTicks;
			}
			else {
				throw new TypeError('A numeric axis should be specified by either numMajorTicks, or a numeric majorTicks array.');
			}

			if (options.numMinorTicks !== undefined) {
				// I'm not sure if the assumption that minor ticks also have to be "nice" 
				// numbers is correct. Assuming the major ticks are "nice" we can easily
				// calculate the minor ticks.
				/*
				majorTicks.forEach(function (v, i) {
					minorTicks.append(calculateTicks({
						from: v,
						to: (i !== (majorTicks.length - 1) ? majorTicks[i + 1] : v)
					}, options.numMinorTicks));
				});
				*/
				majorTicks.forEach(function (v, i) {
					var interval = {
							from: v,
							to: (i !== (majorTicks.length - 1) ? majorTicks[i + 1] : v)
						},
						step = Interval.width(interval) / (options.numMinorTicks + 1),
						j = interval.from;

					for (; j < interval.to; j += step) {
						minorTicks.push(j);
					}
				});
			}
			else if (options.minorTicks !== undefined && Object.isArray(options.minorTicks) && isNumeric(options.minorTicks)) {
				minorTicks = options.minorTicks;
			}
			else {
				// minor ticks are optional, so we don't throw an error.
			}

			if (majorTicks.isEmpty()) {
				if (minorTicks.isEmpty()) {
					// unspecified, so we assume the number of ticks is set to 10
					tmp = calculateTicks(options, 10);
					from = tmp[0];
					to = tmp[tmp.length - 1];
				}
				else {
					from = minorTicks[0];
					to = minorTicks[minorTicks.length - 1];
				}
			}
			else {
				from = majorTicks[0];
				to = majorTicks[majorTicks.length - 1];
			}
		}

		// filter out the minor ticks that are also major ticks as
		// there is no point in drawing them.
		if (!minorTicks.isEmpty() && !majorTicks.isEmpty()) {
			minorTicks = minorTicks.filter(function (i) {
				return !majorTicks.contains(i);
			});
		}

		return {
			minorTicks: minorTicks,
			majorTicks: majorTicks,
			from: from,
			to: to
		};
	}.defaults({});
}();
