/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const StreetProperNameClassifier = require("./StreetProperNameClassifier")
const StreetProperNameClassification = require("../classification/StreetProperNameClassification")
const Span = require("../tokenization/Span")
const classifier = new StreetProperNameClassifier()

module.exports.tests = {}

function classify(body) {
	const s = new Span(body)
	classifier.each(s, null, 1)
	return s
}

module.exports.tests.contains_numerals = (test) => {
	test("contains numerals: honours contains.numerals boolean", (t) => {
		const s = new Span("example")
		s.contains.numerals = true
		classifier.each(s, null, 1)
		t.deepEqual(s.classifications, {})
		t.end()
	})
}

module.exports.tests.street_proper_names = (test) => {
	const valid = ["broadway", "esplanade"]

	valid.forEach((token) => {
		test(`street_proper_names: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {
				StreetProperNameClassification: new StreetProperNameClassification(0.7),
			})
			t.end()
		})
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`StreetProperNameClassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
