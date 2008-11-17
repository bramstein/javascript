eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/core/function.js"));
eval(loadFile("src/core/fun.js"));
eval(loadFile("src/core/arrow.js"));

var $;
var _;
var add1;
var currentValue;

testCases(test, 
	function setUp() {
		$ = fun.parameter;
		_ = fun.wildcard;
		add1 = function (x) { return x + 1; };
		currentValue = 0;
	},

	function simpleFunctionArrows() {
		var add2 = add1.next(add1);
		assert.that(add2(1), eq(3));

		var add3 = add2.next(add1);
		assert.that(add3(1), eq(4));

		var add4 = add2.next(add2);
		assert.that(add4(1), eq(5));
	},

	function AsynchronousArrowLongCall() {	
		var current = add1.Arrow();
		var size = 1000;

		function report(x) {
			currentValue = x;
			self.log(x);
		}

		for (var i = 0; i < size; i += 1) {	
			current = current.next(add1.Arrow());
		}

		current = current.next(report.Arrow());

		current.run(1);
	
		assert.that(currentValue, eq(size + 2));
	},

	function tearDown() {
		$ = null;	
		_ = null;
		add1 = null;
	}
);
