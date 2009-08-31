eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/parser/lexer.js"));
eval(loadFile("src/parser/parser.js"));

function evaluate(tree) {
	var output = [],
		calculate = function (token) {
			var operands = [];

			if (token.type === 'NUMBER') {
				output.push(token.value - 0);
			} else if (token.type === 'CONSTANT') {
				if (token.name === 'pi') {
					output.push(Math.PI);
				} else if (token.name === 'e') {
					output.push(Math.E);
				}
			} else if (token.type === 'BINARY_OPERATOR' || token.type === 'UNARY_OPERATOR' || token.type === 'FUNCTION') {
				if (output.length < token.arity) {
					throw 'Operator ' + token.name + ' requires at least ' + token.arity + ' arguments.';
				}

				operands = output.slice(output.length - token.arity);
				output = output.slice(0, output.length - token.arity);

				if (token.name === 'add') {
					output.push(operands[0] + operands[1]);
				} else if (token.name === 'sub') {
					output.push(operands[0] - operands[1]);
				} else if (token.name === 'div') {
					output.push(operands[0] / operands[1]);
				} else if (token.name === 'mul') {
					output.push(operands[0] * operands[1]);
				} else if (token.name === 'mod') {
					output.push(operands[0] % operands[1]);
				} else if (token.name === 'pow') {
					output.push(Math.pow(operands[0], operands[1]));
				} else if (token.name === 'neg') {
					output.push(-operands[0]);
				} else if (token.name === 'sin') {
					output.push(Math.sin(operands[0]));
				} else if (token.name === 'cos') {
					output.push(Math.cos(operands[0]));
				} else if (token.name === 'abs') {
					output.push(Math.abs(operands[0]));
				} else if (token.name === 'fmod') {
				//	output.push(Math.fmod(operands[0]));
				} else if (token.name === 'sqrt') {
					output.push(Math.sqrt(operands[0]));
				} else if (token.name === 'exp') {
					output.push(Math.exp(operands[0]));
				} else if (token.name === 'log') {
					output.push(Math.log(operands[0]));
				} else if (token.name === 'min') {
					output.push(Math.min.apply(null, operands));
				} else if (token.name === 'max') {
					output.push(Math.max.apply(null, operands));
				}
			}
		};
	tree.forEach(calculate);

	if (output.length === 1) {
		return output[0];
	} else {
		throw 'Too many values.';
	}
}

function toString(tree) {
	return tree.join(' ');
}

var p = null;

