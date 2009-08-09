eval(loadFile("src/preprocessor/js-preprocess.js"));

importClass(java.io.FileReader);
importClass(Packages.org.apache.tools.ant.util.FileUtils);

testCases(test, 
	function setUp() {
	},

	function checkUnknownDirective() {
		// Perhaps this should throw an exception?
		var p = "#edfine DEBUG";
		assert.that(preprocess(p).length, eq(0));
	},

	function checkDefine() {
		var p = "#define DEBUG",
			p1 = "#undef DEBUG";
		
		assert.that(preprocess(p).length, eq(0));
		assert.that(preprocess(p1).length, eq(0));
	},

	function checkIfdefDefined() {
		var p = "#define DEBUG\n#ifdef DEBUG\ntrue\n#endif";
		assert.that(preprocess(p).length, eq(1));
		assert.that(preprocess(p)[0], eq('true'));
	},

	function checkIfdefUndefined() {
		var p = "#ifdef DEBUG\ntrue\n#endif";
		assert.that(preprocess(p).length, eq(0));
	},

	function checkIfndefDefined() {
		var p = '#define DEBUG\n#ifndef DEBUG\ntrue\n#endif';
		assert.that(preprocess(p).length, eq(0));
	},

	function checkIfndefUndefined() {
		var p = '#ifndef DEBUG\ntrue\n#endif';
		assert.that(preprocess(p).length, eq(1));
		assert.that(preprocess(p)[0], eq('true'));
	},

	function checkUndef() {
		var p = '#define DEBUG\n#undef DEBUG\n#ifdef DEBUG\ntrue\n#endif';
		assert.that(preprocess(p).length, eq(0));
	},

	function checkInvalidConfig() {
		var p = '#define DEBUG\n#ifdef DEBUG\ntrue\n#endif';
		assert.that(preprocess(p, 'DEBUG').length, eq(1));
		assert.that(preprocess(p, 1).length, eq(1));
		assert.that(preprocess(p, [1, 2]).length, eq(1));
	},

	function checkConfigIfdef() {
		var p = '#ifdef DEBUG\ntrue\n#endif';
		assert.that(preprocess(p, {DEBUG: true}).length, eq(1));
		assert.that(preprocess(p, {DEBUG: true})[0], eq('true'));
	},

	function checkConfigIfndef() {
		var p = '#ifndef DEBUG\ntrue\n#endif';
		assert.that(preprocess(p, {DEBUG: true}).length, eq(0));
	},

	function checkElse() {
		var p = '#ifdef DEBUG\ntrue\n#else\nfalse\n#endif';
		assert.that(preprocess(p, {DEBUG: true}).length, eq(1));
		assert.that(preprocess(p, {DEBUG: true})[0], eq('true'));
		assert.that(preprocess(p, {DEBUG: false}).length, eq(1));
		assert.that(preprocess(p, {DEBUG: false})[0], eq('false'));
	},

	function checkNestedElse() {
		var p = '#ifdef DEBUG\n#ifdef TEST\n1\n#else\n2\n#endif\n#else\n#ifdef TEST\n3\n#else\n4\n#endif\n#endif';

		assert.that(preprocess(p, {}).length, eq(1));
		assert.that(preprocess(p, {})[0], eq('4'));

		assert.that(preprocess(p, {TEST: true}).length, eq(1));
		assert.that(preprocess(p, {TEST: true})[0], eq('3'));

		assert.that(preprocess(p, {DEBUG: true}).length, eq(1));
		assert.that(preprocess(p, {DEBUG: true})[0], eq('2'));

		assert.that(preprocess(p, {TEST: true, DEBUG: true}).length, eq(1));
		assert.that(preprocess(p, {TEST: true, DEBUG: true})[0], eq('1'));
	},

	function checkIncorrectElse() {
		var p = '#else';

        shouldThrowException(function () {
            preprocess(p);
        });
	},

	function checkUnclosedIfdef() {
		var p = '#ifdef DEBUG\ntrue',
			p1 = '#ifdef DEBUG';

		shouldThrowException(function () {
			preprocess(p);
		});

		shouldThrowException(function () {
			preprocess(p1);
		});
	},

	function checkDefineScope() {
		var p = '#ifdef DEBUG\n#define TEST\n#endif\n#ifdef TEST\ntrue\n#endif';
		assert.that(preprocess(p).length, eq(0));
	},

	function tearDown() {
	}
);
