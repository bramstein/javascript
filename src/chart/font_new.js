/*
var f = font({
    family: 'Times',
    size: 12,
    lineHeight: 1.2,
    margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    style: 'normal' | 'italic' | 'oblique',
    variant: 'normal' | 'small-caps',
    weight: 'normal' | 'bold' | 'bolder' | 'lighter',
    align: 'left' | 'right' | 'center' | | 'start' | 'end',
        anchor: {
        horizontal: 'left' | 'right' | 'center',
        vertical: 'top' | 'middle' | 'bottom'
    }
});
// return bounding box of the supplied string
f.bbox(context, str);

// draw the string at x, y filled
f.fill(context, str, x, y);

// draw the string at x, y stroked
f.stroke(context, str, x, y);

*/

var ffont = function (properties) {
    var f = {
            family: 'sans-serif',
            size: 11,
            lineHeight: 11,
            toString: function () {
                return this.style + " " + this.variant + " " + this.weight + " " + this.size + "px " + this.family;
            }
        },
        horizontal = ['left', 'right', 'center'],
        vertical = ['top', 'bottom', 'middle'],
        alignmentOptions = [].append(horizontal, ['start', 'end']),
        leading,
		colour;

    properties = properties || {};
        
    Object.forEach({ 
        style: ['normal', 'italic', 'oblique'],
        variant: ['normal', 'small-caps'],
        weight: ['normal', 'bold', 'bolder', 'lighter']
    }, function (n, k) {
        f[k] = n.contains(properties[k]) && properties[k] || n[0];
    });    
    
    if (properties.size) {
        f.size = (properties.size && typeof properties.size === 'number' && !isNaN(properties.size) && properties.size) || f.size;
    }
  
    if (properties.family) {
        f.family = properties.family; 
    }
    
    if (properties.lineHeight) {
        f.lineHeight = (properties.lineHeight && typeof properties.lineHeight === 'number' && !isNaN(properties.lineHeight) && properties.lineHeight) || f.lineHeight;
        f.lineHeight *= f.size;
    }

	colour = properties.colour || 'black';

    leading = f.lineHeight - f.size;
  
    return {
        bbox: function (context, str, options) {
            var previousFont,
                result = {
                    width: 0,
                    height: 0
                },
                anchor = {
                    horizontal: 'left',
                    vertical: 'top'
                };

            if (str !== undefined && context) {
                previousFont = context.font;
                
                context.font = f.toString();
                
                str.split('\n').forEach(function (line) {
                    result.width = Math.max(context.measureText(line).width, result.width);
                    result.height += f.lineHeight;
                });

                context.font = previousFont;
            }
            return result;        
        },
        draw: function (context, str, x, y, options) {
            var margin = {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
                anchor = {
                    horizontal: 'left',
                    vertical: 'bottom'
                },
                align = 'left',
                size = this.bbox(context, str.toLocaleString(), options),
                outerSize = {
                    width: 0,
                    height: 0
                },
                textOffset = {
                    horizontal: 0,
                    vertical: 0
                },
                bboxOffset = {
                    horizontal: 0,
                    vertical: 0
                };
                
            if (options) {
                Object.forEach(margin, function (v, k) {
                    margin[k] = options.margin && options.margin[k] || v;
                });
                
                if (options.anchor) {
                    anchor.horizontal = options.anchor.horizontal && horizontal.contains(options.anchor.horizontal) && options.anchor.horizontal || anchor.horizontal;
                    anchor.vertical = options.anchor.vertical && vertical.contains(options.anchor.vertical) && options.anchor.vertical || anchor.vertical;
                }
                
                if (options.align) {
                    align = alignmentOptions.contains(options.align) && options.align || align;
                }
            }
            
            outerSize.width = size.width + margin.left + margin.right;
            outerSize.height = size.height + margin.top + margin.bottom;
            
          //  align = 'center';
          //  anchor.horizontal = 'left';
          //  anchor.vertical = 'top';
            
            if (anchor.horizontal === 'center') {
                bboxOffset.horizontal = -outerSize.width / 2;
                textOffset.horizontal = -outerSize.width / 2;
            } else if (anchor.horizontal === 'right') {
                bboxOffset.horizontal = -outerSize.width;
                textOffset.horizontal = -outerSize.width;
            }
            
            if (anchor.vertical === 'middle') {
                bboxOffset.vertical = outerSize.height / 2;
                textOffset.vertical = outerSize.height / 2;
            } else if (anchor.vertical === 'bottom') {
                bboxOffset.vertical = outerSize.height;
                textOffset.vertical = outerSize.height;
            }
            
            if (align === 'center') {
                textOffset.horizontal += size.width / 2;
            } else if (align === 'right' || align === 'end') {
                textOffset.horizontal += size.width;
            }
            
            context.save();
            context.scale(1, -1);
            context.font = f.toString();
            context.textBaseline = 'alphabetic';
            context.textAlign = align;

			//console.log("----" + str);

			if (str) {
			context.fillStyle = colour;
            str.toLocaleString().split('\n').forEach(function (line, i, a) {
                context.fillText(line, x + textOffset.horizontal + margin.left, (-y + i * f.lineHeight + f.lineHeight - leading / 2) - textOffset.vertical + margin.top);
            });
			}
            context.restore();
            
/*
            // this draws the inner bounding box
            context.save();
            context.strokeStyle = 'orange';
            context.translate(x + bboxOffset.horizontal + margin.left, y + bboxOffset.vertical - margin.top);
            context.strokeRect(0, 0, size.width, -size.height);
            context.restore();
            
            // this draws the outer bounding box
            context.save();
            context.strokeStyle = 'blue';
            context.strokeRect(x + bboxOffset.horizontal, y + bboxOffset.vertical, outerSize.width, -outerSize.height);
            context.restore();
            
            // this draws the anchor point
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(x, y, 1, 0, Math.PI * 2, false);
            context.fill();
*/
        },
        toString: toString
    };
};
