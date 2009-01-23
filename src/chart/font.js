
/**
 * This is a bit of a compromise, none of the canvas
 * text APIs return valid font metrics, so we abuse
 * the browsers'. Also, font metrics should not be
 * a part of the Canvas API, there are many valid
 * cases for it being part of another API without
 * having a canvas element present. Hopefully this
 * mess can be replaced later with a proper API.
 */
var font = function () {
	var ruler = document.createElement('span'),
		text = document.createTextNode('');

	ruler.style.visibility = 'hidden';
	ruler.style.position = 'absolute';
	ruler.style.top = -8000;
	ruler.style.left = -8000;
	ruler.appendChild(text);
	document.body.appendChild(ruler);

	return {
		size: function (str, f) {
			var r = {
				width: 0,
				height: 0
			};

			if (f !== undefined) {
				f = font.parse(f);
				ruler.style.font = f.toString();
			}
			text.nodeValue = str.toLocaleString();

			r.width = ruler.scrollWidth;
			r.height = ruler.offsetHeight;

			text.nodeValue = '';
			ruler.style.font = 'inherit';
			return r;
		},
		parse: function (f) {
			var r = {
				size: 11,
				family: 'sans-serif',
				toString: function () {
					return this.style + " " + this.variant + " " + this.weight + " " + this.size + "px " + this.family;
				}
			};

			f = f || {};

			Object.forEach({ 
					style: ['normal', 'italic', 'oblique'],
					variant: ['normal', 'small-caps'],
					weight: ['normal', 'bold', 'bolder', 'lighter']
				}, function (n, k) {
					r[k] = n.contains(f[k]) && f[k] || n[0];
				});

			if (f.size) {
				r.size = (typeof f.size === 'number' && !isNaN(f.size) && f.size) || r.size;
			}

			if (f.family) {
				r.family = f.family || r.family;
			}
			return r;
		}
	};
};
