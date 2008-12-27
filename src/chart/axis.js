
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

	return function (options) {
		var minorTicks = [],
			majorTicks = [],
			from, to, tmp = [];

		if (options.from === undefined || options.to === undefined || Interval.empty(options)) {
			throw new TypeError("An axis should a valid, non-empty interval.");
		}

		if (options.numMajorTicks !== undefined) {
			majorTicks = calculateTicks(options, options.numMajorTicks);
		}
		else  if (options.majorTicks !== undefined && Object.isArray(options.majorTicks)) {
			majorTicks = options.majorTicks;
		}

		if (options.numMinorTicks !== undefined) {
			// TODO: I'm not sure if the assumption that minor ticks also have to be "nice" 
			// numbers is correct. Assuming the major ticks are "nice" we can easily
			// calculate the minor ticks. The calculate ticks function might be holding
			// us back here.
			majorTicks.forEach(function (v, i) {
				minorTicks.append(calculateTicks({
					from: v,
					to: (i !== (majorTicks.length - 1) ? majorTicks[i + 1] : v)
				}, options.numMinorTicks));
			});
		}
		else if (options.minorTicks !== undefined && Object.isArray(options.minorTicks)) {
			minorTicks = options.minorTicks;
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
		
		return {
			minorTicks: minorTicks,
			majorTicks: majorTicks,
			from: from,
			to: to
		};
	}.defaults({});
}();

var category = function () {
	return function (options) {
		if (options.categories !== undefined) {
			return {
				majorTicks: options.categories,
				minorTicks: [],
				from: 1,
				to: 0
			};
		}		
		throw new TypeError('A category axis must at least contain one category');
	}.defaults({});
}();
