
/*global lexer*/
/**
 * The parser expects the following data structure containing a specification of the
 * expression syntax you would like parsed.
 *
 * var options = {
 *	operators: [
 *		name: <string>,
 *		token: <string>,
 *		precedence: <number>,
 *		associativity: 'left' || 'right'
 *		type: 'unary' || 'binary'
 *  ],
 *	functions: [
 *		name: <string>,
 *		arity: <number>
 *  ],
 *	constants: [
 *		name: <string>
 *  ]
 *  variables: <boolean>
 * };
 * The following properties are optional: "associativity" (defaults to left), "type" (defaults to binary), "arity" (defaults to 1).
 * Setting "arity" to -1 means a variable number of parameters.
 * Setting "variables" to true enables expression variables with valid characters in the class: a-zA-Z._
 */
var parser = function (options) {        
    var tokens = [
		    { type: 'NUMBER', pattern: /^(\d*\.\d+)|^(\d+)/g },
		    { type: 'PARENTHESES_LEFT', pattern: /^\(/g },
		    { type: 'PARENTHESES_RIGHT', pattern: /^\)/g },
		    { type: 'COMMA', pattern: /^,/g },
		    { type: 'SPACE', pattern: /^\s+/g }         
    	],
		operators = options.operators || [],
		functions = options.functions || [],
		constants = options.constants || [],
		variables = options.variables || false,
		lex;

	operators.forEach(function (op) {
        op.type = op.type !== undefined && op.type === 'unary' ? 'UNARY_OPERATOR' : 'BINARY_OPERATOR';
		op.arity = op.type === 'UNARY_OPERATOR' ? 1 : 2;
        op.precedence = op.precedence || -1;
        op.associativity = !(op.associativity !== undefined && op.associativity === 'right');
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
        
    tokens.append(operators, functions, constants, variables ? [ { type: 'VARIABLE', pattern: /^[a-zA-Z\._]+/g } ] : []);

    tokens.forEach(function (t) {
        t.toJSON = function () {
            return {
                value: this.value,
                type: this.type,
                pos: this.pos,
                name: this.name,
                arity: this.arity
            };
        };
    });

    lex = lexer(tokens);

    return {
        parse: function (str) {
            var iterator = lex.tokenize(str),
                token = {},
                output = [], stack = [],
                were = [], count = [],
                v1, v2, c, fun;

            // TODO: see if it is nicer to treat operators (binary, unary) and functions the same
			// as they basically are all functions, just with a different arity.
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
                            throw 'Misplaced comma or missing parentheses.';
                        }
                    }
                    
                    if (were.pop()) {
                        c = count.pop();
                        c += 1;
                        count.push(c);
                    }
                    were.push(false);
				} else if (token.type === 'UNARY_OPERATOR') {
                    while (!stack.isEmpty() && stack.peek().type === 'UNARY_OPERATOR' && (
                            (token.associativity && token.precedence <= stack.peek().precedence) || 
                            (!token.associativity && token.precedence < stack.peek().precedence)
                            )) {
                        v1 = output.pop();

						output.append([v1, stack.pop()]);
                    }
                    stack.push(token);					
                } else if (token.type === 'BINARY_OPERATOR') {  
                    while (!stack.isEmpty() && stack.peek().type === 'BINARY_OPERATOR' && (
                            (token.associativity && token.precedence <= stack.peek().precedence) || 
                            (!token.associativity && token.precedence < stack.peek().precedence)
                            )) {
                        v1 = output.pop();
                        v2 = output.pop();

						output.append([v2, v1, stack.pop()]);
                    }
                    stack.push(token);
                } else if (token.type === 'PARENTHESES_LEFT') {
                    stack.push(token);
                } else if (token.type === 'PARENTHESES_RIGHT') {
                    while (!stack.isEmpty() && stack.peek().type !== 'PARENTHESES_LEFT') {
                        v1 = output.pop();
                        v2 = output.pop();
                        
						output.append([v2, v1, stack.pop()]);
                        
                        if (stack.isEmpty()) {
                            throw 'Mismatched parentheses.';
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
                                throw 'Incorrect number of arguments to function.';
                            }
                        }
                    }
                }
            }
 
            if (!stack.isEmpty()) {
                while (!stack.isEmpty()) {
                    if (stack.peek().type === 'PARENTHESES_LEFT' || stack.peek().type === 'PARENTHESES_RIGHT') {
                        throw 'Mismatched parentheses.';
                    } else if (stack.peek().type === 'BINARY_OPERATOR') {
	                    v1 = output.pop();
    	                v2 = output.pop();
                    
    	                if (v1 === undefined || v2 === undefined) {
    	                    throw 'Binary operator "' + stack.peek().token + '" requires two arguments.';
    	                }
						output.append([v2, v1, stack.pop()]);
					} else {
						v1 = output.pop();
						if (v1 === undefined) {
							throw 'Unary operator "' + stack.peek().token + '" requires at least one argument.';
						}
						output.append([v1, stack.pop()]);
					}
                }
            }
            return output;
        }
    };
};
