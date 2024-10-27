/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Classification = require("./Classification")

class VenueClassification extends Classification {
	constructor(confidence, meta) {
		super(confidence, meta)
		this.public = true
		this.label = "venue"
	}
}

module.exports = VenueClassification
