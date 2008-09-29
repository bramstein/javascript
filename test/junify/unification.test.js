eval(loadFile("src/junify/unification.js"));

var $;
var _;
var u;

testCases(test, 
	function setUp() {
		$ = unification.variable;
		_ = unification._;
		u = unification.unify;
	},

	function checkArray() {
		assert.that(u([], []), isTrue());
		assert.that(u([1],[1]), isTrue());
		assert.that(u([1],[2]), isFalse());
		assert.that(u([1, [3, 4], 5], [1, [3, 4], 5]), isTrue());
	},

	function checkObject() {
		assert.that(u({}, {}), isTrue());
		assert.that(u({hello: 'world'}, {hello: 'world'}), isTrue());
		assert.that(u({hello: 'world', key: 'value'}, {key: 'value', hello: 'world'}), isTrue());
		assert.that(u({hello: 'world', key: 'value'}, {hello: 'world'}), isFalse());
		assert.that(u({hello: 'world'}, {hello: 'world', key: 'value'}), isFalse());
	},

	function checkVariable() {
		assert.that(u($('a'), 1).a, eq(1));
		assert.that(u(1, $('a')).a, eq(1));
		assert.that(u({hello: $('a')}, {hello: 'world'}).a, eq('world'));

		assert.that(u([$('a'), $('a')], [1, 2]), isFalse());
		assert.that(u($('a'), $('a')), isFalse());
		assert.that(u([$('a'), 2], [1, $('a')]), isFalse());
		assert.that(u([[$('a')],$('b')], [[1],2]).a, eq(1));
		assert.that(u($('n'), function () { return 10; }()).n, eq(10));
	},

	function checkType() {
		assert.that(u($('d', Date), new Date()), isTrue());
		assert.that(u($('d', String), 'hello'), isTrue());
		assert.that(u(String, _), isTrue());
	},

	function checkWildcard() {
		assert.that(u(_, _), isTrue());
		assert.that(u(_, 1), isTrue());
		assert.that(u(1, _), isTrue());
	},

	function checkWildcardArray() {
		assert.that(u(_, [1, 2]), isTrue());
		assert.that(u([1, 2], _), isTrue());
	},

	function checkWildcardVariable() {
		assert.that(u($('a'), _).a, eq(undefined));
		assert.that(u(_, $('a')).a, eq(undefined));
	},

	function checkWildcardObject() {
		assert.that(u({_ : _}, {_ : _}), isTrue());
		assert.that(u({_ : _}, {}), isFalse());
		assert.that(u({}, {_ : _}), isFalse());

		assert.that(u(_, {hello: 'world'}), isTrue());
		assert.that(u({hello: 'world'}, _), isTrue());
		assert.that(u({hello: 'world', _: _}, {key: 'value', _ : _ }), isTrue());
		assert.that(u({hello: 'world', _: _}, {key: 'value', hello: 'world'}), isTrue());
		assert.that(u({hello: 'world', key: _}, {key: 'value', hello: 'world'}), isTrue());
	},

	function tearDown() {
		$ = null;
		_ = null;
		u = null;
	}
);
