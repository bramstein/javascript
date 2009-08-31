/*global geometry, document, setInterval*/	
var game = (function () {
	var context = null,
		width = 320, height = 200, 
		scale = {
			horizontal: 1,
			vertical: 1
		},
		time = {
			current: new Date().getTime(),
			step: 0.01,
			accumulator: 0,
			t: 0
		},
		lastError = 0,
		that = {
			objects: []
		},
		/**
		 * State contains:
		 * - position of player plane
		 * - velocity of player plane
		 * - amount of fuel
		 * - amount of bombs
		 * - amount of bullets
		 * - status of enemies and static objects
		 *
		 * Each game object inherits some default properties:
		 * - an (empty) bounding box
		 * - a reference to the current scale
		 * - init, update, draw and clip methods to be overridden on demand
		 */
		currentState = {
			player: {
				x: 0,
				y: 0,
				rotation: 0,
				velocity: 0.05,
				fuel: 30,
				bombs: 6,
				bullets: 50
			},
			x: 0,
			v: 0.05
		},
		previousState = Object.clone(currentState),
		gameObject = {
			bbox: Object.clone(geometry.rectangle),
			scale: scale,
			draw: function (graphics, state) {
			},
			update: function (delta) {
			},
			clip: function (viewport) {
			}
		};

	var update = function () {
		var newTime = new Date().getTime(),
			delta = newTime - time.current;

		if (delta > 100) {
			lastError = delta;
		}

		time.current = newTime;	
		time.accumulator += delta;

		while (time.accumulator >= time.step) {
			previousState.x = currentState.x;
			previousState.v = currentState.v;

			currentState.x = currentState.x + currentState.v * time.step;

			time.t += time.step;
			time.accumulator -= time.step;
		}
		context.clearRect(0, 0, width, height);
		context.fillText(delta.toFixed(2).toString(), 10, 10);
		context.fillText(time.t.toFixed(2).toString(), 10, 20);
		context.fillText(lastError.toFixed(2).toString(), 10, 30);	

		var alpha = time.accumulator / time.step,
			s = {
				x: currentState.x * alpha + previousState.x * (1.0 - alpha),
				v: currentState.v * alpha + previousState.v * (1.0 - alpha)
			};

		that.objects.forEach(function (o) {
			o.draw(context, currentState);
		});
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

				setInterval(update, 10);
			} else {
				throw 'Sopwith needs support for the HTML5 Canvas API';
			}
		}
	});
}());
