
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
            parameters: 2
        },
        {
            name: 'sqrt'
        },
        {
            name: 'exp'
        },
        {
            name: 'log'
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
            pattern: /^\(/g
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
        op.type = 'OPERATOR';
        op.precedence = op.precedence || 10;
        op.associative = op.associative !== undefined ? op.associative : true;
        op.pattern = new RegExp('^' + op.token.replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&'), 'g');
    });
        
    functions.forEach(function (f) {
        f.type = 'FUNCTION';
        f.pattern = new RegExp('^' + f.name, 'ig');
        f.parameters = f.parameters || 1;
    });
    
    constants.forEach(function (c) {
        c.type = 'CONSTANT';
        c.pattern = new RegExp('^' + c.name, 'ig');
    });
        
    tokens.append(operators, functions);
    
    var lex = lexer(tokens);

    return {
        parse: function (str) {
            var iterator = lex.tokenize(str),
                token = {},
                output = [],
                stack = [];
            
            while(token = iterator.next()) {
                if (token.type === 'NUMBER') {
                    output.push(token);
                }
                else if (token.type === 'CONSTANT') {
                    output.push(token);
                }
                else if (token.type === 'FUNCTION') {
                    stack.push(token);
                }
                else if (token.type === 'COMMA') {
                    while (stack.peek().type !== 'PARENTHESES_LEFT') {
                        output.push(stack.pop());
                    
                        if (!stack.isEmpty()) {
                            throw new Error('Misplaced comma or missing parentheses.');
                        }
                    }
                }
                else if (token.type === 'OPERATOR') {
                    while (!stack.isEmpty() && stack.peek().type === 'OPERATOR' && (
                            (token.associative && token.precedence <= stack.peek().precedence) || 
                            (!token.associative && token.precedence < stack.peek().precedence)
                            )) {
                        output.push(stack.pop());
                    }
                    stack.push(token);
                }
                else if (token.type === 'PARENTHESES_LEFT') {
                    stack.push(token);
                }
                else if (token.type === 'PARENTHESES_RIGHT') {
                    while (stack.peek().type !== 'PARENTHESES_LEFT') {
                        output.push(stack.pop());
                        
                        if (stack.isEmpty()) {
                            throw new Error('Mismatched parentheses.');
                        }
                    }
                    stack.pop();
                    if (stack.peek().type === 'FUNCTION') {
                        output.push(stack.pop());
                    }
                }
            }
            
            if (!stack.isEmpty()) {
                while (!stack.isEmpty()) {
                    if (stack.peek().type === 'PARENTHESES_LEFT' || stack.peek().type === 'PARENTHESES_RIGHT') {
                        throw new Error('Mismatched parentheses.');
                    }
                    output.push(stack.pop());
                }
            }
            return output;
        }
    };
}();