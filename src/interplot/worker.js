importScripts('../core/object.js', '../core/array.js', '../core/math.js', '../core/interval.js');

var buffer = [];

function s(x, y) {
	return Interval.add(Interval.sin(x), y);
}

function rose(r, t) {
	return Interval.add(Interval.cos({from: t.from * 4, to: t.to * 4}), r);
}

function forward(e) {
	if (buffer.length < 50) {
		buffer.push(e.data);
	} else {
		buffer.push(e.data);
		postMessage(buffer);
		buffer = [];
	}
	//postMessage(e.data);
}

function subdivide(eq, horizontal, vertical, depth, pixel) {
	var hk = (horizontal.from + horizontal.to) / 2;
	var vk = (vertical.from + vertical.to) / 2;
	var w = [], i;

	depth += 1;

	if (depth === 1) {
		for (i = 0; i < 4; i += 1) {
			w[i] = new Worker('worker.js');
			w[i].onmessage = forward;
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
	} else {
		quadtree(eq, {from: horizontal.from, to: hk}, {from: vertical.from, to: vk}, depth, pixel);
		quadtree(eq, {from: horizontal.from, to: hk}, {from: vk, to: vertical.to}, depth, pixel);
		quadtree(eq, {from: hk, to: horizontal.to}, {from: vk, to: vertical.to}, depth, pixel);
		quadtree(eq, {from: hk, to: horizontal.to}, {from: vertical.from, to: vk}, depth, pixel);
	}
}

function quadtree(eq, horizontal, vertical, depth, pixel) {
	var F = rose(horizontal, vertical);

	if (F.from <= 0 && 0 <= F.to) {
		if ((Interval.width(horizontal) <= pixel.horizontal && Interval.width(vertical) <= pixel.vertical) || depth > 19) {
			postMessage([horizontal, vertical]);
		}
		else {
			subdivide(eq, horizontal, vertical, depth, pixel);	
		}
	}
}

onmessage = function (event) {
	var range = event.data.range,
		pixel = event.data.pixel,
		depth = event.data.depth;

	quadtree(null, range.horizontal, range.vertical, depth, pixel);	
};
