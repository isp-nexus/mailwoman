/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 * @typedef {object} ParserOptions
 * @property {number} max_solutions
 * @property {number} max_tokens
 */

/**
 * Parses a tokenized address into a structured address.
 */
class Parser {
	/**
	 * @param {import("../classifier/super/BaseClassifier")[]} classifiers
	 * @param {import("../solver/super/BaseSolver")[]} solvers
	 * @param {Partial<ParserOptions>} [options]
	 */
	constructor(classifiers, solvers, options) {
		this.classifiers = classifiers
		this.solvers = solvers

		/**
		 * @type {ParserOptions}
		 */
		this.options = {
			max_solutions: 10,
			max_tokens: 100,
			...options,
		}
	}

	/**
	 * Run all classifiers.
	 *
	 * @param {import("../tokenization/Tokenizer")} tokenizer
	 *
	 * @returns {number}
	 */
	classify(tokenizer) {
		const start = Date.now()

		this.classifiers.forEach((c) => c.classify(tokenizer))
		return Date.now() - start
	}

	/**
	 * Run all solvers.
	 *
	 * @param {import("../tokenization/Tokenizer")} tokenizer
	 *
	 * @returns {number}
	 */
	solve(tokenizer) {
		const start = Date.now()

		this.solvers.forEach((s) => {
			this.scoreAndSort(tokenizer)

			// run solver
			s.solve(tokenizer)
		}, this)

		this.scoreAndSort(tokenizer)
		return Date.now() - start
	}

	/**
	 * Score and sort solutions.
	 *
	 * @param {import("../tokenization/Tokenizer")} tokenizer
	 */
	scoreAndSort(tokenizer) {
		// recompute scores
		tokenizer.solution.forEach((s) => s.computeScore(tokenizer))

		// sort pairs by span start
		tokenizer.solution.forEach((s) => s.pair.sort((a, b) => a.span.start - b.span.start))

		// sort results by score desc
		tokenizer.solution.sort(this.comparitor)

		// ensure that no more than $MAX_SOLUTIONS are retained
		if (tokenizer.solution.length > this.options.max_solutions) {
			tokenizer.solution = tokenizer.solution.slice(0, this.options.max_solutions)
		}
	}

	// comparitor function used to compare solutions for sorting
	// @todo: possibly move the admin penalty scoring to another file
	/**
	 * @param {import("../solver/Solution")} a
	 * @param {import("../solver/Solution")} b
	 *
	 * @returns {number}
	 */
	comparitor(a, b) {
		// if scores are equal then enforce a slight penalty for administrative ordering
		if (b.score === a.score) {
			const areas = {
				a: a.pair.filter((p) => p.span.classifications.hasOwnProperty("AreaClassification")),
				b: b.pair.filter((p) => p.span.classifications.hasOwnProperty("AreaClassification")),
			}

			const classification = {
				a: areas.a.length ? areas.a[0]?.classification.constructor.name : "",
				b: areas.b.length ? areas.b[0]?.classification.constructor.name : "",
			}

			if (classification.a === "LocalityClassification") {
				return -1
			}
			if (classification.b === "LocalityClassification") {
				return +1
			}
			if (classification.a === "RegionClassification") {
				return -1
			}
			if (classification.b === "RegionClassification") {
				return +1
			}
			if (classification.a === "CountryClassification") {
				return -1
			}
			if (classification.b === "CountryClassification") {
				return +1
			}
		}

		// sort results by score desc
		return b.score - a.score
	}
}

module.exports = Parser
