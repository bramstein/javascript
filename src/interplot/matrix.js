var matrix = (function () {
	/**
     * Calculate the determinant of a 3x3 matrix
	 */
	function mdet(m) {
		return  m[0][0] * m[1][1] * m[2][2] + 
				m[0][1] * m[1][2] * m[2][0] + 
				m[0][2] * m[2][0] * m[2][1] - 
				m[0][0] * m[1][2] * m[2][1] - 
				m[0][1] * m[1][0] * m[2][2] - 
				m[0][2] * m[1][1] * m[2][0];
	}

	/**
     * Multiple a 3x3 matrix with a 3 dimensional vector
	 */
	function mvecmul(m, v) {
		if (m === undefined) {
			return v;
		}

		return [
			m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
			m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
			m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]
		];
	}

	/**
     * Invert a 3x3 matrix
     */
	function minv(m) {
		var det = 1 / mdet(m);
		return [
			[
				(m[1][1] * m[2][2] - m[1][2] * m[2][1]) * det,
				(m[0][2] * m[2][1] - m[0][1] * m[2][2]) * det,
				(m[0][1] * m[1][2] - m[0][2] * m[1][1]) * det
			],
			[
				(m[1][2] * m[2][0] - m[1][0] * m[2][2]) * det,
				(m[0][0] * m[2][2] - m[0][2] * m[2][0]) * det,
				(m[0][2] * m[1][0] - m[0][0] * m[1][2]) * det
			],
			[
				(m[1][0] * m[2][1] - m[1][1] * m[2][0]) * det,
				(m[0][1] * m[2][0] - m[0][0] * m[2][1]) * det,
				(m[0][0] * m[1][1] - m[0][1] * m[1][0]) * det
			]
		];
	}


	/**
	 * Multiply two 3x3 matrices
	 */
	function mmul(a, b) {
		return [
			[
				a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
				a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
				a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2]
			],
			[
				a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
				a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
				a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2]
			],
			[
				a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
				a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
				a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2]
			]
		];
	}

	return {
		multiply: mmul,
		vectorMultiply: mvecmul,
		invert: minv
	};
}());
