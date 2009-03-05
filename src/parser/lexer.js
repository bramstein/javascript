
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
        { symbol: 'OPERATOR', pattern: /^\+|\*|-|\//g },
        { symbol: 'PARENTHESES', pattern: /\(|\)/g },
        { symbol: 'FUN', pattern: /[a-z]/g }
    ];
    
    var space = /^\s+/g;
    
    return {
        tokenize: function (str) {
            return {
                next: function () {
                    var i = 0, len = tokens.length, r = [];
                    
                    for (; i < len; i += 1) {
                                
                        if ((r = tokens[i].pattern.exec(str)) !== null) {

                            tokens.forEach(function (t) {
                                t.pattern.lastIndex = tokens[i].pattern.lastIndex;
                            });
                            space.lastIndex = tokens[i].pattern.lastIndex;
                            
                            return {
                                'token': tokens[i].symbol,
                                value: r[0],
                                pos: r.index
                            };
                        }
                    };

                    
                    if (space.exec(str) !== null) {
                        tokens.forEach(function (t) {
                            t.pattern.lastIndex = space.lastIndex;
                        });
                        project.log("skipping space");
                        return this.next();
                    }
                    else {
                        project.log(space.lastIndex);
                        project.log("unknown input or EOL");
                        return false;
                    }
                }
            };
        }
    };
};