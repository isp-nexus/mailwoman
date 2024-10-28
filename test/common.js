/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Tokenizer = require("../tokenization/Tokenizer")
const AddressParser = require("../parser/AddressParser")
const globalParser = new AddressParser()

/**
 * @param {import("mailwoman").Tokenizer} tokenizer
 *
 * @returns {Record<string, string>[]} Extracted data
 */
const extract = (tokenizer) => {
	return tokenizer.solution.map((solution) =>
		solution.pair.map((c) => {
			return {
				[c.classification.label]: c.span.body,
				// offset: c.span.start
			}
		})
	)
}

/**
 * @param {import("tape")} test
 * @param {AddressParser} [parser]
 */
const assert = (test, parser) => {
	const p = parser || globalParser

	/**
	 * @param {string} input
	 * @param {Record<string, string>[]} expected
	 * @param {boolean} [firstOnly]
	 */
	return (input, expected, firstOnly) => {
		const tokenizer = new Tokenizer(input)
		p.classify(tokenizer)
		p.solve(tokenizer)

		test(input, (t) => {
			const ext = extract(tokenizer)
			t.deepEquals(firstOnly === false ? ext : ext[0], expected)
			t.end()
		})
	}
}

module.exports.assert = assert
module.exports.extract = extract
module.exports.parser = globalParser
