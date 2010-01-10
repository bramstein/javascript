eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/core/function.js"));
eval(loadFile("src/core/fun.js"));

var $;
var _;
var channels;

testCases(test, 
	function setUp() {
		$ = fun.parameter;
		_ = fun.wildcard;
		channels = {
   1: { station:   "NBC",
         showTitle: "Saturday Night Live",
         genre:     "comedy",
         repeat:    true },
 
   2: { station:   "FOX",
         showTitle: "Cops",
         genre:     "crime",
         repeat:    true },
 
   3: { station:   "ESPN",
         showTitle: "College Football",
         genre:     "football",
         repeat:    false },
 
   4: { station:   "HBO",
         showTitle: "Curb Your Enthusiasm",
         genre:     "comedy",
         repeat:    false }
};
	},

	function checkParameterType() {
		assert.that(typeof $, eq('function'));
		assert.that(typeof $(), eq('object'));
		assert.that($().constructor.name, eq('Parameter'));
		assert.that($('a').name, eq('a'));
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

	function checkEmptyArray() {
		var isEmpty = fun(
			[[], function () { return true; }],
			[_, function () { return false; }]
		);

		assert.that(isEmpty([]), isTrue());
		assert.that(isEmpty([1,2]), isFalse());
	},

	function checkEmptyObject() {
		var isEmpty = fun(
			[{}, function () { return true; }],
			[_, function () { return false;}]
		);
		assert.that(isEmpty({}), isTrue());
		assert.that(isEmpty({hello: 'world'}), isFalse());
	},

	function checkNamedParameter() {
		var t = fun(
			[$('a'), function(b) { return b; }]
		);

		assert.that(t('c'), eq('c'));
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


	function checkChannels() {
		function record(channel) {
			project.log("recording channel: " + channel);
		}

		var surf = fun(
			[{genre: 'football', showTitle: _, repeat: _, station: _}, $, record],
			[{genre: 'comedy', showTitle: _, repeat: false, station: _}, $, record],
			[{genre: 'crime', showTitle: 'Cops', repeat: _, station: _}, $, record],
			[{genre: _, showTitle: _, repeat: _, station: _}, $, function () {}]
		);

		Object.forEach(channels, surf);
	},


	/**
	 * Extract
	 */


	function checkExtractAtoms() {
		assert.that(extract($('a'), 1).a, eq(1));
		assert.that(extract($('a'), 'str').a, eq('str'));
		assert.that(extract($('a'), null).a, eq(null));
		assert.that(extract($('a'), undefined).a, eq(undefined));
		assert.that(extract($('a'), false).a, isFalse());
		assert.that(extract($('a', true), false).a, isTrue());
		assert.that(extract($('a'), true).a, isTrue());
	},

	function checkExtractUnnamedVariable() {
		shouldThrowException(function() {
			extract($, 1);
		});
	},

	function checkExtractArray() {
		assert.that(extract([$('a')], [1]).a, eq(1));
	},

	function checkExtractSparseArray() {
		assert.that(extract([, , $('a')], [1, 2, 3]).a, eq(3));
		assert.that(extract([, , $('a')], [1]).a, eq(undefined));
	},

	function checkExtractObject() {
		assert.that(extract({key: $('a')}, {key: 'str'}).a, eq('str'));
		assert.that(extract({family: {father: $('f')}}, {family: {father: 'Bob'}}).f, eq('Bob'));
	},

	function checkExtractSparseObject() {
		assert.that(extract({key: $('a')}, {key: 'b', str: 'hello world', t: 'test'}).a, eq('b'));
	},

    function checkExtractUnavailable() {
        assert.that(extract({hm: $('a')}, {hello: 'world'}).a, eq(undefined));
    },

	function checkExtractNameClash() {
		assert.that(extract([$('a'), $('a')], [1, 2]).a, eq(2));
	},

	function checkExtractWildcard() {
		assert.that(extract([_, _, $('a')], [1, 2, 3]).a, eq(3));
		assert.that(extract({key: _, test: $('a')}, {key: 'b', test: 'y'}).a, eq('y'));
		assert.that(extract({key: _, test: $('a')}, {test: 'y'}).a, eq('y'));
	},


	function tearDown() {
		$ = null;
		_ = null;
		channels = null;
	}
);
