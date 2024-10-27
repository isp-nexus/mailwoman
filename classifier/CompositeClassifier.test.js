/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const CompositeClassifier = require("./CompositeClassifier")
const Span = require("../tokenization/Span")
const classifier = new CompositeClassifier()

module.exports.tests = {}

module.exports.tests.match = (test) => {
	test("match: scheme.is multi-token", (t) => {
		const scheme = { is: ["PositiveClassification"] }

		const phrase = new Span("Test Phrase")
		t.false(classifier.match(scheme, phrase))

		phrase.classifications.PositiveClassification = true
		t.true(classifier.match(scheme, phrase))

		t.end()
	})

	test("match: scheme.is single-token", (t) => {
		const scheme = { is: ["PositiveClassification"] }

		const phrase = new Span("Test")
		t.false(classifier.match(scheme, phrase))

		const child = new Span("Test")
		phrase.graph.add("child", child)

		child.classifications.PositiveClassification = true
		t.true(classifier.match(scheme, phrase))

		t.end()
	})

	test("match: scheme.not multi-token", (t) => {
		const scheme = {
			is: ["PositiveClassification"],
			not: ["NegativeClassification"],
		}

		const phrase = new Span("Test Phrase")
		t.false(classifier.match(scheme, phrase))

		phrase.classifications.PositiveClassification = true
		t.true(classifier.match(scheme, phrase))

		phrase.classifications.NegativeClassification = true
		t.false(classifier.match(scheme, phrase))

		t.end()
	})

	test("match: scheme.not single-token", (t) => {
		const scheme = {
			is: ["PositiveClassification"],
			not: ["NegativeClassification"],
		}

		const phrase = new Span("Test")
		t.false(classifier.match(scheme, phrase))

		const child = new Span("Test")
		phrase.graph.add("child", child)

		child.classifications.PositiveClassification = true
		t.true(classifier.match(scheme, phrase))

		child.classifications.NegativeClassification = true
		t.false(classifier.match(scheme, phrase))

		t.end()
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`CompositeClassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
