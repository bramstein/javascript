var vector = (function () {
	/**
     * Subtract two 3d dimensional vectors
	 */
	function vsub(a, b) {
		return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
	}

	function toCartesian(v) {
		return [v[0] * Math.cos(v[1]), v[0] * Math.sin(v[1]), 1];
	}

	return {
		subtract: vsub,
		polarToCartesian: toCartesian
	};
}());
