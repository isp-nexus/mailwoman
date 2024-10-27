/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Classification = require("./Classification")

class StreetProperNameClassification extends Classification {
	constructor(confidence, meta) {
		super(confidence, meta)
		this.label = "street_proper_name"
	}
}

module.exports = StreetProperNameClassification
