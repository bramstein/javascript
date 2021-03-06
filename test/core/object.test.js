eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/core/function.js"));

var testObject;
var testFunction;
var testArray;

testCases(test, 
	function setUp() {
		testObject = {one: 1, two: 2 },
		testFunction = function() { return true; };
		testArray = [1, 2, 3, 5];
	},

	function checkIsArray() {
		assert.that(Object.isArray([]), isTrue());
		assert.that(Object.isArray(testArray), isTrue());
		assert.that(Object.isArray(1), isFalse());
		assert.that(Object.isArray(testObject), isFalse());
		assert.that(Object.isArray(testFunction), isFalse());
		assert.that(Object.isArray(arguments), isFalse());
		assert.that(Object.isArray(new Array()), isTrue());
		assert.that(Object.isArray(new Array(1)), isTrue());
	},

	function checkIsObject() {
		assert.that(Object.isObject({}), isTrue());
		assert.that(Object.isObject(testObject), isTrue());
		assert.that(Object.isObject(testArray), isFalse());
		assert.that(Object.isObject(1), isFalse());
		assert.that(Object.isObject(testFunction), isFalse());
		assert.that(Object.isObject(new Object()), isTrue());
		assert.that(Object.isObject(new Number()), isFalse());
		assert.that(Object.isObject(new Array()), isFalse());
	},

	function checkIsFunction() {
		assert.that(Object.isFunction(testFunction), isTrue());
		assert.that(Object.isFunction(Date), isTrue());
		assert.that(Object.isFunction(1), isFalse());
		assert.that(Object.isFunction(testObject), isFalse());
		assert.that(Object.isFunction(new Number()), isFalse());
	},

	function checkIsBoolean() {
		assert.that(Object.isBoolean(true), isTrue());
		assert.that(Object.isBoolean(false), isTrue());
		assert.that(Object.isBoolean(null), isFalse());
		assert.that(Object.isBoolean(0), isFalse());
		assert.that(Object.isBoolean(new Boolean(true)), isTrue());
	},

	function checkIsNumber() {
		assert.that(Object.isNumber(1), isTrue());
		assert.that(Object.isNumber('sxds'), isFalse());
		assert.that(Object.isNumber(NaN), isFalse());
		assert.that(Object.isNumber(new Number(5)), isTrue());
	},

	function checkIsAtom() {
		assert.that(Object.isAtom(null), isTrue());
		assert.that(Object.isAtom(1), isTrue());
		assert.that(Object.isAtom('yes'), isTrue());
		assert.that(Object.isAtom(false), isTrue());
		assert.that(Object.isAtom(true), isTrue());
		assert.that(Object.isAtom(undefined), isTrue());
		assert.that(Object.isAtom(Infinity), isTrue());
		assert.that(Object.isAtom(NaN), isTrue());
		assert.that(Object.isAtom(''), isTrue());
		assert.that(Object.isAtom(0), isTrue());
		assert.that(Object.isAtom(testArray), isFalse());
		assert.that(Object.isAtom(testObject), isFalse());
		assert.that(Object.isAtom(testFunction), isFalse());
		assert.that(Object.isAtom(new Boolean(true)), isTrue());
		assert.that(Object.isAtom(new Number(5)), isTrue());
		assert.that(Object.isAtom(new Array()), isFalse());
	},

	function testIsDefined() {
		assert.that(Object.isDefined(1), isTrue());
		assert.that(Object.isDefined(null), isTrue());
		assert.that(Object.isDefined(undefined), isFalse());
	},

	function checkObjectExtend() {
		assert.that(Object.extend({}, {hello: 'world'}).hello, eq('world'));
		assert.that(Object.extend({}, {hello: 'world'}, {hello: 'me'}).hello, eq('me'));
		assert.that(Object.extend({hello: 'world'}, {hello: 'planet'}).hello, eq('planet'));
	},

	function checkObjectExtendToString() {
		function Test() {
			this.hello = "world";
		}
		
		Object.extend(Test.prototype, {
			toString: function () {
				return this.hello;
			}
		});	

		assert.that(new Test().toString(), eq("world"));
	},

	function checkObjectExtendValueOf() {
		function Test() {
			this.value = false;
		}

		Object.extend(Test.prototype, {
			valueOf: function () {
				return this.value;
			}
		});

		assert.that(new Test().valueOf(), isFalse());
	},

	function checkIsEmpty() {
		assert.that(Object.isEmpty({}), isTrue());
		assert.that(Object.isEmpty({hello: 'world'}), isFalse());
		assert.that(Object.isEmpty({hello: function() { return true; }}), isFalse());
	},

	function checkObjectMap() {
		assert.that(Object.map(testObject, function (value) { return value + 1; }).one, eq(2));
		assert.that(Object.isEmpty(Object.map({}, function() { return false;})), isTrue());
		assert.that(Object.map({fun: testFunction}, function (value) { return value; }).fun(), isTrue());
	},

	function checkObjectForEach() {
		var i = 0;
		Object.forEach({}, function () { i += 1; });
		assert.that(i, eq(0));
		i = 0;
		Object.forEach({hello: 'world', v: 1}, function() { i += 1; });
		assert.that(i, eq(2));
		i = 0;
		Object.forEach({fun: testFunction}, function() { i += 1; });
		assert.that(i, eq(1));
	},

	function checkObjectEvery() {
		assert.that(Object.every(testObject, function(value) { return value <= 1; }), isFalse());
		assert.that(Object.every(testObject, function(value) { return value <= 2; }), isTrue());
	},

	function checkObjectSome() {
		assert.that(Object.some(testObject, function(value) { return value <= 1; }), isTrue());
		assert.that(Object.some(testObject, function(value) { return value >= 3; }), isFalse());
	},

	function checkObjectClone() {
		var o = Object.clone(testObject);
		assert.that(('one' in o) && ('two' in o), isTrue());
		assert.that(o.hasOwnProperty('one') && o.hasOwnProperty('two'), isFalse());
		assert.that(o.one, eq(1));
		assert.that(o.two, eq(2));
	},
    
    function checkArrayClone() {
        // Interestingly enough, cloning an array turns it into an object.
        // This might seems a bit odd at first, but makes sense.
        assert.that(Object.isArray(Object.clone([1, 2, 3])), isFalse());
    },
/*
	function checkEquals() {
		var o1 = {hello: 'world', bye: 'planet', a: [1, 2], o: {goodbye: 'you'}};
		var o2 = {bye: 'planet', hello: 'world', a: [1, 2], o: {goodbye: 'you'}};
		var a1 = [1, 2, 3, 'str', true];
		var a2 = [1, 2, 3, 'str', true];
		var a3 = [1, 2, 3, 'str', true, false];

		assert.that((1).equals(1), isTrue());
		assert.that((1).equals(2), isFalse());

		assert.that('a'.equals('a'), isTrue());		
		assert.that(true.equals(true), isTrue());
		assert.that(false.equals(false), isTrue());
		assert.that(a1.equals(a2), isTrue());
		assert.that(a1.equals(a3), isFalse());
		
		assert.that(Object.equals(o1, o2), isTrue());
	},

	function checkEqualsNull() {
		assert.that(Object.equals(null, {}), isFalse());
	},

	function checkEqualsArrayObject() {
		assert.that(Object.equals({}, []), isFalse());
	},

	function checkEqualsObjectLiteral() {
		var a = {};
		var b = { foo: undefined };
		assert.that(Object.equals(a, b), isFalse());
	},

	function checkEqualsNaN() {
		assert.that(NaN.equals(NaN), isTrue());
	},

	function checkEqualsDate() {
		var d1 = new Date(),
			d2 = new Date();

		d1.setMilliseconds(0);
		d2.setMilliseconds(0);

		assert.that(d1.valueOf(), eq(d2.valueOf()));
		assert.that(d1.equals(d2), isTrue());
	},

	function checkEqualsRegExp() {
		var a = /./,
			b = /./,
			c = /.1/;
		assert.that(a.equals(a), isTrue());
		assert.that(a.equals(b), isTrue());	
		assert.that(a.equals(c), isFalse());
		
	},
*/
	function checkObjectFilter() {
		var o = {a: 1, b: 0, c: 1, d: 0, e: 1, f: 1},
			t = {a: 1, c: 1, e: 1, f: 1},
			k = {b: 0, d: 0};
/*
		assert.that(
			Object.equals(
				Object.filter(o, function (value, key) {
					return value === 1;
				}), 
				t), 
			isTrue());

		assert.that(
			Object.equals(
				Object.filter(o, function (value, key) {
					return value === 0;
				}),
				k),
			isTrue());
*/
	},
    
    function checkObjectCopy() {    
        assert.that(Object.copy(1), eq(1));
        assert.that(Object.copy('str'), eq('str'));
        assert.that(Object.copy(new String('str')).valueOf(), eq('str'));
        
        assert.that(Object.copy([1])[0], eq(1));
        assert.that(Object.isArray(Object.copy([1, 2, 3])), isTrue());
        
        assert.that(Object.copy({a: 1}).a, eq(1));
        assert.that(Object.isObject(Object.copy({a: 1})), isTrue());
        
        assert.that(Object.copy({a: [1, 2]}).a[0], eq(1));
    },
    
    function checkObjectShallowCopy() {
        var a = {a: [1, 2]},
            b = Object.copy(a),
            c = {a: {b: 'str'}},
            d = Object.copy(c);
    
        a.a[0] = 3;
        
        assert.that(b.a[0], eq(3));
        
        c.a.b = 'no';
        
        assert.that(d.a.b, eq('no'));    
    },
    
    function checkObjectDeepCopy() {
        var a = {a: [1, 2]},
            b = Object.copy(a, true),
            c = {a: {b: 'str'}},
            d = Object.copy(c, true);
    
        a.a[0] = 3;
        
        assert.that(b.a[0], eq(1));
        
        c.a.b = 'no';
        
        assert.that(d.a.b, eq('str'));
    },

	function checkObjectReduce() {
		var o = {a: 1, b: 2, c: 3, d: 4};
		assert.that(Object.reduce(o, function (rv, v) {
			return rv + v;
		}), eq(10));

		assert.that(Object.reduce(o, function (rv, v) {
			return rv + v;
		}, 10), eq(20));
	},

	function checkValues() {
		var o = {a: 1, b: 2, c: 3, d: 4};
		// Note that Objects are unordered, so the array might not be sequential
		assert.that(Object.values(o).every(function (v) { return v <= 4 && v >= 1; }), isTrue());
		assert.that(Object.values(o).length, eq(4));
	},

	function checkKeys() {
		var o = {a: 1, b: 2, c: 3, d: 4};

		assert.that(Object.keys(o).every(function (v) { return ['a', 'b', 'c', 'd'].contains(v); }), isTrue());
		assert.that(Object.keys(o).length, eq(4));
	},

	function tearDown() {
		testObject = null;
		testFunction = null;
		testArray = null;
	}
);
