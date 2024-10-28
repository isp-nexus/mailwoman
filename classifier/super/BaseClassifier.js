/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 * @abstract
 */

class BaseClassifier {
	constructor() {
		this.setup()
	}

	// you override this function in your classifier
	// each(span) {}

	/**
	 * @abstract
	 * @param {import("../../tokenization/Tokenizer")} tokenizer
	 */
	classify(tokenizer) {}

	// you may optionally provide this function in your subclass
	/**
	 * @abstract
	 * @optional
	 */
	setup() {}
}

module.exports = BaseClassifier
