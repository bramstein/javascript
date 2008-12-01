eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/core/function.js"));
eval(loadFile("src/core/fun.js"));
eval(loadFile("src/core/math.js"));
eval(loadFile("src/chart/interval.js"));

testCases(test, 
	function setUp() {
	},

	function checkIntervalEmpty() {
		assert.that(Interval(1,1).isEmpty(), isFalse());
		assert.that(Interval(1,2).isEmpty(), isFalse());
		assert.that(Interval(2,1).isEmpty(), isTrue());		
	},

	function checkIntervalIn() {
		assert.that(Interval(0,10).has(1), isTrue());
		assert.that(Interval(0,10).has(0), isTrue());
		assert.that(Interval(0,10).has(10), isTrue());
	},

	function checkIntervalSubset() {
        assert.that(Interval(5,7).hasSubset(Interval(0,10)), isTrue());
        assert.that(Interval(5,11).hasSubset(Interval(0,10)), isFalse());
        assert.that(Interval(1,1).hasSubset(Interval(1,1)), isTrue());
        assert.that(Interval(5,9).hasSubset(Interval(6,9)), isFalse());
	},

	function checkIntervalWidth() {
		assert.that(Interval(0,10).width(), eq(10));
		assert.that(Interval(1,1).width(), eq(0));
	},

	function checkAbs() {
		// test empty interval
		assert.that(Interval.abs(Interval(10,1)).from, eq(1));
		assert.that(Interval.abs(Interval(10,1)).to, eq(0));

		// test positive from
		assert.that(Interval.abs(Interval(1,10)).from, eq(1));
		assert.that(Interval.abs(Interval(1,10)).to, eq(10));

		// test negative to
		assert.that(Interval.abs(Interval(-10, -1)).from, eq(1));
		assert.that(Interval.abs(Interval(-10, -1)).to, eq(10));

		// test other
		assert.that(Interval.abs(Interval(-2, 10)).from, eq(0));
		assert.that(Interval.abs(Interval(-2, 10)).to, eq(10));
	},

	function checkNegate() {
		assert.that(Interval(-2, 10).negate().from, eq(-10));
		assert.that(Interval(-2, 10).negate().to, eq(2));
	},

	function checkIntervalAdd() {
		var a = Interval(1, 1);
		var b = Interval(1, 1);

		assert.that(Interval(1, 1).add(b).from, eq(2));
		assert.that(Interval(1, 1).add(b).to, eq(2));
		assert.that(Interval(1, 1).add(1).from, eq(2));
		assert.that(Interval(1, 1).add(1).to, eq(2));
	},

	function checkIntervalSubtract() {
		var a = Interval(1, 1);
		var b = Interval(1, 1);
		
		assert.that(Interval(1, 1).subtract(b).from, eq(0));
		assert.that(Interval(1, 1).subtract(b).to, eq(0));
		assert.that(Interval(1, 1).subtract(1).from, eq(0));
		assert.that(Interval(1, 1).subtract(1).to, eq(0));
	},

	function checkIntervalMultiply() {
		var a = Interval(2, 4);
		var b = Interval(2, 2);

		assert.that(Interval(2, 4).multiply(b).from, eq(4));
		assert.that(Interval(2, 4).multiply(b).to, eq(8));

		assert.that(Interval(2, 4).multiply(2).from, eq(4));
		assert.that(Interval(2, 4).multiply(2).to, eq(8));
	},

	function checkIntervalDivide() {
		var a = Interval(10,10);
		var b = Interval(2, 2);

		assert.that(Interval(10, 10).divide(b).from, eq(5));
		assert.that(Interval(10, 10).divide(b).to, eq(5));
		
		assert.that(Interval(10, 10).divide(2).from, eq(5));
		assert.that(Interval(10, 10).divide(2).to, eq(5));
	},

	function checkDistance() {
		var a = Interval(10,10);
		var b = Interval(2, 2);
	
		assert.that(a.distance(b), eq(8));
	},

	function tearDown() {
	}
);
