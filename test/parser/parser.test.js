eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/parser/lexer.js"));
eval(loadFile("src/parser/parser.js"));

//var p;

function evaluate(tree) {
 project.log(Object.isArray(tree));


    if (tree.type === 'NUMBER') {
        return tree.value;
    }
    else if (tree[0].type === 'BINARY_OPERATOR') {
        if (tree[0].token === '+') {
            return evaluate(tree[1]) + evaluate(tree[2]);
        }
        else if (tree[0].token === '*') {
            return evaluate(tree[1]) * evaluate(tree[2]);
        }
    }
     }


testCases(test, 
	function setUp() {
     //   p = parser();
	},
    
    function checkIncorrectEnd() {
        function f() {
            parser.parse('4 * (5 + ) / ');
        }
    
        shouldThrowException(function () {
            f();
        });
    },
    
    function checkSimple() {
        assert.that(evaluate(parser.parse('3 + 4')), eq(7));
    },
    
    function checkNesting() {
        //project.log(parser.parse('3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 2'));
    },
        
    function checkFunction() {
    //    project.log(parser.parse('sin(1, cos (4), 6)'));
    },

    function tearDown() {
  //      p = null;
    }
);    