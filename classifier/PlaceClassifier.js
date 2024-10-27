/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const WordClassifier = require("./super/WordClassifier")
const PlaceClassification = require("../classification/PlaceClassification")
const libpostal = require("../resources/libpostal/libpostal")

// dictionaries sourced from the libpostal project
// see: https://github.com/openvenues/libpostal

class PlaceClassifier extends WordClassifier {
	setup() {
		// load index tokens
		this.index = {}
		libpostal.load(this.index, ["fr", "de", "en", "pl"], "place_names.txt")
		libpostal.generatePlurals(this.index)
	}

	each(span) {
		// skip spans which contain numbers
		if (span.contains.numerals) {
			return
		}

		// do not classify tokens preceeded by an 'IntersectionClassification'
		const firstChild = span.graph.findOne("child:first") || span
		const prev = firstChild.graph.findOne("prev")
		if (prev && prev.classifications.hasOwnProperty("IntersectionClassification")) {
			return
		}

		// use an inverted index for full token matching as it's O(1)
		if (this.index.hasOwnProperty(span.norm)) {
			span.classify(new PlaceClassification(1.0))
		}
	}
}

module.exports = PlaceClassifier
