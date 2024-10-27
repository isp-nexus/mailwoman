/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const RoadTypeClassifier = require("./RoadTypeClassifier")
const RoadTypeClassification = require("../classification/RoadTypeClassification")
const Span = require("../tokenization/Span")
const classifier = new RoadTypeClassifier()

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

module.exports.tests.single_character_tokens = (test) => {
	test("index: does contain single char tokens", (t) => {
		t.true(Object.keys(classifier.index).some((token) => token.length < 2))
		t.end()
	})
}

module.exports.tests.road_types = (test) => {
	const valid = ["highway", "road", "hi", "route", "hway", "r"]

	valid.forEach((token) => {
		test(`french prefix: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {
				RoadTypeClassification: new RoadTypeClassification(token.length > 1 ? 1.0 : 0.2),
			})
			t.end()
		})
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`RoadTypeClassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
