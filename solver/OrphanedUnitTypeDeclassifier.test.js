/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Tokenizer = require("../tokenization/Tokenizer")
const Span = require("../tokenization/Span")
const UnitTypeClassification = require("../classification/UnitTypeClassification")
const UnitClassification = require("../classification/UnitClassification")
const StreetClassification = require("../classification/StreetClassification")
const Solution = require("./Solution")
const SolutionPair = require("./SolutionPair")
const OrphanedUnitTypeDeclassifier = require("./OrphanedUnitTypeDeclassifier")

module.exports.tests = {}

module.exports.tests.unit_type_missing_unit = (test) => {
	test("UnitClassification missing: remove UnitTypeClassification", (t) => {
		const tok = new Tokenizer()

		const s1 = new Span("A")
		s1.start = 0
		s1.end = 1

		const s2 = new Span("B")
		s2.start = 3
		s2.end = 4

		const sp1 = new SolutionPair(s1, new UnitTypeClassification(1.0))
		const sp2 = new SolutionPair(s2, new StreetClassification(1.0))

		tok.solution = [new Solution([sp1, sp2])]

		const c = new OrphanedUnitTypeDeclassifier()
		c.solve(tok)

		t.deepEquals(tok.solution.length, 1)
		t.deepEquals(tok.solution[0].pair.length, 1)
		t.deepEquals(tok.solution[0].pair[0], sp2)
		t.end()
	})
}

module.exports.tests.both_classifications_present = (test) => {
	test("UnitClassification present: do not remove UnitTypeClassification", (t) => {
		const tok = new Tokenizer()

		const s1 = new Span("A")
		s1.start = 0
		s1.end = 1

		const s2 = new Span("B")
		s2.start = 3
		s2.end = 4

		const s3 = new Span("C")
		s2.start = 6
		s2.end = 7

		const sp1 = new SolutionPair(s1, new UnitTypeClassification(1.0))
		const sp2 = new SolutionPair(s2, new UnitClassification(1.0))
		const sp3 = new SolutionPair(s3, new StreetClassification(1.0))

		tok.solution = [new Solution([sp1, sp2, sp3])]

		const c = new OrphanedUnitTypeDeclassifier()
		c.solve(tok)

		t.deepEquals(tok.solution.length, 1)
		t.deepEquals(tok.solution[0].pair.length, 3)
		t.deepEquals(tok.solution[0].pair[0], sp1)
		t.deepEquals(tok.solution[0].pair[1], sp2)
		t.deepEquals(tok.solution[0].pair[2], sp3)
		t.end()
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`OrphanedUnitTypeDeclassifier: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
