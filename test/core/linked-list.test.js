eval(loadFile("src/core/object.js"));
eval(loadFile("src/core/array.js"));
eval(loadFile("src/core/linked-list.js"));

testCases(test, 
	function setUp() {
	},

	function checkCreate() {
		var l = new LinkedList();
		assert.that(l, not(eq(undefined)));
	},

	function checkPush() {
		var l = new LinkedList();
		l.push(new LinkedList.Node(1));
		assert.that(l.size(), eq(1));
		l.push(new LinkedList.Node(2));
		assert.that(l.size(), eq(2));
	},

	function checkAt() {
		var l = new LinkedList();
		l.push(new LinkedList.Node(1));
		l.push(new LinkedList.Node(2));
		l.push(new LinkedList.Node(3));
		l.push(new LinkedList.Node(4));
		assert.that(l.size(), eq(4));
		assert.that(l.at(0).data, eq(1));
		assert.that(l.at(3).data, eq(4));
		assert.that(l.at(2).data, eq(3));
		assert.that(l.at(1).data, eq(2));
		assert.that(l.at(-1), eq(null));
		assert.that(l.at(5), eq(null));
	},

	function checkContains() {
		var l = new LinkedList(),
			n1 = new LinkedList.Node(1),
			n2 = new LinkedList.Node(2),
			n3 = new LinkedList.Node(3);

		l.push(n1);
		l.push(n2);
		
		assert.that(l.contains(n1), isTrue());
		assert.that(l.contains(n2), isTrue());
		assert.that(l.contains(n3), isFalse());
	},

	function checkInsertAfter() {
		var l = new LinkedList(),
			n1 = new LinkedList.Node(1),
			n2 = new LinkedList.Node(2),
			n3 = new LinkedList.Node(3),
			n4 = new LinkedList.Node(4);

		l.push(n1);
		assert.that(l.size(), eq(1));
		assert.that(l.at(0).data, eq(1));
	
		l.insertAfter(n1, n2);
		assert.that(l.size(), eq(2));
		assert.that(l.at(1).data, eq(2));

		l.insertAfter(n1, n3);
		assert.that(l.size(), eq(3));
		assert.that(l.at(1).data, eq(3));
		assert.that(l.at(2).data, eq(2));

		// Note that n4 is not part of the list so we shouldn't be able to insert it.
		l.insertAfter(n4, n3);
		assert.that(l.size(), eq(3));
	},

	function checkInsertBefore() {
		var l = new LinkedList(),
			n1 = new LinkedList.Node(1),
			n2 = new LinkedList.Node(2),
			n3 = new LinkedList.Node(3),
			n4 = new LinkedList.Node(4);
		
		l.push(n1);
		assert.that(l.size(), eq(1));
		assert.that(l.at(0).data, eq(1));

		l.insertBefore(n1, n2);
		assert.that(l.size(), eq(2));
		assert.that(l.at(0).data, eq(2));

		l.insertBefore(n1, n3);
		assert.that(l.size(), eq(3));
		assert.that(l.at(0).data, eq(2));
		assert.that(l.at(1).data, eq(3));
		assert.that(l.at(2).data, eq(1));

		// Note that n4 is not part of the list so we shouldn't be able to insert it.
		l.insertBefore(n4, n3);
		assert.that(l.size(), eq(3));
	},

	function checkUnshift() {
		var l = new LinkedList(),
			n1 = new LinkedList.Node(1),
			n2 = new LinkedList.Node(2),
			n3 = new LinkedList.Node(3);
		l.unshift(n1);
		l.unshift(n2);
		l.unshift(n3);

		assert.that(l.size(), eq(3));
		assert.that(l.at(0).data, eq(3));
		assert.that(l.at(1).data, eq(2));
		assert.that(l.at(2).data, eq(1));
	},

	function checkRemove() {
		var l = new LinkedList(),
			n1 = new LinkedList.Node(1),
			n2 = new LinkedList.Node(2),
			n3 = new LinkedList.Node(3),
			n4 = new LinkedList.Node(4);

		l.push(n1);
		l.push(n2);
		l.push(n3);

		assert.that(l.size(), eq(3));
		l.remove(n2);
		assert.that(l.size(), eq(2));
		assert.that(l.at(0).data, eq(1));
		assert.that(l.at(1).data, eq(3));

		l.remove(n4);
		assert.that(l.size(), eq(2));
	},

	function checkShift() {
		var l = new LinkedList(),
			n1 = new LinkedList.Node(1),
			n2 = new LinkedList.Node(2),
			n3 = new LinkedList.Node(3);

		l.push(n1);
		l.push(n2);
		l.push(n3);
		assert.that(l.size(), eq(3));
		l.shift();
		assert.that(l.size(), eq(2));
		assert.that(l.at(0).data, eq(2));
		assert.that(l.at(1).data, eq(3));
	},
	

	function checkPop() {
		var l = new LinkedList(),
			n1 = new LinkedList.Node(1),
			n2 = new LinkedList.Node(2),
			n3 = new LinkedList.Node(3);

		l.push(n1);
		l.push(n2);
		l.push(n3);
		assert.that(l.size(), eq(3));
		l.pop();
		assert.that(l.size(), eq(2));
		assert.that(l.at(0).data, eq(1));
		assert.that(l.at(1).data, eq(2));
	},

	function checkForEach() {
	},

	function tearDown() {
	}
);
