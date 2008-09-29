eval(loadFile("src/core/core.js"));
eval(loadFile("src/core/fun.js"));

var $;
var _;

testCases(test, 
	function setUp() {
		$ = fun.parameter;
		_ = fun.wildcard;
	},

	function checkParameterType() {
		assert.that(typeof $, eq('object'));
		assert.that($.constructor.name, eq('Parameter'));
	},

	function checkWildcardType() {
		assert.that(typeof _, eq('object'));
		assert.that(_.constructor.name, eq('Wildcard'));
	},

	function checkWildcard() {
		var f = fun(
			[_, function () { return true; }]
		);
		assert.that(f('a'), isTrue());
	},

	function checkParameter() {
		var f = fun(
			[$, function (v) { return v; }]
		);
		assert.that(f('hello'), eq('hello'));
	},

	function checkMultipleParameters() {
		var f = fun(
			[$, $, function (a, b) { return a + b; }]
		);
		assert.that(f(2, 2), eq(4));
		assert.that(f('hel', 'lo'), eq('hello'));
	},

	function checkSimpleTypes() {
		var f = fun(
			[1, function () { return 'one'; }],
			['str', function () { return 'string'; }],
			[true, function () { return true; }],
			[false, function () { return false; }],
			[undefined, function() { return 'undef'; }],
			[NaN, function() { return 'NotANumber'; }],
			[Infinity, function() { return 'Infi'; }],
			[null, function() { return 'NULL'; }]
		);
		assert.that(f(1), eq('one'));
		assert.that(f('str'), eq('string'));
		assert.that(f(true), isTrue());
		assert.that(f(false), isFalse());
		assert.that(f(undefined), eq('undef'));
		assert.that(f(Infinity), eq('Infi'));
		assert.that(f(NaN), eq('NotANumber'));
		assert.that(f(null), eq('NULL'));
	},

	function checkNonExhaustive() {
		var f = fun(
			[1, function() { return 'one'; }]
		);
		shouldThrowException(function() {
			f(2);
		});
	},

	function checkSimpleObject() {
		var f = fun(
			[{hello: 'world'}, function() { return true; }],
			[_, function() { return false; }]
		);
		assert.that(f({hello: 'world'}), isTrue());
		assert.that(f({hello: 'planet'}), isFalse());
	},

	function checkSimpleArray() {
		var f = fun(
			[[1, 2, 3], function() { return true; }],
			[_, function() { return false; }]
		);
		assert.that(f([1, 2, 3]), isTrue());
		assert.that(f([1, 3, 2]), isFalse());
		assert.that(f([1, 2, 4]), isFalse());
	},

	function checkSimpleFunction() {
		var f = fun(
			[Date, function(d) { return true; }],
			[_, function() { return false; }]
		);
		assert.that(f(new Date()), isTrue());
	},

	function checkInstances() {
		var f;

		function Vector(x, y) {
			if (! (this instanceof Vector)) {
				return new Vector(x, y);
			}
			this.x = x;
			this.y = y;
		}
		function Point(x, y) {
			if (! (this instanceof Point)) {
				return new Point(x, y);
			}
			this.x = x;
			this.y = y;
		}

		f = fun(
			[Vector($, $), function(x, y) { return 'vec: ' + x + ', ' + y; }],
			[Point($, $),  function(x, y) { return 'point: ' + x + ', ' + y; }]
		);
		assert.that(f(Vector(10,10)), eq('vec: 10, 10'));
		assert.that(f(Point(20,20)), eq('point: 20, 20'));
	},

	function tearDown() {
		$ = null;
		_ = null;
	}
);
