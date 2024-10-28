/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

class SolutionPair {
	/**
	 * @param {import("../tokenization/Span")} span
	 * @param {import("../classification/Classification")} classification
	 */
	constructor(span, classification) {
		this.span = span
		this.classification = classification
	}

	/**
	 * Compare two SolutionPairs.
	 *
	 * @param {SolutionPair} pair
	 */
	equals(pair) {
		return this.span === pair.span && this.classification.equals(pair.classification)
	}
}

module.exports = SolutionPair
