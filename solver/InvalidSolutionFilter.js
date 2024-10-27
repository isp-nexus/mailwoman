/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

class InvalidSolutionFilter {
	constructor(patterns) {
		this.patterns = Array.isArray(patterns) ? patterns : []
		this.patterns.map((p) => p.sort()) // sort alphabetically
	}

	solve(tokenizer) {
		tokenizer.solution = tokenizer.solution.filter((s) => {
			// sort alphabetically
			const classifications = s.pair.map((p) => p.classification.constructor.name).sort()
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
