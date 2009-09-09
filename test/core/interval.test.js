eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/core/function.js"));
eval(loadFile("src/core/fun.js"));
eval(loadFile("src/core/math.js"));
eval(loadFile("src/core/interval.js"));

var I;

testCases(test, 
	function setUp() {
		I = Interval;
	},

	function checkIntervalEmpty() {
		assert.that(I.empty({from: 1, to: 1}), isFalse());
		assert.that(I.empty({from: 1, to: 2}), isFalse());
		assert.that(I.empty({from: 2, to: 1}), isTrue());	
	},

	function checkIntervalIn() {
		assert.that(I.contains({from: 0, to: 10}, 1), isTrue());
		assert.that(I.contains({from: 0, to: 10}, 0), isTrue());
		assert.that(I.contains({from: 0, to: 10}, 11), isFalse());
	},

	function checkIntervalSubset() {
		assert.that(I.subset({from: 5, to: 7}, {from: 0, to: 10}), isTrue());
		assert.that(I.subset({from: 5, to: 11}, {from: 0, to: 10}), isFalse());
		assert.that(I.subset({from: 1, to: 1}, {from: 1, to: 1}), isTrue());
		assert.that(I.subset({from: 5, to: 9}, {from: 6, to: 9}), isFalse());
	},

	function checkIntervalWidth() {
		assert.that(I.width({from: 0, to: 10}), eq(10));
		assert.that(I.width({from: 1, to: 1}), eq(0));
	},

	function checkAbs() {
		// test empty interval
		assert.that(I.abs({from: 10, to: 1}).from, eq(1));
		assert.that(I.abs({from: 10, to: 1}).to, eq(0));

		// test positive from
		assert.that(I.abs({from: 1, to: 10}).from, eq(1));
		assert.that(I.abs({from: 1, to: 10}).to, eq(10));

		// test negative to
		assert.that(I.abs({from: -10, to: -1}).from, eq(1));
		assert.that(I.abs({from: -10, to: -1}).to, eq(10));

		// test other
		assert.that(I.abs({from: -2, to: 10}).from, eq(0));
		assert.that(I.abs({from: -2, to: 10}).to, eq(10));
	},

	function checkNegate() {
		assert.that(I.neg({from: -2, to: 10}).from, eq(-10));
		assert.that(I.neg({from: -2, to: 10}).to, eq(2));
	},

	function checkIntervalAdd() {
		var a = {from: 1, to: 1};
		var b = {from: 1, to: 1};

		assert.that(I.add(a, b).from, eq(2));
		assert.that(I.add(a, b).to, eq(2));
	},

	function checkIntervalSubtract() {
		var a = {from: 1, to: 1};
		var b = {from: 1, to: 1};
		
		assert.that(I.sub(a, b).from, eq(0));
		assert.that(I.sub(a, b).to, eq(0));
	},

	function checkIntervalMultiply() {
		var a = {from: 2, to: 4};
		var b = {from: 2, to: 2};

		assert.that(I.mul(a, b).from, eq(4));
		assert.that(I.mul(a, b).to, eq(8));

	},

	function checkIntervalDivide() {
		var a = {from: 10, to: 10};
		var b = {from: 2, to: 2};

		assert.that(I.div(a, b).from, eq(5));
		assert.that(I.div(a, b).to, eq(5));
	},

	function checkDistance() {
		var a = {from: 10, to: 10};
		var b = {from: 2, to: 2};
	
		assert.that(I.distance(a, b), eq(8));
	},


	function tearDown() {
		I = null;
	}
);