testCases(test, 
	function setUp() {
		var options = {
			operators: [
				{ name: 'add', token: '+', precedence: 1 },
				{ name: 'sub', token: '-', precedence: 1 },
				{ name: 'div', token: '/', precedence: 2 },
				{ name: 'mul', token: '*', precedence: 2 },
				{ name: 'mod', token: '%', precedence: 2 },
				{ name: 'pow', token: '^', precedence: 3, associativity: 'right' },
				{ name: 'neg', token: '~', precedence: 3, associativity: 'right', type: 'unary' }
			],
			constants: [
		    	{ name: 'pi' },
				{ name: 'e' }
			],
			functions: [
				{ name: 'sin' },
				{ name: 'cos' },
				{ name: 'abs' },
				{ name: 'fmod', arity: 2 },
				{ name: 'sqrt' },
				{ name: 'exp' },
				{ name: 'log' },
				{ name: 'min', arity: -1 },
				{ name: 'max', arity: -1 }
			],
			variables: true
		};

		p = parser(options);
	},
    
    function nop() {
        assert.that(toString(p.parse('')), eq(''));
    },
    
    function simple() {
		var rpn = p.parse('45');

        assert.that(toString(rpn), eq('45'));
		assert.that(evaluate(rpn), eq(45));
    },
    
    function operatorError() {
        shouldThrowException(function () {
            parser.parse('+');
        });
    },
    
    function addition() {
		var rpn = p.parse('3 + 8');

        assert.that(toString(rpn), eq('3 8 +'));
		assert.that(evaluate(rpn), eq(11));
    },
    
    function subtraction() {
		var rpn = p.parse('2 + 9 - 6');

        assert.that(toString(rpn), eq('2 9 + 6 -'));
		assert.that(evaluate(rpn), eq(5));
    },
    
    function multiplication() {
		var rpn = p.parse('2 + 9 * 6');

        assert.that(toString(rpn), eq('2 9 6 * +'));
		assert.that(evaluate(rpn), eq(56));
    },
    
    function pow() {
		var rpn1 = p.parse('2 * 10 ^ 6'),
			rpn2 = p.parse('2 ^ 3 ^ 4');
	
        assert.that(toString(rpn1), eq('2 10 6 ^ *'));
		assert.that(evaluate(rpn1), eq(2000000));

        assert.that(toString(rpn2), eq('2 3 4 ^ ^'));
		assert.that(evaluate(rpn2), eq(2417851639229258349412352));
    },
    
    function variable() {
        assert.that(toString(p.parse('a ^ 3')), eq('a 3 ^'));
    },
    
    function incorrectNumbers() {
        shouldThrowException(function () {
	        evaluate(p.parse('10 12 1'));
		});
    },
    
    function incorrectVariable() {
		shouldThrowException(function () {
	   		evaluate(p.parse('a b c'));
		});
    },
    
    function constant() {
		var rpn = p.parse('pi * 2');
	
        assert.that(toString(rpn), eq('pi 2 *'));
		assert.that(evaluate(rpn), eq(6.283185307179586));
    },
    
    function parentheses() {
		var rpn = p.parse('(3 + 4)');

        assert.that(toString(rpn), eq('3 4 +'));
		assert.that(evaluate(rpn), eq(7));
    },
    
    function parenthesisPrecedence() {
		var rpn = p.parse('(3 + 4) * 5');

        assert.that(toString(rpn), eq('3 4 + 5 *'));
		assert.that(evaluate(rpn), eq(35));
    },
    
    function parenthesesComplex() {
		var rpn = p.parse('(3+(4-5))*6');

        assert.that(toString(rpn), eq('3 4 5 - + 6 *'));
		assert.that(evaluate(rpn), eq(12));
    },
    
    function func() {
        assert.that(toString(p.parse('sin(3)')), eq('3 sin'));
    },
    
    function nestedFunc() {
        assert.that(toString(p.parse('sin(cos(4))')), eq('4 cos sin'));
    },
    
    function multipleFuncParameters() {
        assert.that(toString(p.parse('fmod(3, 4)')), eq('3 4 fmod'));
    },
    
    function wikipedia() {
		var rpn = p.parse('3 + 4 * 2 / (1 - 5) ^ 2 ^ 3');
        assert.that(toString(rpn), eq('3 4 2 * 1 5 - 2 3 ^ ^ / +'));
		assert.that(evaluate(rpn), eq(3.0001220703125));
    },
    
    function complexFunc() {
        assert.that(toString(p.parse('fmod(1+a^2,(8+b)*10)')), eq('1 a 2 ^ + 8 b + 10 * fmod'));
    },
    
    function variableFuncParameters() {
		var rpn = p.parse('min(1, 3, 4, 2)');

        assert.that(toString(rpn), eq('1 3 4 2 min'));
		assert.that(evaluate(rpn), eq(1));
    },
    
    function incorrectEnd() {    
        shouldThrowException(function () {
            evaluate(p.parse('4 * (5 + ) / '));
        });
    },

	function funcWithoutParentheses() {
		assert.that(toString(p.parse('sin 3 * 2')), eq('3 2 * sin'));
	},

	function unaryOp() {
		var rpn = p.parse('~1');
		assert.that(toString(rpn), eq('1 ~'));
		assert.that(evaluate(rpn), eq(-1));
	},

	function unaryOpPrecedence() {
		var rpn = p.parse('~2 ^ 2');
	
		assert.that(toString(rpn), eq('2 2 ^ ~'));
		assert.that(evaluate(rpn), eq(-4));
	},    

    function tearDown() {
		p = null;
    }
);    
