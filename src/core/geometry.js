
var geometry = (function () {
	var position = {
			x: 0,
			y: 0
		},
		size = {
			width: 0,
			height: 0
		};

	return {
		rectangle: {	
			x: 0,
			y: 0,
			width: 0,
			height: 0
		},
		point: Object.clone(position),
		dimension: Object.clone(size)
	};
}());
