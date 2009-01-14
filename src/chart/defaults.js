
var defaults = {
	text: {
		fill: function (context, x, y, str, options) {
		},
		stroke: function (context, x, y, str, options) {
		},
		size: function (context, str, options) {
			return {
				width: 0,
				height: 0
			};
		}
	},
	color: {
		background: 'rgb(255, 255, 255)',
		grid: 'rgb(220, 220, 220)',
		axes: 'rgb(160, 160, 160)',
		text: 'rgb(30, 30, 30)',
		title: 'rgb(0, 0, 0)',
		subtitle: 'rgb(50, 50, 50)',
	}
};
