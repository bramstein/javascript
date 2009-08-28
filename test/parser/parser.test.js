eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/parser/lexer.js"));
eval(loadFile("src/parser/parser.js"));

function toString(tree) {
    var result = '';
    function p(node) {
        if (Object.isArray(node)) {
            for (var i = 0; i < node.length; i += 1) {
                p(node[i]);
            }
        } else if (Object.isObject(node)) {
            result += node.toString() + ' ';
        }
    }
    
    p(tree);
    
    return result.substring(0, result.length - 1);
}

testCases(test, 
	function setUp() {
	},
    
    function nop() {
        assert.that(toString(parser.parse('')), eq(''));
    },
    
    function simple() {
        assert.that(toString(parser.parse('45')), eq('45'));
    },
    
    function operatorError() {
        shouldThrowException(function () {
            parser.parse('+');
        });
    },
    
    function addition() {
        assert.that(toString(parser.parse('3 + 8')), eq('3 8 +'));
    },
    
    function subtraction() {
        assert.that(toString(parser.parse('2 + 9 - 6')), eq('2 9 + 6 -'));
    },
    
    function multiplication() {
        assert.that(toString(parser.parse('2 + 9 * 6')), eq('2 9 6 * +'));
    },
    
    function pow() {
        assert.that(toString(parser.parse('2 * 10 ^ 6')), eq('2 10 6 ^ *'));
        assert.that(toString(parser.parse('2 ^ 3 ^ 4')), eq('2 3 4 ^ ^'));
    },
    
    function variable() {
        assert.that(toString(parser.parse('a ^ 3')), eq('a 3 ^'));
    },
    
    function incorrectNumbers() {
        // TODO: decide what to do with this and the case below. Perhaps
        // implicit multiplication.
        assert.that(toString(parser.parse('10 12 1')), eq('10 12 1'));
    },
    
    function incorrectVariable() {
        assert.that(toString(parser.parse('a b c')), eq('a b c'));
    },
    
    function constant() {
        assert.that(toString(parser.parse('pi * 2')), eq('pi 2 *')); 
    },
    
    function parentheses() {
        assert.that(toString(parser.parse('(3 + 4)')), eq('3 4 +'));
    },
    
    function parenthesisPrecedence() {
        assert.that(toString(parser.parse('(3 + 4) * 5')), eq('3 4 + 5 *'));
    },
    
    function parenthesesComplex() {
        assert.that(toString(parser.parse('(3+(4-5))*6')), eq('3 4 5 - + 6 *'));
    },
    
    function func() {
        assert.that(toString(parser.parse('sin(3)')), eq('3 sin'));
    },
    
    function nestedFunc() {
        assert.that(toString(parser.parse('sin(cos(4))')), eq('4 cos sin'));
    },
    
    function multipleFuncParameters() {
        assert.that(toString(parser.parse('fmod(3, 4)')), eq('3 4 fmod'));
    },
    
    function wikipedia() {
        assert.that(toString(parser.parse('3 + 4 * 2 / (1 - 5) ^ 2 ^ 3')), eq('3 4 2 * 1 5 - 2 3 ^ ^ / +'));
    },
    
    function complexFunc() {
        assert.that(toString(parser.parse('fmod(1+a^2,(8+b)*10)')), eq('1 a 2 ^ + 8 b + 10 * fmod'));
    },
    
    function variableFuncParameters() {
        assert.that(toString(parser.parse('min(1, 3, 4, 2)')), eq('1 3 4 2 min'));
    },
    
    function incorrectEnd() {    
        shouldThrowException(function () {
            parser.parse('4 * (5 + ) / ');
        });
    },
    
    function tearDown() {
    }
);    
