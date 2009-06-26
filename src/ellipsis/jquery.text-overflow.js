/*!
 * jQuery Text Overflow v0.02
 *
 * Licensed under the new BSD License.
 * Copyright 2009, Bram Stein
 * All rights reserved.
 */
/*global jQuery, document*/
(function ($) {
	$.extend($.fn, {
        textOverflow: function (str, autoUpdate) {
            var more = str || '…',
                style = document.documentElement.style,
                textOverflow = style.hasOwnProperty('textOverflow') || style.hasOwnProperty('OTextOverflow');
            
            if (!textOverflow) {
                return this.each(function () {
                    var element = $(this),
                        clone = element.clone(),
                        originalText = element.text(),
                        originalWidth = element.width(),
                        low = 0, mid = 0,
                        high = originalText.length,
                        reflow = function () {
                            if (originalWidth !== element.width()) {
                                element.text(originalText);
                                element.textOverflow(str, false);
                            }
                        };

                    if (element.css('overflow') !== 'visible') {
                        element.after(clone.hide());
                    
                        if (clone.width() > originalWidth) {
                            while (low < high) {
                                mid = Math.floor(low + ((high - low) / 2));
                                clone.html(originalText.substr(0, mid) + more);
                                
                                if (clone.width() < originalWidth) {
                                    low = mid + 1;
                                } else {
                                    high = mid;
                                }
                            }
      
                            if (low < originalText.length) {
                                element.html(originalText.substr(0, low - 1) + more);
                            }
                        }
                       
                        clone.remove();
                        
                        if (autoUpdate) {    
                            setInterval(reflow, 200);
                        }
                    }
                });
            } else {
                return this;
            }
        }
	});
})(jQuery);