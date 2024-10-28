/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

class InvalidSolutionFilter {
	/**
	 * @param {string | string[][]} patterns
	 */
	constructor(patterns) {
		/**
		 * @type {string[][]}
		 */
		this.patterns = Array.isArray(patterns) ? patterns : []

		this.patterns.map((p) => p.sort()) // sort alphabetically
	}

	/**
	 * @param {import("../tokenization/Tokenizer")} tokenizer
	 */
	solve(tokenizer) {
		tokenizer.solution = tokenizer.solution.filter((solution) => {
			// sort alphabetically
			const classifications = solution.pair.map((p) => p.classification.constructor.name).sort()

			return !this.patterns.some((p) => {
				if (classifications.length !== p.length) {
					return false
				}

				return classifications.every((_, i) => classifications[i] === p[i])
			})
		}, this)
	}
}

module.exports = InvalidSolutionFilter
