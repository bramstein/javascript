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
var preprocessor = function (source, definitions) {
    var lines = [],
        tokens = /^\s*#(ifdef|ifndef|endif|else|define|undef)\s*(\w*)$/,
        i = 0,
        m,
        def = definitions || {},
        skip = false,
        result = [];

    if (typeof source === 'string') {
        lines = source.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    } else {
        lines = source;
    }
    
//  (#define)
//  (#ifdef ... #endif)
//  (#ifdef ... #else ... #endif)
//  (#ifdef ... (#ifdef ... #endif) ... #endif)
//  (#ifdef ... (#ifdef ... #else ... #endif) ... #else ... #endif)

//  #if condition statement => binary operator
//  #if condition statement, else statement => ternary operator (with higher precedence)
//  #ifdef = (conditional
//  #ifndef = (conditional
//  #else = binary operator (lines, lines)
//  #endif = )
//  #undef, #define = unary

    for (; i < lines.length; i += 1) {
        m = tokens.exec(lines[i]);
        
        if (m) {
            skip = true;
        
            switch (m[1]) {
                case 'define': {
                    if (m[2]) {
                        def[m[2]] = true;
                    }
                    break;
                }
                case 'ifdef': {
                    if (m[2] && def[m[2]]) {
                        
                    }
                }
            }
        } else {
            result.push(lines[i]);
        }
    }

    project.log(def);
    project.log(result.join('\n'));

	return {
    
        
	};
};