eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/parser/lexer.js"));

var l;

testCases(test, 
	function setUp() {
        l = lexer();
	},

    function checkEmptyString() {
        var i = l.tokenize('');
        assert.that(i.next(), isFalse());
    },

    function checkNumber() {
        var i = l.tokenize('3 * 5'),
            r = {};
        while (r = i.next()) {
            project.log(r.token + " " + r.value + ", at " + r.pos);
        }
    },

    function tearDown() {
        l = null;
    }
);