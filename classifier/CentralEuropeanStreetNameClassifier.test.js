/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const _ = require("lodash")
const CentralEuropeanStreetNameClassifier = require("./CentralEuropeanStreetNameClassifier")
const HouseNumberClassification = require("../classification/HouseNumberClassification")
const StreetClassification = require("../classification/StreetClassification")
const Span = require("../tokenization/Span")
const classifier = new CentralEuropeanStreetNameClassifier()

module.exports.tests = {}
module.exports.tests.classify = (test) => {
	const foo = new Span("Foo")
	const fooHouseNum = new Span("1", 4).classify(new HouseNumberClassification(1.0))
	foo.graph.add("next", fooHouseNum)

	const bar = new Span("Bar")
	const barHouseNum = new Span("2137", 4).classify(new HouseNumberClassification(1.0))
	bar.graph.add("next", barHouseNum)

	const baz = new Span("Baz")
	const bazHouseNum0 = new Span("152/160", 4).classify(new HouseNumberClassification(1.0))
	const bazHouseNum1 = new Span("152", 4).classify(new HouseNumberClassification(1.0))
	const bazHouseNum2 = new Span("160", 8).classify(new HouseNumberClassification(1.0))
	baz.graph.add("next", bazHouseNum0)
	baz.graph.add("next", bazHouseNum1)
	bazHouseNum1.graph.add("next", bazHouseNum2)

	// The Qux test case covers when the section has a greater length than
	// the tokens it contains, such as when it ends with whitespace.
	const qux = new Span("Qux")
	const quxHouseNum = new Span("1", 4).classify(new HouseNumberClassification(1.0))
	qux.graph.add("next", quxHouseNum)

	const valid = [
		new Span("Foo 1").setChildren([foo, fooHouseNum]),
		new Span("Bar 2137").setChildren([bar, barHouseNum]),
		new Span("Baz 152/160").setChildren([baz, bazHouseNum0, bazHouseNum1, bazHouseNum2]),
		new Span("Qux 1 ").setChildren([qux, quxHouseNum]),
	]

	valid.forEach((s) => {
		test(`classify: ${s.body}`, (t) => {
			// run classifier
			classifier.each(s)

			// get children
			const children = s.graph.findAll("child")

			// first child should now be classified as a street
			t.deepEqual(
				_.first(children).classifications,
				{
					StreetClassification: new StreetClassification(0.5),
				},
				`'${s.body}'`
			)

			// last child was unchanged
			_.tail(children).forEach((c) => {
				t.deepEqual(c.classifications, {
					HouseNumberClassification: new HouseNumberClassification(1),
				})
			})

			t.end()
		})
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`CentralEuropeanStreetNameClassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
