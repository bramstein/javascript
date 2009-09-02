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
	var hk = (horizontal.from + horizontal.to) / 2,
		vk = (vertical.from + vertical.to) / 2;

	depth += 1;

	quadtree(eq, {from: horizontal.from, to: hk}, {from: vertical.from, to: vk}, depth, pixel);
	send(depth);

	quadtree(eq, {from: horizontal.from, to: hk}, {from: vk, to: vertical.to}, depth, pixel);
	send(depth);

	quadtree(eq, {from: hk, to: horizontal.to}, {from: vk, to: vertical.to}, depth, pixel);
	send(depth);

	quadtree(eq, {from: hk, to: horizontal.to}, {from: vertical.from, to: vk}, depth, pixel);
	send(depth);
}

function quadtree(eq, horizontal, vertical, depth, pixel) {
	var F = expression.evaluate(eq, {x: horizontal, y: vertical});

	if (F.from <= 0 && 0 <= F.to) {
		if ((Interval.width(horizontal) <= pixel.horizontal && Interval.width(vertical) <= pixel.vertical) || depth > 19) {
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

	quadtree(eq, range.horizontal, range.vertical, depth, pixel);	
};
