
/*global bounds, insets, container*/
var compositeChart = function () {

	return function (layout) {
		var that = {};

		that = bounds(that);
		that = insets(that);
		that = container(that, layout);
			
		Object.extend(that, {
			draw: function (g) {
				layout.items().forEach(function (item) {
					// set the local coordinate system
					item.draw(g);
				});
				return that;
			}
		});
		return that;
	};
}();
