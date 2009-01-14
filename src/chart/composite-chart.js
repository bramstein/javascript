
/*global bounds, insets, container*/
var compositeChart = function () {

	return function (layout) {
		var that = {};

		that = bounds(that);
		that = insets(that);
		that = container(that, layout);
			
		Object.extend(that, {
			draw: function (g) {
				var b = that.bounds();
				g.beginViewport(b.x, b.y, b.width, b.height);
				layout.items().forEach(function (item) {
					item.draw(g);
				});
				g.closeViewport();
				return that;
			}
		});
		return that;
	};
}();
