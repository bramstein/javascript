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
			type: t,
			value: v,
			position: p,
			toString: function () {
				return this.type + ' = "' + this.value + '", at: ' + this.position + '\n';
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

var preprocessor = function (source, definitions) {
    var lines = [],
        tokens = /^\s*#(ifdef|ifndef|endif|else|define|undef)\s*(\w*)$/,
        i = 0,
        m,
        def = definitions || {},
        skip = false,
        output = [],
		stack = [], v1, v2, block = [[]], token;
    if (typeof source === 'string') {
        lines = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    } else {
        lines = source;
    }

	var l = lexer(lines);

	while ((token = l.next())) {
		project.log(token);
	}
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
