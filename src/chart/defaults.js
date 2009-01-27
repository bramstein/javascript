
var defaults = {
	text: {
		fill: function (context, x, y, str, options) {
		},
		stroke: function (context, x, y, str, options) {
		}
	},
	font: {
		labels: {
			size: 11
		},
		title: {
			size: 11,
//			weight: 'bold'
		},
		subtitle: {
			size: 11,
			style: 'italic'
		}
	},
	color: {
		background: {
			chart: 'rgb(255, 255, 255)',
			data: 'rgb(255, 255, 255)'
		},
		grid: 'rgb(220, 220, 220)',
		axes: 'rgb(160, 160, 160)',
		text: 'rgb(30, 30, 30)',
		title: 'rgb(0, 0, 0)',
		subtitle: 'rgb(50, 50, 50)'
	}
};
