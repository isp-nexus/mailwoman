/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const DirectionalClassifier = require("./DirectionalClassifier")
const DirectionalClassification = require("../classification/DirectionalClassification")
const Span = require("../tokenization/Span")
const classifier = new DirectionalClassifier()

module.exports.tests = {}

function classify(body) {
	const s = new Span(body)
	classifier.each(s)
	return s
}

module.exports.tests.contains_numerals = (test) => {
	test("contains numerals: honours contains.numerals boolean", (t) => {
		const s = new Span("example")
		s.contains.numerals = true
		classifier.each(s)
		t.deepEqual(s.classifications, {})
		t.end()
	})
}

module.exports.tests.english = (test) => {
	const valid = [
		"north",
		"n",
		"n.",
		"south",
		"s",
		"s.",
		"east",
		"e",
		"e.",
		"west",
		"w",
		"w.",
		"northeast",
		"ne",
		"ne.",
		"southeast",
		"se",
		"se.",
		"northwest",
		"nw",
		"nw.",
		"southwest",
		"sw",
		"sw.",
		"lower",
		"lwr",
		"upper",
		"upr",
		"middle",
		"mdl",
		"centre",
		"center",
		"ctr",
		"central",
		"ctrl",
	]

	const invalid = ["northsouth", "ns", "ns.", "westeast", "we", "we."]

	valid.forEach((token) => {
		test(`english: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {
				DirectionalClassification: new DirectionalClassification(1.0),
			})
			t.end()
		})
	})

	invalid.forEach((token) => {
		test(`english: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {})
			t.end()
		})
	})
}

module.exports.tests.spanish = (test) => {
	const valid = [
		"norte",
		"n",
		"n.",
		"sur",
		"s",
		"s.",
		"este",
		"e",
		"e.",
		"oeste",
		"w",
		"w.",
		"noreste",
		"ne",
		"ne.",
		"sureste",
		"se",
		"se.",
		"noroeste",
		"nw",
		"nw.",
		"suroeste",
		"sw",
		"sw.",
	]

	const invalid = ["norsur", "ns", "ns.", "oesteeste", "we", "we."]

	valid.forEach((token) => {
		test(`spanish: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {
				DirectionalClassification: new DirectionalClassification(1.0),
			})
			t.end()
		})
	})

	invalid.forEach((token) => {
		test(`spanish: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {})
			t.end()
		})
	})
}

module.exports.tests.german = (test) => {
	const valid = [
		"nord",
		"n",
		"n.",
		"süd",
		"s",
		"s.",
		"ost",
		"o",
		"o.",
		"west",
		"w",
		"w.",
		"nordost",
		"no",
		"no.",
		"südost",
		"so",
		"so.",
		"nordwest",
		"nw",
		"nw.",
		"südwest",
		"sw",
		"sw.",
	]

	const invalid = ["nordsüd", "ns", "ns.", "westost", "wo", "wo."]

	valid.forEach((token) => {
		test(`german: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {
				DirectionalClassification: new DirectionalClassification(1.0),
			})
			t.end()
		})
	})

	invalid.forEach((token) => {
		test(`german: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {})
			t.end()
		})
	})
}

module.exports.tests.french = (test) => {
	const valid = [
		"nord",
		"n",
		"n.",
		"sud",
		"s",
		"s.",
		"est",
		"e",
		"e.",
		"ouest",
		"o",
		"o.",
		"nord est",
		"ne",
		"ne.",
		"sud est",
		"se",
		"se.",
		"nord ouest",
		"no",
		"no.",
		"sud ouest",
		"so",
		"so.",
	]

	const invalid = ["nordsud", "ns", "ns.", "ouestest", "oe", "oe."]

	valid.forEach((token) => {
		test(`french: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {
				DirectionalClassification: new DirectionalClassification(1.0),
			})
			t.end()
		})
	})

	invalid.forEach((token) => {
		test(`french: ${token}`, (t) => {
			const s = classify(token)
			t.deepEqual(s.classifications, {})
			t.end()
		})
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`DirectionalClassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
