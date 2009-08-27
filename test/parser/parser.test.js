eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/parser/lexer.js"));
eval(loadFile("src/parser/parser.js"));

//var p;

function printTree(node) {
    if (Object.isArray(node)) {
        for (var i = 0; i < node.length; i += 1) {
            printTree(node[i]);
        }
    } else if (Object.isObject(node)) {
        project.log(node.toString());
    }
}
/*
function evaluate(tree) {
	project.log(Object.isArray(tree));

	project.log(tree[1]);
   	if (tree.type === 'NUMBER') {
		project.log(tree.value);
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
*/

testCases(test, 
	function setUp() {
     //   p = parser();
	},
    
    function nop() {
    },
    /*
    function checkIncorrectEnd() {
        function f() {
       //     parser.parse('4 * (5 + ) / ');
        }
    
        shouldThrowException(function () {
            f();
        });
    },*/
    
    function checkSimple() {
        var r = parser.parse('3 + 4');
        //project.log(Object.isArray(r));
        project.log(r);
        printTree(r);
       // assert.that(evaluate(parser.parse('3 + 4')), eq(7));
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
