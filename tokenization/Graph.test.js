/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Graph = require("./Graph")

module.exports.tests = {}

module.exports.tests.constructor = (test) => {
	test("constructor", (t) => {
		const graph = new Graph()
		t.deepEquals(graph.edges, {})
		t.end()
	})
}

module.exports.tests.add = (test) => {
	test("add", (t) => {
		const graph = new Graph()
		t.deepEquals(graph.edges, {})

		const node = new (class Example {})()

		// add node to 'foo'
		const ok1 = graph.add("foo", node)
		t.equal(graph.edges.foo.length, 1)
		t.true(ok1)

		// try to add same node to 'foo' again
		const ok2 = graph.add("foo", node)
		t.equal(graph.edges.foo.length, 1)
		t.false(ok2)

		// add node to 'bar'
		const ok3 = graph.add("bar", node)
		t.equal(graph.edges.bar.length, 1)
		t.true(ok3)

		t.end()
	})
}

module.exports.tests.remove = (test) => {
	test("remove", (t) => {
		const graph = new Graph()
		const node1 = new (class Example {})()
		const node2 = new (class Example {})()
		graph.add("foo", node1)
		graph.add("bar", node1)
		graph.add("foo", node2)

		// remove node from 'foo'
		const ok1 = graph.remove("foo", node1)
		t.equal(graph.edges.foo.length, 1)
		t.true(ok1)

		// try to remove same node twice
		const ok2 = graph.remove("foo", node1)
		t.equal(graph.edges.foo.length, 1)
		t.false(ok2)

		// remove node from 'bar'
		const ok3 = graph.remove("bar", node1)
		t.false(graph.edges.bar)
		t.true(ok3)

		// remove node from 'baz'
		const ok4 = graph.remove("baz", node1)
		t.false(graph.edges.baz)
		t.false(ok4)

		t.end()
	})
}

module.exports.tests.length = (test) => {
	test("length", (t) => {
		const graph = new Graph()
		const node1 = new (class Example {})()
		const node2 = new (class Example {})()
		graph.add("foo", node1)
		graph.add("bar", node1)
		graph.add("foo", node2)

		// find total nodes with 'foo' relationship
		const foo = graph.length("foo")
		t.equals(foo, 2)

		// find total nodes with 'bar' relationship
		const bar = graph.length("bar")
		t.equals(bar, 1)

		// find total nodes with 'baz' relationship
		const baz = graph.length("baz")
		t.equals(baz, 0)

		t.end()
	})
}

module.exports.tests.findAll = (test) => {
	test("findAll", (t) => {
		const graph = new Graph()
		const node1 = new (class Example {})()
		const node2 = new (class Example {})()
		graph.add("foo", node1)
		graph.add("bar", node1)
		graph.add("foo", node2)

		// find all nodes with 'foo' relationship
		const foo = graph.findAll("foo")
		t.deepEquals(foo, [node1, node2])

		// find all nodes with 'bar' relationship
		const bar = graph.findAll("bar")
		t.deepEquals(bar, [node1])

		// find all nodes with 'baz' relationship
		const baz = graph.findAll("baz")
		t.deepEquals(baz, [])

		t.end()
	})
}

module.exports.tests.findOne = (test) => {
	test("findOne", (t) => {
		const graph = new Graph()
		const node1 = new (class Example {})()
		const node2 = new (class Example {})()
		graph.add("foo", node1)
		graph.add("bar", node1)
		graph.add("foo", node2)

		// find all nodes with 'foo' relationship
		const foo = graph.findOne("foo")
		t.equals(foo, node1)

		// find all nodes with 'bar' relationship
		const bar = graph.findOne("bar")
		t.equals(bar, node1)

		// find all nodes with 'baz' relationship
		const baz = graph.findOne("baz")
		t.equals(baz, null)

		t.end()
	})
}

module.exports.tests.some = (test) => {
	test("some", (t) => {
		const graph = new Graph()
		const node1 = new (class Example {
			constructor() {
				this.name = "A"
			}
		})()
		const node2 = new (class Example {
			constructor() {
				this.name = "B"
			}
		})()
		graph.add("foo", node1)
		graph.add("bar", node1)
		graph.add("foo", node2)

		// find some nodes with 'foo' relationship
		const foo = graph.some("foo", (n) => n.name === "A")
		t.true(foo)

		// find some nodes with 'bar' relationship
		const bar = graph.some("bar", (n) => n.name === "B")
		t.false(bar)

		// find some nodes with 'baz' relationship
		const baz = graph.some("baz", (n) => n.name === "A")
		t.false(baz)

		// invalid function
		const nofunc = graph.some("baz")
		t.false(nofunc)

		t.end()
	})
}

module.exports.tests.every = (test) => {
	test("every", (t) => {
		const graph = new Graph()
		const node1 = new (class Example {
			constructor() {
				this.name = "A"
			}
		})()
		const node2 = new (class Example {
			constructor() {
				this.name = "B"
			}
		})()
		graph.add("foo", node1)
		graph.add("bar", node1)
		graph.add("foo", node2)

		// find every nodes with 'foo' relationship
		const foo = graph.every("foo", (n) => n.name === "A")
		t.false(foo)

		// find every nodes with 'bar' relationship
		const bar = graph.every("bar", (n) => n.name === "A")
		t.true(bar)

		// find every nodes with 'baz' relationship
		const baz = graph.every("baz", (n) => n.name === "A")
		t.false(baz)

		// invalid function
		const nofunc = graph.every("baz")
		t.false(nofunc)

		t.end()
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`Graph: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
