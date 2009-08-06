eval(loadFile("src/preprocessor/preprocessor.js"));

importClass(java.io.File);
importClass(java.io.FileReader);
importClass(Packages.org.apache.tools.ant.util.FileUtils);


var example1,
    preprocessor;

function fileToString(file) {
    return new String(FileUtils.readFully(new FileReader(file))).toString();
}

testCases(test, 
	function setUp() {
        example1 = fileToString('test/preprocessor/example1.js');
	},
	
	function checkIO() {
        preprocessor(example1);
	},
	
	function tearDown() {
        example1 = undefined;
	}
);