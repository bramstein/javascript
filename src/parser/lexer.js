
/**
 * Lexer returns an iterator.
 * var l = lexer(tokens);
 * var i = l.tokenize('3 * 2 + (4 / 3)');
 * while(i.next()) {
 * 
 * }
 */
var lexer = function (tokens) {
    tokens.forEach(function (i) {
        i.pattern.global = true;
    });
    
    return {
        tokenize: function (str) {
            var currentPosition = 0,
                buffer = str;
            return {
                next: function () {
                    var i = 0, len = tokens.length, r = [];
                    
                    for (; i < len; i += 1) {
                                
                        if ((r = tokens[i].pattern.exec(buffer)) !== null) {
                            currentPosition += tokens[i].pattern.lastIndex;
                            
                            buffer = buffer.substring(tokens[i].pattern.lastIndex);
                            tokens[i].pattern.lastIndex = 0;
                            
                            return Object.extend(Object.clone(tokens[i]), {
                                value: r[0],
                                pos: currentPosition,
                                toString: function () {
                                    return this.value;
                                }
                            });
                        }
                    }
                    
                    if (buffer.length !== 0) {
                        throw new Error('Unknown input: ' + buffer);
                    }
                    return false;
                }
            };
        }
    };
};
