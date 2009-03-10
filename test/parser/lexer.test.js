eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/parser/lexer.js"));

var l;

testCases(test, 
	function setUp() {
        l = lexer([
            { type: 'NUMBER', pattern: /^(\d*\.\d+)|^(\d+)/g },
            { type: 'OPERATOR', pattern: /^(\+|\*|-|\/)/g },
            { type: 'PAREN_OPEN', pattern: /^\(/g },
            { type: 'PAREN_CLOSE', pattern: /^\)/g },
            { type: 'IDENTIFIER', pattern: /^[a-zA-Z_]+/ },
            { type : 'SPACE', pattern: /^\s+/g }        
        ]);
	},

    function checkEmptyString() {
        var i = l.tokenize('');
        assert.that(i.next(), isFalse());
    },

    function checkNumber() {
        var i = l.tokenize('55');
            
        assert.that(i.next().type, eq('NUMBER'));
        
        i = l.tokenize('12.1');
        
        assert.that(i.next().type, eq('NUMBER'));
        
        i = l.tokenize('.0');
        
        assert.that(i.next().type, eq('NUMBER'));
        
        i = l.tokenize('0111');
        
        assert.that(i.next().type, eq('NUMBER'));
    },

    function checkParentheses() {
        var i = l.tokenize('()'),
            r = {};
        
        assert.that(i.next().type, eq('PAREN_OPEN'));
        assert.that(i.next().type, eq('PAREN_CLOSE'));
    },

    function checkOperators() {
        var i = l.tokenize('+/*-');
        
        assert.that(i.next().type, eq('OPERATOR'));
        assert.that(i.next().type, eq('OPERATOR'));
        assert.that(i.next().type, eq('OPERATOR'));
        assert.that(i.next().type, eq('OPERATOR'));
    },

    function checkIdentifier() {
        var i = l.tokenize('Sin_'),
            r  = {};
        r = i.next();
        
        assert.that(r.type, eq('IDENTIFIER'));
        assert.that(r.value, eq('Sin_'));
    },
    
    function checkUnknown() {
        var f = function() {
            var i = l.tokenize('1#');
            i.next();
            i.next();
        };
        shouldThrowException(function () {
            f();
        });
    },

    function tearDown() {
        l = null;
    }
);