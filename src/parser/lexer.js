
var lexer = function (str) {
    var tokens = {
        NUMBER: /\d*/,
        OP: /\+|\*|-|\//,
        PARENTHESES: /\(|\)/
    };
    
    //projec.log(tokens.NUMBER.match(str));
    
};

var l = lexer('3 * 2 + (4 / 3)');
