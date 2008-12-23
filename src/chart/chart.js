
/*global bounds, insets, graphics*/
var chart = function () {
	return function (elementIdentifier, axes, ratio, width, height) {
		var g = graphics(elementIdentifier),
			layout = jLayout.border({
				vgap: 5,
				hgap: 5
			});

		var that = {
			draw: function () {
			}
		};

		that = bounds(that);
		that = insets(that);
		that = container(that, layout);

		that.bounds({'width': width, 'height': height});
		return that;
	};
}();
