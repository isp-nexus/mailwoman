/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const BaseClassifier = require("./BaseClassifier")

/**
 * @typedef {object} SectionClassifierUtils
 * @property {function(import('../../tokenization/Span')): import('../../tokenization/Span')[]} findPhrasesContaining
 */

class SectionClassifier extends BaseClassifier {
	// classify an whole section

	// note: you should provide this function in your subclass
	/**
	 * @abstract
	 * @param {import("../../tokenization/Span")} span
	 * @param {SectionClassifierUtils} [utils]
	 *
	 * @returns {void}
	 */
	each(span, utils) {}

	/**
	 * @param {import("../../tokenization/Tokenizer")} tokenizer
	 * @override
	 */
	classify(tokenizer) {
		for (const section of tokenizer.section) {
			this.each(section, this.utils(section))
		}
	}

	/**
	 * @param {import("../../tokenization/Span")} section
	 *
	 * @returns {SectionClassifierUtils}
	 */
	utils(section) {
		return {
			/**
			 * Find all phrases containing a child span.
			 *
			 * @param {import("../../tokenization/Span")} child
			 *
			 * @returns
			 */
			findPhrasesContaining: (child) => {
				return section.graph.findAll("phrase").filter((p) => p.graph.some("child", (pc) => pc === child))
			},
		}
	}
}

module.exports = SectionClassifier
