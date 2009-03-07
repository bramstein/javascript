
/**
 * Lexer returns an iterator.
 * var l = lexer(tokens);
 * var i = l.tokenize('3 * 2 + (4 / 3)');
 * while(i.next()) {
 * 
 * }
 */
var lexer = function (tokens) {
    // TODO: check that token patterns have the g flag set.
    var tokens = tokens || [
        { symbol: 'NUMBER', pattern: /^\d+/g },
        { symbol: 'OPERATOR', pattern: /^(\+|\*|-|\/)/g },
        { symbol: 'PARENTHESES', pattern: /^\(|\)/g },
        { symbol: 'FUN', pattern: /^[a-zA-Z]/ },
        { symbol: 'SPACE', pattern: /^\s+/g }
    ];
    
    var tokenNames = ['NUMBER', 'OPERATOR', 'PAREN_OPEN', 'PAREN_CLOSE', 'IDENTIFIER', 'SPACE'];
    var tokens = /(\d+)|(\+|\*|-|\/)|(\()|(\))|([a-zA-Z_]+)|(\s+)/g;
    
//    var other = /^(.)*/g;
    
    return {
        tokenize: function (str) {
            var len = tokenNames.length + 1,
                index = 0;
            return {
                next: function () {
                    var r = [], name = 'UNKNOWN', i = 1;
                    if ((r = tokens.exec(str)) !== null) {
                        
                        for(; i < len; i += 1) {
                            if (r[i] !== undefined) {
                                name = tokenNames[i - 1];
                                break;
                            }
                        }
                        
                        index = tokens.lastIndex;
                        
                        return {
                            token: name,
                            value: r[0],
                            pos: index
                        };
                    }
                    else if (str.length !== 0 && index !== str.length) {
                        throw new Error('Unknown input at position ' + index + ' of: ' + str);
                    }
                    
                    return false;
                  //  else {
                  //      throw new Error('Unknown input: ' + buffer);
                  //  }
/*                
                    var i = 0, len = tokens.length, r = [];
                    
                    for (; i < len; i += 1) {
                                
                        if ((r = tokens[i].pattern.exec(buffer)) !== null) {
                            currentPosition += tokens[i].pattern.lastIndex;
                            
                            buffer = buffer.substring(tokens[i].pattern.lastIndex);
                            tokens[i].pattern.lastIndex = 0;
                                              
                            return {
                                'token': tokens[i].symbol,
                                value: r[0],
                                pos: currentPosition
                            };
                        }
                    };
                    
                    if (buffer.length !== 0 && other.exec(buffer) !== null) {
                        throw new Error('Unknown input: ' + buffer);
                    }
                    return false;
*/
                }
            };
        }
    };
};