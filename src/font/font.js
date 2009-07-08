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

var font = function (properties) {
    var f = {
            family: 'sans-serif',
            size: 11,
            lineHeight: 1.2,
            toString: function () {
                return this.style + " " + this.variant + " " + this.weight + " " + this.size + "px " + this.family;
            }
        },
        horizontal = ['left', 'right', 'center'],
        vertical = ['top', 'bottom', 'middle'],
        alignmentOptions = [].append(horizontal, ['start', 'end']);

    properties = properties || {};

    if (properties.lineHeight) {
        f.lineHeight = (properties.lineHeight && typeof properties.lineHeight === 'number' && !isNaN(properties.lineHeight) && properties.lineHeight) || f.lineHeight;
    }
        
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
  
    return {
        bbox: function (context, str, options) {
            var previousFont,
                result = {
                    width: 0,
                    height: 0
                };
        
            if (str !== undefined && context) {
                previousFont = context.font;
                
                context.font = f.toString();
                
                str.split('\n').forEach(function (line) {
                    result.width = Math.max(context.measureText(line).width, result.width);
                    result.height += f.size * f.lineHeight;
                });

                context.font = previousFont;
            }
            return result;        
        },
        fill: function (context, str, x, y, options) {
            var margin = {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
                anchor = {
                    horizontal: 'left',
                    vertical: 'top'
                },
                align = 'left',
                size = this.bbox(context, str, options),
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
            
           // align = 'left';
          //  anchor.horizontal = 'right';
          //  anchor.vertical = 'bottom';
            
            if (anchor.horizontal === 'center') {
                bboxOffset.horizontal = -size.width / 2;
                textOffset.horizontal = -size.width / 2;
            } else if (anchor.horizontal === 'right') {
                bboxOffset.horizontal = -size.width;
                textOffset.horizontal = -size.width;
            }
            
            if (anchor.vertical === 'middle') {
                bboxOffset.vertical = size.height / 2;
                textOffset.vertical = size.height / 2;
            } else if (anchor.vertical === 'bottom') {
                bboxOffset.vertical = size.height;
                textOffset.vertical = size.height;
            }
            
            if (align === 'center') {
                textOffset.horizontal += size.width / 2;
            } else if (align === 'right' || align === 'end') {
                textOffset.horizontal += size.width;
            }
            
            context.save();
            context.scale(1, -1);
            context.font = f.toString();
            context.textBaseline = 'top';
            context.textAlign = align;
            str.split('\n').forEach(function (line, i, a) {
                context.fillText(line, x + textOffset.horizontal, -y + (i * f.size * f.lineHeight) - textOffset.vertical);
            });
            context.restore();
            
            // this draws the bounding box
            context.save();
            context.strokeStyle = 'orange';
            context.translate(x + bboxOffset.horizontal, y + bboxOffset.vertical);
            context.strokeRect(0, 0, size.width, -size.height);
            context.restore();
            
            // this draws the anchor point
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(x, y, 1, 0, Math.PI * 2, false);
            context.fill();
        },
        stroke: function (context, str, x, y, options) {
        },
        toString: toString
    };
};