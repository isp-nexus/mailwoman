/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const ChainClassifier = require("./ChainClassifier")
const ChainClassification = require("../classification/ChainClassification")
const Span = require("../tokenization/Span")
const classifier = new ChainClassifier()

module.exports.tests = {}

function classify(body) {
	const s = new Span(body)
	classifier.each(s, null, 1)
	return s
}

module.exports.tests.classify = (test) => {
	const valid = ["McDonalds", "McDonald's", "lone star steakhouse", "panda express"]

	valid.forEach((token) => {
		test(`classify: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {
				ChainClassification: new ChainClassification(1.0),
			})
			t.end()
		})
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`ChainClassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
