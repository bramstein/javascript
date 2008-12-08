
var tickmarks = function () {
	function nicenum(x, round) {
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

	function loose(interval, n) {
		var range = nicenum(interval.width(), false),
			d = nicenum(range / (n - 1), true),
			rangeMin = Math.floor(interval.from  / d) * d,
			rangeMax = Math.ceil(interval.to / d) * d,
			nfrac = Math.max(-Math.floor(Math.log10(d)), 0),
			result = [],
			x = rangeMin;

		for (; x < rangeMax + 0.5 * d; x += d) {
			result.push(x);
		}
		return result;				
	}

	function tight(interval, n) {
		var result = loose(interval, n);
		result[0] = interval.from;
		result[result.length - 1] = interval.to;
		return result;	
	}

	return {
		nicenum: nicenum,
		loose: loose,
		tight: tight
	};
}();
