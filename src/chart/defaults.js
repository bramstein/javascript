
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
			weight: 'bold'
		},
		subtitle: {
			size: 11,
			style: 'italic'
		},
		inlineLabel: {
			size: 11
		}
	},
	point: [
		'circle',
		'cross',
		'triangle',
		'diamond',
		'square'
	],
	color: {
		background: {
			chart: 'rgb(255, 255, 255)',
			data: 'rgb(255, 255, 255)'
		},
		grid: 'rgb(220, 220, 220)',
		axes: 'rgb(160, 160, 160)',
		text: 'rgb(50, 50, 50)',
		title: 'rgb(0, 0, 0)',
		subtitle: 'rgb(50, 50, 50)',
		label: 'rgb(30, 30, 30)',
		data: {
			//standard: 'rgb(20, 20, 20)',
			standard: 'rgb(255, 0, 0)',
			qualitative: [
				'rgb(141, 199, 211)',
				'rgb(255, 179, 255)',
				'rgb(190, 218, 186)',
				'rgb(179, 105, 222)',
				'rgb(252, 229, 205)',
				'rgb(217, 217, 217)',
				'rgb(188, 189, 128)',
				'rgb(251, 114, 128)',
				'rgb(128, 211, 177)',
				'rgb(253, 98, 180)',
			],
			qualitative_highlight: [
				'rgb(27, 119, 158)',
				'rgb(217, 2, 95)',
				'rgb(117, 179, 112)',
				'rgb(231, 138, 41)',
				'rgb(102, 30, 166)',
				'rgb(230, 2, 171)',
				'rgb(166, 29, 118)',
				
				'rgb(228, 28, 26)',
				'rgb(55, 184, 126)',
				'rgb(77, 74, 175)',
				'rgb(152, 163, 78)',
				'rgb(255, 0, 127)',
				'rgb(255, 51, 255)',
				'rgb(166, 40, 86)',
				'rgb(247, 191, 129)'
			]
		}
	},
	type: {
	}
};
