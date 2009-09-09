/*global parser, document, Interval, matrix, vector, Worker, expression, */
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
		};

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
            //terminateWorkers();
            context.restore();
            context.clearRect(0, 0, size.width, size.height);
		},
		plot: function (eq, options) {
			var polar = options.range !== undefined,
            
                range = {
					horizontal: {
						from: options.horizontal && options.horizontal.from || 0,
						to: options.horizontal && options.horizontal.to || size.width
					},
					vertical: {
						from: (options.range ? options.horizontal && options.horizontal.from : options.vertical && options.vertical.from) || 0,
						to: (options.range ? options.horizontal && options.horizontal.to : options.vertical && options.vertical.to) || size.height
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
                
                horizontal = range.horizontal,
                
                vertical = options.range ? options.range : range.vertical,

				// Calculate the size of one pixel
				p = vector.subtract(matrix.vectorMultiply(m, [1, 1, 1]), matrix.vectorMultiply(m, [0, 0, 1])),
                
                hk = (horizontal.from + horizontal.to) / 2,
				vk = (vertical.from + vertical.to) / 2,
                
                workers = [],

				plotPoints = function (event) {
                    var i = 0, len = event.data.length, d;
                    for (; i < len; i += 1) {
                        d = event.data[i];	

                        if (polar) {
                            context.fillRect(d[0] * Math.cos(d[2]), d[0] * Math.sin(d[2]), d[1] - d[0], d[3] - d[2]);
                        } else {
                            context.fillRect(d[0], d[2], d[1] - d[0], d[3] - d[2]);
                        }
                    }
                },              

                initWorkers = function () {
                    var i = 0;
                    for (; i < 4; i += 1) {
                        workers[i] = new Worker('worker.js');
                        workers[i].onmessage = plotPoints;
                    }
                },
                terminateWorkers = function () {
                    workers.forEach(function (w) {
                        w.terminate();
                    });
                };
    
  
			// And store it
			pixel.horizontal = p[0];
			pixel.vertical = p[1];

            initWorkers();

            // Parse the equation into an RPN array
            eq = expression.parse(eq);

			// Set up the actual viewport.
			context.save();
			context.translate(-range.horizontal.from * scale.horizontal, -range.vertical.from * scale.vertical);
			context.scale(scale.horizontal, scale.vertical);

            workers[0].postMessage({
                eq: eq,
				range: {
					horizontal: {from: horizontal.from, to: hk},
					vertical: {from: vertical.from, to: vk}
				},
				pixel: pixel
			});

			workers[1].postMessage({
                eq: eq,
				range: {
					horizontal: {from: horizontal.from, to: hk},
					vertical: {from: vk, to: vertical.to}
				},
				pixel: pixel
			});

			workers[2].postMessage({
                eq: eq,
				range: {
					horizontal: {from: hk, to: horizontal.to},
					vertical: {from: vk, to: vertical.to}
				},
				pixel: pixel
			});

			workers[3].postMessage({
                eq: eq,
				range: {
					horizontal: {from: hk, to: horizontal.to},
					vertical: {from: vertical.from, to: vk}
				},
				pixel: pixel
			});
		}
	};
};
