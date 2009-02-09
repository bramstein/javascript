
var data = function () {
	return function (data) {
		var values = [],
			categories = [],
			subcategories = [];

		if (Object.isArray(data)) {
			values = data;
		}
		else if (Object.isObject(data) && data.data !== undefined && Object.isArray(data.data)) {
			values = data.data;
		}
		else {
			throw new TypeError('No data supplied.');
		}

		if (data.categories !== undefined && Object.isArray(data.categories) && data.categories.every(Object.isString)) {
			categories = data.categories;

			/*if (values.length !== categories.length) {
				throw new TypeError('The data does not match the number of categories.');
			}*/

			if (data.subcategories !== undefined && Object.isArray(data.subcategories) && data.subcategories.every(Object.isString)) {
				subcategories = data.subcategories;

				/*if (!values.every(function (set) {
					return Object.isArray(set) && set.length === subcategories.length;
				})) {
					throw new TypeError('The data does not match the number of subcategories.');
				}*/
			}
		}

		return {
			values: values,
			categories: categories,
			subcategories: subcategories
		};
	};
}();
