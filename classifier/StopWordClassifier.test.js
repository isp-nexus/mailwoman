/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const StopWordClassifier = require("./StopWordClassifier")
const StopWordClassification = require("../classification/StopWordClassification")
const Span = require("../tokenization/Span")
const classifier = new StopWordClassifier()

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

module.exports.tests.french_stop_words = (test) => {
	const valid = ["de", "la", "l'", "du", "à", "sur"]

	valid.forEach((token) => {
		test(`french stop_words: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {
				StopWordClassification: new StopWordClassification(token.length > 1 ? 0.75 : 0.2),
			})
			t.end()
		})
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`StopWordClassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
