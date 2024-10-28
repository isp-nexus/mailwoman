/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const SectionClassifier = require("./super/SectionClassifier")
const StreetClassification = require("../classification/StreetClassification")

/**
 * Classifier which attempts to classify street names with no suffix or prefix when accompanied by a
 * housenumber in the same section.
 *
 * See: https://github.com/pelias/parser/issues/83
 */

class CentralEuropeanStreetNameClassifier extends SectionClassifier {
	/**
	 * @param {import("../tokenization/Span")} section
	 * @override
	 */
	each(section) {
		// there must at least two childen in this section
		if (section.graph.length("child") < 2) {
			return
		}

		// get first and last child
		const children = section.graph.findAll("child")
		const [first] = children

		if (!first) return

		const next = first.graph.findOne("next")

		// Section ends with a HouseNumberClassification?
		if (!next) return

		// No next span found?
		if (next.graph.findOne("next")) return

		// Next span is NOT the final span in the section?
		if (!Object.hasOwn(next.classifications, "HouseNumberClassification")) {
			return
		}

		// Other elements cannot contain any public classifications
		const hasPublicClassifications = Object.values(first.classifications).some((c) => c.public)

		if (hasPublicClassifications) return

		// optionally check parent phrases too?
		// if (_.some(first.graph.findAll('parent'), (p) => {
		//   if (p.norm !== first.norm) { return false }
		//   return _.some(p.classifications, (c) => c.public)
		// })) { return }

		// assume the first token is a street name
		first.classify(new StreetClassification(0.5))
	}
}

module.exports = CentralEuropeanStreetNameClassifier
