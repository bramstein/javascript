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
			
			var f = function (event) {
				var i = 0, len = event.data.length;
				for (; i < len; i += 1) {
					var d = event.data[i];	

					if (polar) {
						context.fillRect(d[0] * Math.cos(d[2]), d[0] * Math.sin(d[2]), d[1] - d[0], d[3] - d[2]);
					} else {
						context.fillRect(h.from, v.from, d[1] - d[0], d[3] - d[2]);
					}
				};
			};
			var hk = (range.horizontal.from + range.horizontal.to) / 2,
				vk = (vertical.from + vertical.to) / 2,
				w = [], i, depth = 0;

			for (i = 0; i < 4; i += 1) {
				w[i] = new Worker('worker.js');
				w[i].onmessage = f;
			}
			w[0].postMessage({
				range: {
					horizontal: {from: horizontal.from, to: hk},
					vertical: {from: vertical.from, to: vk}
				},
				pixel: pixel,
				'depth': depth
			});

			w[1].postMessage({
				range: {
					horizontal: {from: horizontal.from, to: hk},
					vertical: {from: vk, to: vertical.to}
				},
				pixel: pixel,
				'depth': depth
			});

			w[2].postMessage({
				range: {
					horizontal: {from: hk, to: horizontal.to},
					vertical: {from: vk, to: vertical.to}
				},
				pixel: pixel,
				'depth': depth
			});

			w[3].postMessage({
				range: {
					horizontal: {from: hk, to: horizontal.to},
					vertical: {from: vertical.from, to: vk}
				},
				pixel: pixel,
				'depth': depth
			});
		}
	};
};
