/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import EndTokenClassification from "../classification/EndTokenClassification.js"
import EndTokenSingleCharacterClassification from "../classification/EndTokenSingleCharacterClassification.js"
import StartTokenClassification from "../classification/StartTokenClassification.js"
import { Span } from "../tokenization/Span.js"
import { Tokenizer } from "../tokenization/Tokenizer.js"
import { Classifier, ClassifyInput } from "./super/BaseClassifier.js"

// classify the final token with 'EndTokenClassification'
// and the first token with 'SartTokenClassification'
// and also a 'EndTokenSingleCharacterClassification' if its only
// a single character in length.
// note: this can be useful for improving autocomplete.
// note: in the case of a single token then the span will be
// classified with more than one classification (can be both start & end).

class TokenPositionClassifier implements Classifier {
	classifyTokenizer(tokenizer: Tokenizer) {
		const [firstSection] = tokenizer.section

		if (!firstSection) return

		const firstSectionChildren = firstSection.graph.findAll("child")
		if (firstSectionChildren.length > 0) {
			firstSectionChildren
				.filter((s) => !s.graph.findOne("prev"))
				.forEach((firstChild) => {
					firstChild.classify(new StartTokenClassification(1.0))
				})
		}

		// end token
		const lastSection = tokenizer.section[tokenizer.section.length - 1]!
		const lastSectionChildren = lastSection.graph.findAll("child")
		if (lastSectionChildren.length > 0) {
			lastSectionChildren
				.filter((s) => !s.graph.findOne("next"))
				.forEach((lastChild) => {
					lastChild.classify(new EndTokenClassification(1.0))
					if (lastChild.norm.length === 1) {
						lastChild.classify(new EndTokenSingleCharacterClassification(1.0))
					}
				})
		}
	}

	classify(_input: ClassifyInput): Span {
		throw new Error("Method not implemented.")
	}
}

export default TokenPositionClassifier
