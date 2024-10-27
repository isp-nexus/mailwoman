/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const UnitTypeClassifier = require("./UnitTypeClassifier")
const UnitTypeClassification = require("../classification/UnitTypeClassification")
const Span = require("../tokenization/Span")
const classifier = new UnitTypeClassifier()

module.exports.tests = {}

function classify(body) {
	const s = new Span(body)
	classifier.each(s, null, 1)
	return s
}

module.exports.tests.english_unit_types = (test) => {
	const valid = ["unit", "apt", "lot"]

	valid.forEach((token) => {
		test(`english unit types: ${token}`, (t) => {
			const s = classify(token)

			t.deepEqual(s.classifications, {
				UnitTypeClassification: new UnitTypeClassification(1, {}),
			})
			t.end()
		})
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`UnitTypeClassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
