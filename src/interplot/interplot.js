/*global parser, document*/
var interplot = function (c) {
	var canvas = document.getElementById(c),
		context = null,
		size = {
			width: 500,
			height: 500
		},
		pixel = {
			horizontal: 1,
			vertical: 1
		},
		worker = new Worker('worker.js'),
		polar = true;

	if (!canvas.getContext || !canvas.getContext('2d')) {
		throw 'InterPlot requires a browser with HTML5 Canvas support';
	}

	context = canvas.getContext('2d');

	size.width = canvas.width;
	size.height = canvas.height;

	context.fillStyle = 'red';
	context.strokeStyle = 'red';
	context.lineWidth = 1;

	return {
		clear: function () {
		},
		plot: function (eq, horizontal, vertical) {
			var range = {
					horizontal: {
						from: horizontal && horizontal.from || 0,
						to: horizontal && horizontal.to || size.width
					},
					vertical: {
						from: (polar ? horizontal && horizontal.from : vertical && vertical.from) || 0,
						to: (polar ? horizontal && horizontal.to : vertical && vertical.to) || size.height
					}
				},

				// Calculate the scale we're drawing at
				scale = {
					horizontal: size.width / Interval.width(range.horizontal),
					vertical: size.height / Interval.width(range.vertical)
				},

				// Calculate the inverse matrix of our viewport so we can calculate the pixel size
				m = matrix.invert([
					[scale.horizontal, 0,              -range.horizontal.from * scale.horizontal],
					[0,                scale.vertical, -range.vertical.from * scale.vertical],
					[0,                0,              1]
				]),

				// Calculate the size of one pixel
				p = vector.subtract(matrix.vectorMultiply(m, [1, 1, 1]), matrix.vectorMultiply(m, [0, 0, 1]));

			// And store it
			pixel.horizontal = p[0];
			pixel.vertical = p[1];

			// Set up the actual viewport.
			context.save();
			context.translate(-range.horizontal.from * scale.horizontal, -range.vertical.from * scale.vertical);
			context.scale(scale.horizontal, scale.vertical);
			
			worker.onmessage = function (event) {
				event.data.forEach(function (d) {
					var h = d[0],
						v = d[1],
						p;
	
					if (polar) {
						p = vector.polarToCartesian([h.from, v.from, 1]);
						context.fillRect(p[0], p[1], Interval.width(h), Interval.width(v));
					} else {
						context.fillRect(h.from, v.from, Interval.width(h), Interval.width(v));
					}
				});
			};

			worker.postMessage({range: {
						horizontal: range.horizontal,
						vertical: vertical
				},
				pixel: pixel,
				depth: 0
			});
		}
	};
};
