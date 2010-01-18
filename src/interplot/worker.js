/*global importScripts, postMessage, quadtree, expression, TInterval, onmessage*/
importScripts('../core/object.js', '../core/array.js', '../core/math.js', '../core/interval.js', '../parser/lexer.js', '../parser/parser.js', 'expression.js');

var buffer = [];

function store(e) {
	buffer.push(e);
}

function send(depth) {
	if (depth <= 5 && buffer.length !== 0) {
		postMessage(buffer);
		buffer = [];
	}
}

function subdivide(eq, horizontal, vertical, depth, pixel) {
	var hk = horizontal.middle(),
		vk = vertical.middle();

	depth += 1;

	quadtree(eq, new TInterval(horizontal.from, hk), new TInterval(vertical.from, vk), depth, pixel);
	send(depth);

	quadtree(eq, new TInterval(horizontal.from, hk), new TInterval(vk, vertical.to), depth, pixel);
	send(depth);

	quadtree(eq, new TInterval(hk, horizontal.to), new TInterval(vk, vertical.to), depth, pixel);
	send(depth);

	quadtree(eq, new TInterval(hk, horizontal.to), new TInterval(vertical.from, vk), depth, pixel);
	send(depth);
}

function quadtree(eq, horizontal, vertical, depth, pixel) {
	var F = expression.evaluate(eq, {x: horizontal, y: vertical});

	if (F.from <= 0 && 0 <= F.to) {
		if ((horizontal.width() <= pixel.horizontal && vertical.width() <= pixel.vertical) || depth > 19) {
			store([horizontal.from, horizontal.to, vertical.from, vertical.to]);
		}
		else {
			subdivide(eq, horizontal, vertical, depth, pixel);	
		}
	}
}

onmessage = function (event) {
	var range = event.data.range,
		pixel = event.data.pixel,
		depth = 1,
        eq = event.data.eq;

	quadtree(eq, new TInterval(range.horizontal.from, range.horizontal.to), new TInterval(range.vertical.from, range.vertical.to), depth, pixel);	
};
