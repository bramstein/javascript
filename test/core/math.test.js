eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/core/function.js"));
eval(loadFile("src/core/fun.js"));
eval(loadFile("src/core/math.js"));


testCases(test, 
	function setUp() {
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
        // JavaScript does not have negative zero.
        assert.that(Math.isPositive(-0), isTrue());
		assert.that(Math.isPositive(1), isTrue());
	},

	function tearDown() {
	}
);
