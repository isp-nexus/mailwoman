/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Tokenizer = require("../tokenization/Tokenizer")
const Span = require("../tokenization/Span")
const PostcodeClassification = require("../classification/PostcodeClassification")
const StreetClassification = require("../classification/StreetClassification")
const Solution = require("./Solution")
const SolutionPair = require("./SolutionPair")
const MustNotFollowFilter = require("./MustNotFollowFilter")

module.exports.tests = {}

module.exports.tests.postcode_preceeds_street = (test) => {
	test("postcode_preceeds_street: remove postcode", (t) => {
		const tok = new Tokenizer()

		const s1 = new Span("A")
		s1.start = 0
		s1.end = 1

		const s2 = new Span("B")
		s2.start = 3
		s2.end = 4

		const sp1 = new SolutionPair(s1, new PostcodeClassification(1.0))
		const sp2 = new SolutionPair(s2, new StreetClassification(1.0))

		tok.solution = [new Solution([sp1, sp2])]

		const c = new MustNotFollowFilter("StreetClassification", "PostcodeClassification")
		c.solve(tok)

		t.deepEquals(tok.solution.length, 1)
		t.deepEquals(tok.solution[0].pair.length, 1)
		t.deepEquals(tok.solution[0].pair[0], sp1)
		t.end()
	})
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`MustNotFollowFilter: ${name}`, testFunction)
	}

	for (const testCase in module.exports.tests) {
		module.exports.tests[testCase](test, common)
	}
}
