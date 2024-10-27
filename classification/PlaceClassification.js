/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Classification = require("../classification/Classification")

class PlaceClassification extends Classification {
	constructor(confidence, meta) {
		super(confidence, meta)
		this.label = "place"
	}
}

module.exports = PlaceClassification
