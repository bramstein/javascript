
/*global fun*/
/*jslint nomen: false */
var chart = function () {
	var $ = fun.parameter;
	var _ = fun.wildcard;

	function Axis(options) {
		if (!(this instanceof Axis)) {
			return new Axis(options);
		}
		this.base = options.base || 0;
		this.color = options.color || 'rgb(200, 200, 200)';
		this.length = options.length || 100;
		this.orientation = options.orientation || 'horizontal';
	}

	function drawAxis(axis, context) {
		
		context.lineWidth = 1;
		context.strokeStyle = axis.color;
		context.beginPath();
		if (axis.orientation === 'horizontal') {
			context.moveTo(axis.base, context.canvas.height);
			context.lineTo(axis.length, context.canvas.height);
		}
		else {
			context.moveTo(0, context.canvas.height - axis.base);
			context.lineTo(0, context.canvas.height - axis.length);
		}
		context.closePath();
		context.stroke();
	}

	return {
		axis: Axis,
		draw: fun(
			[Axis, $, drawAxis]
		)
	};
}();
