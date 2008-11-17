eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/core/function.js"));

testCases(test, 
	function setUp() {
	},

	function checkFunctionBind() {
		var o = {value: 'yes'};
		var f = function () {
			return this.value;
		}.bind(o);
		assert.that(f(), eq('yes'));
	},

	function checkFunctionCurry() {
		var add = function (a, b) {
			return a + b;
		};

		assert.that(add.curry(1)(1), eq(2));
		assert.that(add.curry(2, 2)(), eq(4));
	},

	function checkFunctionDefaults() {
		var a = function () {
			return arguments[0];
		}.defaults(true);

		var b = function (a, b) {
			return a + b;
		}.defaults(1, 1);

		assert.that(a(), isTrue());
		assert.that(b(), eq(2));
		assert.that(b(2), eq(3));
		assert.that(b(2,2), eq(4));
	},

	function checkConstructorDefaults() {
		function Test(a) {
			if (! (this instanceof Test)) {
				return new Test(a);
			}
			this.result = a;
		}

		Test = Test.defaults(true);

		assert.that(Test().result, isTrue());
		assert.that(Test(false).result, isFalse());
		assert.that(Test(true) instanceof Test, isTrue());
		assert.that(Test().constructor, eq(Test));
	},

	function checkChain() {
	},

	function tearDown() {
	}
);
