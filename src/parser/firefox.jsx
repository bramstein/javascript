
var flexer = function () {
    var tokenNames = ['NUMBER', 'OPERATOR', 'PAREN_OPEN', 'PAREN_CLOSE', 'IDENTIFIER', 'SPACE'],
    	tokens = new RegExp('(\\d+)|(+|\\*|-|\\/)|(\\()|(\\))|([a-zA-Z_]+)|(\\s+)', 'gy');
    
    return {
        tokenize: function (str) {
            var len = tokenNames.length + 1,
                index = 0;
            
            return {
                next: function () {
                    var r = [], name = 'UNKNOWN', i = 1;
                    if ((r = tokens.exec(str)) !== null) {
                        for (; i < len; i += 1) {
                            if (r[i] !== undefined) {
                                name = tokenNames[i - 1];
                                break;
                            }
                        }
                        
                        index = tokens.lastIndex;
                        
                        return {
                            token: name,
                            value: r[0],
                            position: index
                        };
                    }
                    else if (str.length !== 0 && index !== str.length) {
                        throw new Error('Unknown input at position ' + index + ' of: "' + str + '"');
                    }
                    return false;
                }
            };
        }
    };
};
