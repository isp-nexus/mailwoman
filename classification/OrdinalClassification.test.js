/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Classification = require("./OrdinalClassification")

module.exports.tests = {}

module.exports.tests.constructor = (test) => {
	test("constructor", (t) => {
		const c = new Classification()
		t.false(c.public)
		t.equals(c.label, "ordinal")
		t.equals(c.confidence, 1.0)
		t.deepEqual(c.meta, {})
		t.end()
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`OrdinalClassification: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
