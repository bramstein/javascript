
var data = function () {
	function Data (data, options) {
		this.data = function () {
			return data;
		};
		
		this.min = function () {
			return options.min.map(function (v) {
				return v -= 0.0001;
			});
		};

		this.max = function () {
			return options.max.map(function (v) {
				return v += 0.0001;
			});
		}

		this.labels = function () {
			return options.labels;
		};
		return this;
	}

	function isData(value) {
		return value instanceof Data;
	}
	function Category() {
		var args = Array.slice(arguments);

		if(args.every(function (v) { return typeof v === 'string'; })) {
			return {
				data: function () {
					var a = Array.slice(arguments),
						min = Number.MAX_VALUE,
						max = Number.MIN_VALUE;

					if (a.length === args.length) {
						if (a.every(Object.isNumber)) {
							a.forEach(function (v) {
								min = Math.min(min, v);
								max = Math.max(max, v);
							});

							return new Data(a, {labels: args, min: [min], max: [max] });
						}
						else if (a.every(isData)) {
							return new Data(a, {labels: args });
						}
						else {
							throw new TypeError('Data must be numeric.');
						}
					}
					else {
						throw new TypeError('The data does not match the number of categories.');
					}
				}		
			};
		}
		else {
			throw new TypeError('A category must only contain strings.');
		}
	}

	function Variable(len) {
		if (len <= 0) {
			throw new TypeError('The number of variables must be greater than zero.');
		}

		return {
			data: function () {
				var args = Array.slice(arguments),
					min = [],
					max = [], 
					i = 0;

				for (; i < len; i += 1) {
					min[i] = Number.MAX_VALUE;
					max[i] = Number.MIN_VALUE;
				}

				if (args.every(Object.isNumber) && len === 1) {
					return new Data(args.map(function (v) {
						min[0] = Math.min(min[0], v);
						max[0] = Math.max(max[0], v);
						return [v];
					}), { min: min, max: max});
				}
				else if (args.every(function (v) { return Object.isArray(v) && v.length === len && v.every(Object.isNumber); })) {

					// For len = 2
					// [ [1, 2], [2, 4], [5, 1] ]
					args.forEach(function (set) {
						var j = 0;
						set.forEach(function (v) {

							min[j] = Math.min(min[j], v);
							max[j] = Math.max(max[j], v);
							j += 1;
						});
					});	

					return new Data(args, {min: min, max: max});
				}
				else {
					throw new TypeError('The data does not match the number of variables');
				}
			}
		};
	}

	return {
		category: Category,
		variable: Variable,
		isValid: isData
	};
}();
