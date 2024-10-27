/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Classification = require("./StreetNameClassification")

module.exports.tests = {}

module.exports.tests.constructor = (test) => {
	test("constructor", (t) => {
		const c = new Classification()
		t.equals(c.label, "street_name")
		t.equals(c.confidence, 1.0)
		t.deepEqual(c.meta, {})
		t.end()
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`StreetNameClassification: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
