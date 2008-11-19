eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/core/function.js"));
eval(loadFile("src/core/fun.js"));
eval(loadFile("src/core/math.js"));

var Interval;

testCases(test, 
	function setUp() {
		Interval = Math.Interval;
	},

	function checkIntervalEmpty() {
		assert.that(Interval(1,1).isEmpty(), isFalse());
		assert.that(Interval(1,2).isEmpty(), isFalse());
		assert.that(Interval(2,1).isEmpty(), isTrue());		
	},

	function checkIntervalIn() {
		assert.that(Interval(0,10).isIn(1), isTrue());
		assert.that(Interval(0,10).isIn(0), isTrue());
		assert.that(Interval(0,10).isIn(10), isTrue());
	},

	function checkIntervalSubset() {
                assert.that(Interval(5,7).isSubset(Interval(0,10)), isTrue());
                assert.that(Interval(5,11).isSubset(Interval(0,10)), isFalse());
                assert.that(Interval(1,1).isSubset(Interval(1,1)), isTrue());
                assert.that(Interval(5,9).isSubset(Interval(6,9)), isFalse());
	},

	function checkIntervalLength() {
		assert.that(Interval(0,10).length(), eq(10));
		assert.that(Interval(1,1).length(), eq(0));
	},

	function checkAbs() {
		// test empty interval
		assert.that(Interval(10,1).abs().from, eq(1));
		assert.that(Interval(10,1).abs().to, eq(0));

		// test positive from
		assert.that(Interval(1,10).abs().from, eq(1));
		assert.that(Interval(1,10).abs().to, eq(10));

		// test negative to
		assert.that(Interval(-10, -1).abs().from, eq(10));
		assert.that(Interval(-10, -1).abs().to, eq(1));

		// test other
		assert.that(Interval(-2, 10).abs().from, eq(0));
		assert.that(Interval(-2, 10).abs().to, eq(10));
	},

	function checkNegate() {
		assert.that(Interval(-2, 10).negate().from, eq(2));
		assert.that(Interval(-2, 10).negate().to, eq(-10));
	},

	function checkIntervalAdd() {
		var a = Interval(1, 1);
		var b = Interval(1, 1);

		assert.that(a.add(b).from, eq(2));
		assert.that(a.add(b).to, eq(2));
		assert.that(a.add(1).from, eq(2));
		assert.that(a.add(1).to, eq(2));
	},

	function checkIntervalSubtract() {
		var a = Interval(1, 1);
		var b = Interval(1, 1);
		
		assert.that(a.subtract(b).from, eq(0));
		assert.that(a.subtract(b).to, eq(0));
		assert.that(a.subtract(1).from, eq(0));
		assert.that(a.subtract(1).to, eq(0));
	},

	function checkIntervalMultiply() {
		var a = Interval(2, 4);
		var b = Interval(2, 2);

		assert.that(a.multiply(b).from, eq(4));
		assert.that(a.multiply(b).to, eq(8));

		assert.that(a.multiply(2).from, eq(4));
		assert.that(a.multiply(2).to, eq(8));
	},

	function checkIntervalDivide() {
		var a = Interval(10,10);
		var b = Interval(2, 2);

		assert.that(a.divide(b).from, eq(5));
		assert.that(a.divide(b).to, eq(5));
		
		assert.that(a.divide(2).from, eq(5));
		assert.that(a.divide(2).to, eq(5));
	},

	function checkDistance() {
		var a = Interval(10,10);
		var b = Interval(2, 2);
	
		assert.that(a.distance(b), eq(8));
	},

	function checkCeilInt() {
		assert.that(Math.ceilInt(14900,1), eq(14900));
		assert.that(Math.ceilInt(14900,3), eq(15000));
		assert.that(Math.ceilInt(100,1), eq(100));
	},

	function checkLog10() {
		assert.that(Math.log10(1), eq(0));
		assert.that(Math.log10(10), eq(1));
		assert.that(Math.log10(100), eq(2));
		assert.that(isNaN(Math.log10(-1)), isTrue());
	},

	function checkDigits() {
		assert.that(Math.digits(1), eq(1));
		assert.that(Math.digits(0), eq(1));
		assert.that(Math.digits(-1), eq(1));
		assert.that(Math.digits(1.2023), eq(1));
		assert.that(Math.digits(12 * 12), eq(3));
	},

	function checkCharacters() {
		assert.that(Math.characters(1), eq(1));
		assert.that(Math.characters(-1), eq(2));
		assert.that(Math.characters(1.2023), eq(6));
		assert.that(Math.characters(12 * 12), eq(3));
	},

	function checkIsNegative() {
		assert.that(Math.isNegative(-1), isTrue());
		assert.that(Math.isNegative(0), isFalse());
		assert.that(Math.isNegative(1), isFalse());
	},

	function checkIsPositive() {
		assert.that(Math.isPositive(-1), isFalse());
		assert.that(Math.isPositive(0), isTrue());
		assert.that(Math.isPositive(1), isTrue());
	},

	function tearDown() {
		Interval = null;
	}
);
