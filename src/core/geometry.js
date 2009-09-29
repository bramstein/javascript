var geometry = (function () {
	function Size(width, height) {
		if (!(this instanceof Size)) {
			return new Size(width, height);
		}
		this.width = width || 0;
		this.height = height || 0;
	}

	Object.extend(Size.prototype, {
		area: function () {
			return this.width * this.height;
		},
		isEmpty: function () {
			return this.area() === 0;
		},
		scale: function (s) {
			this.width *= s;
			this.height *= s;
			return this;
		}
	});

	function Point(x, y) {
		if (!(this instanceof Point)) {
			return new Point(x, y);
		}
		
		this.x = x || 0;
		this.y = y || 0;
	}

	function Rectangle(x, y, width, height) {
		if (!(this instanceof Rectangle)) {
			return new Rectangle(x, y, width, height);
		}
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || 0;
		this.height = height || 0;
	}

	Object.extend(Rectangle.prototype, {
		contains: function (point) {
			return point.x >= this.x && point.x <= this.x + this.width &&
					point.y >= this.y && point.y <= this.y + this.height;
		}
	});

	function Box(top, left, bottom, right) {
		if (!(this instanceof Box)) {
			return new Box(top, left, bottom, right);
		}
		this.top = top || 0;
		this.left = left || 0;
		this.bottom = bottom || 0;
		this.right = right || 0;
	}

	return {
		Size: Size,
		Point: Point,
		Rectangle: Rectangle,
		Box: Box
	};
}());
