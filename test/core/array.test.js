eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/core/function.js"));

testCases(test, 
	function setUp() {
	},

	function checkArrayReduce() {
		var a = [1, 2, 3, 4];
		assert.that(a.reduce(function (rv, v) {
			return rv + v;
		}), eq(10));

		assert.that(a.reduce(function (rv, v) {
			return rv + v;
		}, 10), eq(20));

		assert.that(a.reduceRight(function (rv, v) {
			return rv + v;
		}), eq(10));

		assert.that(a.reduceRight(function (rv, v) {
			return rv + v;
		}, 10), eq(20));
	},


	function checkIsEmpty() {
		assert.that([].isEmpty(), isTrue());
		assert.that([1].isEmpty(), isFalse());
	},

	function checkArrayTop() {
		assert.that([].top(), eq(undefined));
		assert.that([1].top(), eq(1));
	},

	function checkArrayAppend() {
		var a = [1, 2];
		a.append([3]);
		assert.that(a, containsInOrder(1, 2, 3));

		a.append([4, 5]);
		assert.that(a, containsInOrder(1, 2, 3, 4, 5));

		a.append([6, 7], [], [8, 9], [], [], [10]);
		assert.that(a, containsInOrder(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
	},

	function checkArrayContains() {
		var a = [1, 2];
		assert.that(a.contains(1), isTrue());
		assert.that(a.contains(2), isTrue());
		assert.that(a.contains(3), isFalse());
	},

	function tearDown() {
	}
);
