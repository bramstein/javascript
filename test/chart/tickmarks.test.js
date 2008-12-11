eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/core/function.js"));
eval(loadFile("src/core/fun.js"));
eval(loadFile("src/core/math.js"));
eval(loadFile("src/chart/interval.js"));
eval(loadFile("src/chart/tickmarks.js"));

testCases(test, 
	function setUp() {
	},

	function testNicenum() {
		self.log(tickmarks.nicenum(1.5));
	},

	function testLooseBig() {
		assert.that(tickmarks.loose({from: 105, to: 543}, 5)[0], eq(100));
		assert.that(tickmarks.loose({from: 105, to: 543}, 5)[1], eq(200));
		assert.that(tickmarks.loose({from: 105, to: 543}, 5)[2], eq(300));
		assert.that(tickmarks.loose({from: 105, to: 543}, 5)[3], eq(400));
		assert.that(tickmarks.loose({from: 105, to: 543}, 5)[4], eq(500));
		assert.that(tickmarks.loose({from: 105, to: 543}, 5)[5], eq(600));
	},

	function testLooseSmall() {
		self.log(tickmarks.loose({from: 0.105, to: 0.543}, 5));
	},

	function testLooseNegative() {
		self.log(tickmarks.loose({from: -50, to: 50}, 10));
	},

	function testTight() {
		self.log(tickmarks.tight({from: 105, to: 543}, 5));
	},

	function tearDown() {
	}
);
