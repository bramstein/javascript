/**

Simple JavaScript preprocessor to enable conditional compilation. The syntax of the preprocessor is a subset of the C preprocessor. This means that all JavaScript preprocessor directives are valid C preprocessor directives (and can thus be used with the C preprocessor), but not the other way around. 

Future versions *might* include:
* includes
* constant expressions
* macro expansion
* see: http://msdn.microsoft.com/en-us/library/2scxys89%28VS.80%29.aspx

#define <identifier>
#undef <identifier>

conditional:
   if-start
   else?
   if-end

if-start:
   #ifdef <identifier>
   #ifndef <identifier>

else:
   #else

if-end:
  #endif


<string>: any valid JavaScript string
<identifier>: [A-Za-z0-9_]
*/
var lexer = function (lines) {
	var tokens = /^\s*#(ifdef|ifndef|endif|else|define|undef)\s*(\w*)$/,
		index = 0, m;

	function token(t, v, p) {
		return {
			id: t,
			value: v,
			position: p,
			toString: function () {
				return this.id + ' = "' + this.value + '", at: ' + this.position + '\n';
			}
		};
	}

	return {
		next: function () {
			if (index < lines.length) {
				m = tokens.exec(lines[index]);
				index += 1;
				if (m) {
					return token(m[1], m[2], index);
				} else {
					return token('line', lines[index - 1], index);
				}
			}
			
			return false;
		}
	};
};

var parser = (function (lex) {
    var originalSymbol = {
            nud: function () {
                this.error("Undefined.");
            },
            led: function (left) {
                this.error("Missing operator.");
            }
        },
        originalScope = {
            define: function (n) {
                // we don't care about redefinitions
                this.def[n.value] = n;
                n.nud = itself;
                n.led = null;
                n.std = null;
                n.lbp = 0;
                n.scope = scope;
                return n;
            },
            find: function (n) {
                var e = this;
                while (true) {
                    var o = e.def[n];
                    if (o) {
                        return o;
                    }
                    e = e.parent;
                    if (!e) {
                        return false;
                    }
                }
            },
            pop: function () {
                scope = this.parent;
            },
            remove: function (n) {
                var e = this;
                while (true) {
                    var o = e.def[n];
                    if (o) {
                        delete e.def[n];
                        return true;
                    }
                    e = e.parent;
                    if (!e) {
                        return false;
                    }
                }
            }
        },
        symbolTable = {},
        token,
        scope;
    
    var itself = function () {
        return this;
    }
    
    return { 
        symbol: function (id, bp) {
            var s = symbolTable[id];
            bp = bp || 0;
            
            if (s) {
                if (bp >= s.lbp) {
                    s.lbp = bp;
                }
            } else {
                s = Object.clone(originalSymbol);
                s.id = s.value = id;
                s.lbp = bp;
                symbolTable[id] = s;
            }
            return s;
        },
        advance: function (id) {
            if (id && token.id !== id) {
                token.error('Expected "' + id + '".');
            }
            token = lex.next();
            
            return token;
        },
        newScope: function () {
            var s = scope;
            scope = Object.clone(originalScope);
            scope.def = {};
            scope.parent = s;
            return scope;
        },
        currentToken = token
    };
}());

var preprocessor = function (source, definitions) {
    var lines = [],
        token;
    
    if (typeof source === 'string') {
        lines = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    } else {
        lines = source;
    }

	var l = lexer(lines);

    var p = parser(l);

    function block() {
    }


    function statement() {
        var n = token, v;
        if (n.std) {
            p.advance();
            return n.std();
        }
        return false;
    }
    
    function statements() {
        var a = [], s;
        while (true) {
            if (!token) {
                break;
            }
            s = statement();
            if (s) {
                a.push(s);
            }
        }
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    }
    
    function stmt(s, f) {
        var x = this.symbol(s);
        x.std = f;
        return x;
    }

/*
	while ((token = l.next())) {
		project.log(token);
	}
    */
/* 
	[
		line1,
		line2,
		line3,
		[
			{ type: CONDITIONAL, value: 'FAST'},
			[line5, line6, line8],
			[line9, line10]
		],
		line5
	];


	ifndef || ifdef => start new block
	line => add to current block
	end => end block
	else => start new block

//  (#define)
//  (#ifdef ... #endif)
//  (#ifdef ... #else ... #endif)
//  (#ifdef ... (#ifdef ... #endif) ... #endif)
//  (#ifdef ... (#ifdef ... #else ... #endif) ... #else ... #endif)

// (#ifdef ... #endif (#ifdef ... #else ... #endif)

//  #if condition statement => binary operator
//  #if condition statement, else statement => ternary operator (with higher precedence)
//  #ifdef = (conditional
//  #ifndef = (conditional
//  #else = binary operator (block, block)
//  #endif = )
//  #undef, #define = unary
// [line1, (#define), line2, line3, [condition, [line4, line5, line6, line7], [line8, line9, line10]], line11]
*/
/*
    for (; i < lines.length; i += 1) {
        m = tokens.exec(lines[i]);

		if (!m) {
			block.peek().push(lines[i]);
		} else {   
			if (m[1] === 'else') {
				while (!stack.isEmpty() && stack.peek().type === 'CONDITIONAL') {
					//v1 = output.pop();
					//v2 = output.pop();
                        
					output.push([stack.pop(), block.pop()]);					
				}
				stack.push(token('CONDITIONAL'));
			} else if (m[1] === 'ifdef' || m[1] === 'ifndef') {
				stack.push(token('START', m[2]));
				block.push([]);
			} else if (m[1] === 'endif') {
				while (!stack.isEmpty() && stack.peek().type !== 'START') {
			//		v1 = output.pop();
			//		v2 = output.pop();

					output.push([stack.pop(), block.pop()]);

					if (stack.isEmpty()) {
						throw new Error('Mismatched #endif.');
					}
					stack.pop();
				}
			}  
        }
    }
*/
//	project.log(block);
//	project.log(stack);
 //   project.log(output);
    
        
};
