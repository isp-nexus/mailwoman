/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const GivenNameClassifier = require("./GivenNameClassifier")
const GivenNameClassification = require("../classification/GivenNameClassification")
const Span = require("../tokenization/Span")
const classifier = new GivenNameClassifier()

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

module.exports.tests.classify = (test) => {
	const valid = ["Anderson Luís", "Peter"]

	valid.forEach((token) => {
		test(`classify: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {
				GivenNameClassification: new GivenNameClassification(1.0),
			})
			t.end()
		})
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`GivenNameClassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
