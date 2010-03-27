/**
 * @preserve jQuery Text Alignment v0.02
 *
 * Licensed under the new BSD License.
 * Copyright 2009, Bram Stein
 * All rights reserved.
 */
/*global jQuery*/
(function ($) {
	$.extend($.fn, {
		textAlign: function (string) {
			var items = $(this),
				maxLeft = 0,
				maxRight = 0;

			if (string === 'start' || string === 'end' || string === 'left' || string === 'right' || string === 'justify' || string === 'center') {
				return items.css({textAlign: string});
			} else if (string.length === 1) {
				items.each(function () {
					var that = $(this),
						str = that.text(),
                        left, right;
                        
                    if (str.indexOf(string) !== -1) {    
						left = $('<span>' + str.slice(0, str.indexOf(string)) + '</span>');
						right = $('<span>' + str.slice(str.indexOf(string)) + '</span>');
                    } else {
                        left = $('<span>' + str + '</span>');
                        right = $('<span/>');
                    }

					left.css({display: 'inline-block', textAlign: 'right'});
					right.css({display: 'inline-block', textAlign: 'left'});

					$(this).empty().append(left).append(right);

					maxLeft = Math.max(maxLeft, left.width());
					maxRight = Math.max(maxRight, right.width());
				});

				items.each(function () {
					var children = $(this).children(),
						left = $(children[0]),
						right = $(children[1]);
				
					left.width(maxLeft);
					right.width(maxRight);
				});
			}
			return items;
		}
	});
}(jQuery));
