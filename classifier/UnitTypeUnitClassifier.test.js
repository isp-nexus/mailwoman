/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const UnitTypeClassification = require("../classification/UnitTypeClassification")
const UnitClassification = require("../classification/UnitClassification")
const UnitTypeUnitClassifier = require("./UnitTypeUnitClassifier")
const Span = require("../tokenization/Span")
const classifier = new UnitTypeUnitClassifier()

module.exports.tests = {}

function classify(body) {
	const s = new Span(body)
	classifier.each(s, s)
	return s
}

module.exports.tests.english_unit_types = (test) => {
	const valid = ["unit16", "apt23", "lot75"]

	const invalid = ["unit", "23", "Main"]

	valid.forEach((token) => {
		test(`english unit types: ${token}`, (t) => {
			const span = classify(token)

			const classifications = span.graph
				.findAll("child")
				.map((s) => s.classifications)
				.filter((c) => c)

			t.equal(span.graph.findAll("child").length, 2)
			t.deepEqual(
				classifications.find((c) => c.UnitTypeClassification),
				{
					UnitTypeClassification: new UnitTypeClassification(1, {}),
				}
			)
			t.deepEqual(
				classifications.find((c) => c.UnitClassification),
				{
					UnitClassification: new UnitClassification(1, {}),
				}
			)
			t.end()
		})
	})

	invalid.forEach((token) => {
		test(`english unit types: ${token}`, (t) => {
			const s = classify(token)

			t.equal(s.graph.findAll("child").length, 0)
			t.end()
		})
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`UnitTypeUnitClassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
