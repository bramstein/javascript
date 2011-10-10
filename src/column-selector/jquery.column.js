/**
 * @preserve jQuery Column cell selector v0.15
 *
 * Licensed under the new BSD License.
 * Copyright 2009-2010, Bram Stein
 * All rights reserved.
 */
/*global jQuery*/
(function ($) {
	var equationRegExp = /([\+\-]?\d*)[nN]([\+\-]?\d*)/,
		cache, equation,
		pseudoSelector = jQuery.expr.filter.PSEUDO,
		override = jQuery.fn.jquery.indexOf('1.4') !== -1 || jQuery.fn.jquery.indexOf('1.5') !== -1 || jQuery.fn.jquery.indexOf('1.6') !== -1;

	function parseEquation(str) {
		var tmp = [],
			result = {
				multiplier: 0,
				offset: 0
			};

		if (str === 'even') {
			str = '2n';
		} else if (str === 'odd') {
			str = '2n+1';
		} else if (/^\d*$/.test(str)) {
			str = '0n+' + str;
		}
		
		tmp = equationRegExp.exec(str);

		if (tmp !== null) {
			result.multiplier = tmp[1] - 0;
			result.offset = tmp[2] - 0;
		}
		return result;
	}

	function generateCache(cells, equation) {
		var currentRow, currentSection, matrix = [], first = 0, lookup = [];

		$.each(cells, function (k, cell) {
			var i = 0, j = 0, 
				rowSpan = cell.rowSpan || 1,
				colSpan = cell.colSpan || 1;

			if (cell.parentNode !== currentRow) {
				currentRow = cell.parentNode;

				if (currentRow.parentNode !== currentSection) {
					currentSection = currentRow.parentNode;
					matrix = [];
				}

				first = 0;

				if (matrix[currentRow.rowIndex] === undefined) {
					matrix[currentRow.rowIndex] = [];
				}
				
			}

			for (i = 0; i < matrix[currentRow.rowIndex].length + 1; i += 1) {
				if (matrix[currentRow.rowIndex][i] === undefined) {
					first = i;
					break;
				}
			}

			lookup[k] = first;

			for (i = currentRow.rowIndex; i < currentRow.rowIndex + rowSpan; i += 1) {
				if (matrix[i] === undefined) {
					matrix[i] = [];
				}

				for (j = first; j < first + colSpan; j += 1) {
					matrix[i][j] = true;
				}
			}
		});
		return lookup;
	}

	function nthCol(element, match, index) {
		var difference = cache[index] - (equation.offset - 1);
		if (equation.multiplier === 0) {
			return difference === 0;
		} else {
			return (difference % equation.multiplier === 0 && difference / equation.multiplier >= 0);
		}
	}

	$.extend(jQuery.fn, {
		nthCol: function (e) {
			equation = parseEquation(e);
			cache = generateCache(this);
			return $(this).filter(function (i) {
				return nthCol(this, undefined, i);
			});
		}
	});	

	$.extend(jQuery.expr.match, {
		COLUMN: new RegExp(":nth-col\\((even|odd|[\\dnN\\+\\-]*)\\)(?![\\^\\[]*\\])(?![\\^\\(]*\\))")
	});

	$.extend(jQuery.expr.leftMatch, {
		COLUMN: new RegExp("(^(?:.|\\r|\\n)*?):nth-col\\((even|odd|[\\dnN\\+\\-]*)\\)(?![\\^\\[]*\\])(?![\\^\\(]*\\))")
	});

	$.extend(jQuery.expr.preFilter, {
		COLUMN: function (match, items) {
			equation = parseEquation(match[1]);
			cache = generateCache(items);
			return match;
		}
	});

	if (override) {
		$.extend(jQuery.expr.filter, {
			// Override the pseudo selector and go past the "unrecognized
			// expression" error message if nth-col is part of the 
			// expression. This is only necessary on jQuery >= 1.4.x.
			PSEUDO: function (elem, match, i, array) {
				var name = match[1];
				if (name !== 'nth-col') {
					return pseudoSelector(elem, match, i, array);
				}
			}
		});
	}

	$.extend(jQuery.expr.filter, {
		COLUMN: nthCol
	});
}(jQuery));
