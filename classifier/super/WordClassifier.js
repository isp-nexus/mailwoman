/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const BaseClassifier = require("./BaseClassifier")

class WordClassifier extends BaseClassifier {
	// classify individual words

	// note: you should provide this function in your subclass
	// each(span) {}

	classify(tokenizer) {
		for (let i = 0; i < tokenizer.section.length; i++) {
			const children = tokenizer.section[i].graph.findAll("child")
			for (let j = 0; j < children.length; j++) {
				this.each(children[j], i, j)
			}
		}
	}
}

module.exports = WordClassifier
