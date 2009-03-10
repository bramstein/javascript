
var parser = function () {

    var operators = [
        {
            name: 'ADD',
            token: '\\+',
            precedence: 10
        },
        {
            name: 'SUB',
            token: '-',
            precedence: 10
        },
        {
            name: 'DIV',
            token: '\\/',
            precedence: 9
        },
        {
            name: 'MUL',
            token: '\\*',
            precedence: 9
        },
        {
            name: 'POW',
            token: '\\^',
            precedence: 8,
            associative: false
        },
        {
            name: 'MOD',
            token: '%',
            precedence: 9
        }
    ];

    var functions = [
    ];

    var tokens = [
        { 
            type: 'NUMBER',
            pattern: /^(\d*\.\d+)|^(\d+)/g,
        },    
        {
            type: 'OPERATOR',
            pattern: new RegExp(('^(' + operators.map(function (o) { return o.token; }).join('|') + ')'), 'g')
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
            type: 'SPACE',
            pattern: /^\s+/g 
        }
    ];
    
    var lex = lexer(tokens);

    function precedence(op) {
        if (op.value === '+' || op.value === '-') {
            return 0;
        }
        else if (op.value === '*' || op.value === '/' || op.value === '%') {
            return 1;
        }
        else {
            return 2;
        }
    }

    function associative(op) {
        return op.value !== '^';
    }

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
            //    else if (token.type === 'FUNCTION') {
            //        stack.push(token);
            //    }
           //     else if (token.type === 'COMMA') {
           //     }
                else if (token.type === 'OPERATOR') {
                    while (!stack.isEmpty() && stack.peek().type === 'OPERATOR' && (
                            (associative(token) && precedence(token) <= precedence(stack.peek())) || 
                            (!associative(token) && precedence(token) < precedence(stack.peek()))
                            )) {
                        output.push(stack.pop());
                    }
                    stack.push(token);
                }
                else if (token.type === 'PAREN_LEFT') {
                    stack.push(token);
                }
                else if (token.type === 'PAREN_RIGHT') {
                    while (stack.peek().type !== 'PAREN_LEFT') {
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
                    if (stack.peek().type === 'PAREN_LEFT' || stack.peek().type === 'PAREN_RIGHT') {
                        throw new Error('Mismatched parentheses.');
                    }
                    output.push(stack.pop());
                }
            }
            return output;
        }
    };
}();