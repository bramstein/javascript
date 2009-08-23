	
var game = (function () {
	var context = null,
		width = 320, height = 200, 
		scale = {
			horizontal: 1,
			vertical: 1
		},
		time = {
			current: new Date().getTime(),
			previous: 0,
			delta: 0
		},
		that = {
			objects: []
		},
		gameObject = {
			bbox: Object.clone(geometry.rectangle),
			scale: scale,
			draw: function (graphics) {
			},
			update: function (delta) {
			},
			clip: function (viewport) {
			}
		};

	var update = function () {
		time.previous = time.current;
		time.current = new Date().getTime();
		time.delta = (time.current - time.previous) / 1000;

		context.clearRect(0, 0, width, height);
		context.fillText((1 / time.delta).toFixed(2).toString(), 10, 10);
		
		that.objects.forEach(function (o) {
			o.draw(context);
			o.update(time.delta);
		});
		window.setTimeout(update, 10);
	};

	return Object.extend(that, {
		object: gameObject,
		start: function (e) {
			var canvas = document.getElementById(e);

			if (canvas.getContext && canvas.getContext('2d')) {
				context = canvas.getContext('2d');

				width = canvas.width;
				height = canvas.height;

				scale.horizontal = width / 320;
				scale.vertical = height / 200;

				context.fillStyle = 'white';

				update();
			} else {
				throw 'Sopwith needs support for the HTML5 Canvas API';
			}
		}
	});
}());
