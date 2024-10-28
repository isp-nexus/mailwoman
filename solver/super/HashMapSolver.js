/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const BaseSolver = require("./BaseSolver")
const Span = require("../../tokenization/Span")
const Solution = require("../Solution")
const SolutionPair = require("../SolutionPair")
const MAX_PAIRS_PER_LABEL = 8

class HashMapSolver extends BaseSolver {
	// you should provide this function in your subclass
	// solve() {}

	/**
	 * @param {import("../../tokenization/Tokenizer")} tokenizer
	 * @param {boolean} [includePrivate]
	 * @param {boolean} [includeEmpty]
	 *
	 * @returns {Record<string, Solution>} A hashmap of solutions
	 */
	generateHashMap(tokenizer, includePrivate, includeEmpty) {
		/**
		 * @type {Record<string, Solution>} A Hashmap of solutions
		 */
		const map = {}
		for (const section of tokenizer.section) {
			// multi-word phrases
			const phrases = section.graph.findAll("phrase")
			for (let j = 0; j < phrases.length; j++) {
				const phrase = phrases[j]
				const keys = Object.keys(phrase.classifications)
				if (!keys.length) {
					continue
				}
				for (const [phraseIdx, classification] of Object.entries(phrase.classifications)) {
					if (!includePrivate && !classification.public) {
						continue
					}
					if (!map.hasOwnProperty(classification.label)) {
						map[classification.label] = new Solution()
						if (includeEmpty) {
							map[classification.label].pair.push(new SolutionPair(new Span(), classification))
						}
					}
					if (map[classification.label].pair.length >= MAX_PAIRS_PER_LABEL) {
						continue
					}
					map[classification.label].pair.push(new SolutionPair(phrase, classification))
				}
			}

			// single-word spans
			const children = section.graph.findAll("child")

			for (const word of children) {
				const keys = Object.keys(word.classifications)
				if (!keys.length) {
					continue
				}

				for (const classification of Object.values(word.classifications)) {
					if (!includePrivate && !classification.public) {
						continue
					}
					if (!map.hasOwnProperty(classification.label)) {
						map[classification.label] = new Solution()
						if (includeEmpty) {
							map[classification.label].pair.push(new SolutionPair(new Span(), classification))
						}
					}
					if (map[classification.label].pair.length >= MAX_PAIRS_PER_LABEL) {
						continue
					}
					map[classification.label].pair.push(new SolutionPair(word, classification))
				}
			}
		}

		return map
	}
}

module.exports = HashMapSolver
