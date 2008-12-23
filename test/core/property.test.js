eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/property.js"));

var size;

testCases(test, 
	function setUp() {
		size = property('size', {width: 10, height: 5});
	},

	function checkNameAvailable() {
		var a = {};
		a = size(a);

		assert.that(typeof a.size, eq('function'));
	},

	function checkPropertyGet() {
		var a = {};
		a = size(a);

		assert.that(a.size().width, eq(10));
		assert.that(a.size().height, eq(5));
	},

	function checkPropertySet() {
		var a = {};
		a = size(a);

		assert.that(a.size({width: 5}).size().width, eq(5));
		assert.that(a.size({height: 10}).size().height, eq(10));
	},

	function tearDown() {
		size = null;
	}
);
