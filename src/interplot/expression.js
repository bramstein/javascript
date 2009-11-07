/*global parser, Interval, TInterval*/
var expression = (function () {
    var expressionLanguage = {
            operators: [
                { name: 'add', token: '+', precedence: 1 },
                { name: 'sub', token: '-', precedence: 1 },
                { name: 'div', token: '/', precedence: 2 },
                { name: 'mul', token: '*', precedence: 2 },
                { name: 'pow', token: '^', precedence: 3, associativity: 'right' },
                { name: 'neg', token: '~', precedence: 3, associativity: 'right', type: 'unary' }
            ],
            constants: [
                { name: 'pi' },
                { name: 'x' },
                { name: 'y' }
            ],
            functions: [
                { name: 'sin' },
                { name: 'cos' },
                { name: 'abs' },
                { name: 'fmod', arity: 2 },
                { name: 'sqrt' },
                { name: 'exp' },
                { name: 'log' }
            ]
        },
        p = parser(expressionLanguage),
        evaluateRPN = function (rpn, constants) {
            var output = [],
                calculate = function (token) {
                    var operands = [];

                    if (token.type === 'NUMBER') {
                        output.push(new TInterval(token.value - 0, token.value - 0));
                    } else if (token.type === 'CONSTANT') {
                        if (token.name === 'pi') {
                            output.push(TInterval.PI);
                        } else if (constants[token.name] !== undefined) {
							var t = constants[token.name];
                            output.push(new TInterval(t.from, t.to));
                        }
                    } else if (token.type === 'BINARY_OPERATOR' || token.type === 'UNARY_OPERATOR' || token.type === 'FUNCTION') {
                        if (output.length < token.arity) {
                            throw 'Operator ' + token.name + ' requires at least ' + token.arity + ' arguments.';
                        }

                        operands = output.slice(output.length - token.arity);
                        output = output.slice(0, output.length - token.arity);

                        if (token.name === 'add') {
							output.push(operands[0].add(operands[1]));
                        } else if (token.name === 'sub') {
							output.push(operands[0].subtract(operands[1]));
                        } else if (token.name === 'div') {
                            output.push(operands[0].divide(operands[1]));
                        } else if (token.name === 'mul') {
                            output.push(operands[0].multiply(operands[1]));
                        } else if (token.name === 'pow') {
                            output.push(TInterval.pow(operands[0], operands[1]));
                        } else if (token.name === 'neg') {
                            output.push(operands[0].negate());
                        } else if (token.name === 'sin') {
                            output.push(TInterval.sin(operands[0]));
                        } else if (token.name === 'cos') {
                            output.push(TInterval.cos(operands[0]));
                        } else if (token.name === 'abs') {
                            output.push(TInterval.abs(operands[0]));
                        } else if (token.name === 'fmod') {
                            output.push(TInterval.fmod(operands[0], operands[1]));
                        } else if (token.name === 'sqrt') {
                            output.push(TInterval.sqrt(operands[0]));
                        } else if (token.name === 'exp') {
                            output.push(TInterval.exp(operands[0]));
                        } else if (token.name === 'log') {
                            output.push(TInterval.log(operands[0]));
                        }
                    }
                };
                
            rpn.forEach(calculate);
            
            if (output.length === 1) {
                return output[0];
            } else {
                throw 'Too many values.';
            }
        };

    return {
        parse: p.parse,
        evaluate: evaluateRPN
    };
}());
