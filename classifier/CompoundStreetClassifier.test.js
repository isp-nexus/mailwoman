/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const CompoundStreetClassifier = require("./CompoundStreetClassifier")
const StreetClassification = require("../classification/StreetClassification")
const Span = require("../tokenization/Span")
const classifier = new CompoundStreetClassifier()

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

module.exports.tests.german_compound = (test) => {
	const valid = [
		"teststraße",
		"teststrasse",
		"teststr.",
		"teststr",
		"grolmanstr",
		"testallee",
		"testweg",
		"testplatz",
		"testpl.",
		"testvägen",
	]

	const invalid = ["testal", "testw", "testw."]

	valid.forEach((token) => {
		test(`german compound: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {
				StreetClassification: new StreetClassification(token.length > 1 ? 1.0 : 0.2),
			})
			t.end()
		})
	})

	invalid.forEach((token) => {
		test(`german compound: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {})
			t.end()
		})
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`CompoundStreetClassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
