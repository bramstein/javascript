/*global parser, Interval*/
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
                        output.push({from: token.value - 0, to: token.value - 0});
                    } else if (token.type === 'CONSTANT') {
                        if (token.name === 'pi') {
                            output.push(Interval.PI);
                        } else if (constants[token.name] !== undefined) {
                            output.push(constants[token.name]);
                        }
                    } else if (token.type === 'BINARY_OPERATOR' || token.type === 'UNARY_OPERATOR' || token.type === 'FUNCTION') {
                        if (output.length < token.arity) {
                            throw 'Operator ' + token.name + ' requires at least ' + token.arity + ' arguments.';
                        }

                        operands = output.slice(output.length - token.arity);
                        output = output.slice(0, output.length - token.arity);

                        if (token.name === 'add') {
                            output.push(Interval.add(operands[0], operands[1]));
                        } else if (token.name === 'sub') {
                            output.push(Interval.sub(operands[0], operands[1]));
                        } else if (token.name === 'div') {
                            output.push(Interval.div(operands[0], operands[1]));
                        } else if (token.name === 'mul') {
                            output.push(Interval.mul(operands[0], operands[1]));
                        } else if (token.name === 'pow') {
                            output.push(Interval.pow(operands[0], operands[1]));
                        } else if (token.name === 'neg') {
                            output.push(Interval.neg(operands[0]));
                        } else if (token.name === 'sin') {
                            output.push(Interval.sin(operands[0]));
                        } else if (token.name === 'cos') {
                            output.push(Interval.cos(operands[0]));
                        } else if (token.name === 'abs') {
                            output.push(Interval.abs(operands[0]));
                        } else if (token.name === 'fmod') {
                            output.push(Interval.fmod(operands[0], operands[1]));
                        } else if (token.name === 'sqrt') {
                            output.push(Interval.sqrt(operands[0]));
                        } else if (token.name === 'exp') {
                            output.push(Interval.exp(operands[0]));
                        } else if (token.name === 'log') {
                            output.push(Interval.log(operands[0]));
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
