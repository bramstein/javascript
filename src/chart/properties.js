/*global property*/
var bounds = property('bounds', {
	width: 0,
	height: 0,
	x: 0,
	y: 0
});

var insets = property('insets', {
	top: 0,
	bottom: 0,
	right: 0,
	left: 0
});

var maximum = property('maximumSize', {
	width: Infinity,
	height: Infinity,
	x: 0,
	y: 0
});

var preferred = property('preferredSize', {
	width: 0,
	height: 0,
	x: 0,
	y: 0
});

var container = function (that, layout) {
	['minimum', 'maximum', 'preferred'].forEach(function (n) {
		that[n + 'Size'] = function () {
			return layout[n](that);
		};
	});

	Object.extend(that, {
		isVisible: function () {
			return layout.items().every(function (item) {
				return item.isVisible();
			});
		},
		doLayout: function () {
			layout.layout(that);
			return that;
		}
	});
	return that;
};
