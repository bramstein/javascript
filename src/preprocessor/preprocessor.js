/**

Simple JavaScript preprocessor to enable conditional compilation. The syntax of the preprocessor is a subset of the C preprocessor. This means that all JavaScript preprocessor directives are valid C preprocessor directives (and can thus be used with the C preprocessor), but not the other way around. 

Future versions *might* include:
* includes
* constant expressions
* macro expansion
* see: http://msdn.microsoft.com/en-us/library/2scxys89%28VS.80%29.aspx

EBNF
===============================================
statements       ::= statement statements

statement        ::= if-statement |
                     define-statement |
                     undef-statement |
                     line
                 
if-statement     ::= ('#ifdef' | '#ifndef') <identifier> statements ['#else' statements] '#endif'

define-statement ::= '#define' <identifier>
undef-statement  ::= '#undef' <identifier>

<identifier>     ::= [A-Za-z0-9_]              
*/
var lexer = function (lines) {
	var tokens = /^\s*#(ifdef|ifndef|endif|else|define|undef)\s*(\w*)$/,
		index = 0, m;

	function token(t, v, p) {
        project.log(t);
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
        hasNext: function () {
            return index < lines.length;
        },
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

var preprocessor = function (source, definitions) {
    var lines = [],
        token,
        l;
    
    if (typeof source === 'string') {
        lines = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    } else {
        lines = source;
    }

	l = lexer(lines);

    function block() {
        while (statement()) {
        }
        return true;
    }

    function statement() {
        token = l.next();
        if (token) {
            if (token.id === 'ifdef' || token.id === 'ifndef') {
                return ifStatement();
            } else if (token.id === 'define' || token.id === 'undef') {
                return defineStatement();
            } else if (token.id === 'line') {
                return lineStatement();
            }
        }
        return false;
    }
    
    function ifStatement() {
        var invert = token.id === 'ifndef';

        block();
            
        if (token.id === 'else') {
            block();
        }
            
        if (token.id === 'endif') {
            return true;
        }
        project.log(token);
        throw 'Missing #endif';
    }

    function defineStatement() {
        var define = token.id === 'define',
            identifier = token.value;
        
        return true;
    }
    
    function lineStatement() {
        return true;
    }

    block();
    
    if (l.hasNext()) {
        throw 'Unexpected statement: "' + token.id + '" at line: ' + token.position;
    }
};