
/*global lexer*/
var parser = function () {
    var constants = [
        {
            name: 'pi'
        }
    ];

    var functions = [
        {
            name: 'sin'
        },
        {
            name: 'cos'
        },
        {
            name: 'abs'
        },
        {
            name: 'fmod',
            arity: 2
        },
        {
            name: 'sqrt'
        },
        {
            name: 'exp'
        },
        {
            name: 'log'
        },
        {
            name: 'min',
            arity: -1
        },
        {
            name: 'max',
            arity: -1
        }
    ];

    var operators = [
        {
            name: 'add',
            token: '+',
            precedence: 1
        },
        {
            name: 'sub',
            token: '-',
            precedence: 1
        },
        {
            name: 'div',
            token: '/',
            precedence: 2
        },
        {
            name: 'mul',
            token: '*',
            precedence: 2
        },
        {
            name: 'pow',
            token: '^',
            precedence: 3,
            associative: false
        },
        {
            name: 'mod',
            token: '%',
            precedence: 2
        }
    ];
        
    var tokens = [
        { 
            type: 'NUMBER',
            pattern: /^(\d*\.\d+)|^(\d+)/g
        },
        {
            type: 'PARENTHESES_LEFT',
            pattern: /^\(/g,
            precedence: -1
        },
        {
            type: 'PARENTHESES_RIGHT',
            pattern: /^\)/g
        },
        {
            type: 'COMMA',
            pattern: /^,/g
        },
        {
            type: 'SPACE',
            pattern: /^\s+/g 
        }         
    ];

    operators.forEach(function (op) {
        op.type = 'BINARY_OPERATOR';
        op.precedence = op.precedence || 10;
        op.associative = op.associative !== undefined ? op.associative : true;
        op.pattern = new RegExp('^' + op.token.replace(/[.*+?\^${}()|\[\]\/\\]/g, '\\$&'), 'g');
    });
        
    functions.forEach(function (f) {
        f.type = 'FUNCTION';
        f.pattern = new RegExp('^' + f.name, 'ig');
        f.arity = f.arity || 1;
    });
    
    constants.forEach(function (c) {
        c.type = 'CONSTANT';
        c.pattern = new RegExp('^' + c.name, 'ig');
    });
        
    tokens.append(operators, functions, constants, [ { type: 'VARIABLE', pattern: /^[a-zA-Z\.]+/g } ]);

    var lex = lexer(tokens);

    return {
        parse: function (str) {
            var iterator = lex.tokenize(str),
                token = {},
                output = [],
                stack = [],
                were = [],
                count = [],
                v1, v2, c, fun;
            
            while ((token = iterator.next())) {
            
                if (token.type === 'NUMBER' || token.type === 'CONSTANT' || token.type === 'VARIABLE') {
                    output.push(token);
                    if (!were.isEmpty()) {
                        were.pop();
                        were.push(true);
                    }
                } else if (token.type === 'FUNCTION') {
                    stack.push(token);
                    count.push(0);
                    if (!were.isEmpty()) {
                        were.pop();
                        were.push(true);
                    }
                    were.push(false);
                } else if (token.type === 'COMMA') {
                    
                    while (!stack.isEmpty() && stack.peek().type !== 'PARENTHESES_LEFT') {
                        output.push(stack.pop());
                    
                        if (stack.isEmpty()) {
                            throw new Error('Misplaced comma or missing parentheses.');
                        }
                    }
                    
                    if (were.pop()) {
                        c = count.pop();
                        c += 1;
                        count.push(c);
                    }
                    were.push(false);
                } else if (token.type === 'BINARY_OPERATOR') {  
                    while (!stack.isEmpty() && stack.peek().type === 'BINARY_OPERATOR' && (
                            (token.associative && token.precedence <= stack.peek().precedence) || 
                            (!token.associative && token.precedence < stack.peek().precedence)
                            )) {
                        v1 = output.pop();
                        v2 = output.pop();
                        
                        output.push([v2, v1, stack.pop()]);
                    }
                    stack.push(token);
                } else if (token.type === 'PARENTHESES_LEFT') {
                    stack.push(token);
                } else if (token.type === 'PARENTHESES_RIGHT') {
                    while (!stack.isEmpty() && stack.peek().type !== 'PARENTHESES_LEFT') {
                        v1 = output.pop();
                        v2 = output.pop();
                    
                        output.push([v2, v1, stack.pop()]);
                        
                        if (stack.isEmpty()) {
                            throw new Error('Mismatched parentheses.');
                        }
                    }
                    stack.pop();
                    if (!stack.isEmpty() && stack.peek().type === 'FUNCTION') {
                        fun = stack.pop();
                        c = count.pop();
                        
                        if (were.pop()) {
                            c += 1;
                            if (fun.arity === c || fun.arity === -1) {
                                fun.arity = c;
                                output.push(fun);
                            } else {
                                throw new Error('Incorrect number of arguments to function.');
                            }
                        }
                    }
                }
            }
 
            if (!stack.isEmpty()) {
                while (!stack.isEmpty()) {
                    if (stack.peek().type === 'PARENTHESES_LEFT' || stack.peek().type === 'PARENTHESES_RIGHT') {
                        throw new Error('Mismatched parentheses.');
                    }
                    v1 = output.pop();
                    v2 = output.pop();
                    
                    if (v1 === undefined || v2 === undefined) {
                        throw new Error('Binary operator "' + stack.peek().token + '" requires two arguments.');
                    }
                    
                    output.push([v2, v1, stack.pop()]);
                }
            }
            return output;
        }
    };
}();
