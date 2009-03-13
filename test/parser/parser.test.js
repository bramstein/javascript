eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/parser/lexer.js"));
eval(loadFile("src/parser/parser.js"));

//var p;

testCases(test, 
	function setUp() {
     //   p = parser();
	},
    
    function checkIncorrectEnd() {
        project.log(parser.parse('4 *'));
    },
 /*   
    function checkParser() {
        project.log(parser.parse('3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 2 *'));
    },
        
    function checkFunction() {
        project.log(parser.parse('sin(1, cos (4), 6)'));
    },
*/
    function tearDown() {
  //      p = null;
    }
);    