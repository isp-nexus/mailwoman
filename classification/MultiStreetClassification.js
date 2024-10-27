/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Classification = require("./Classification")

class MultiStreetClassification extends Classification {
	constructor(confidence, meta) {
		super(confidence, meta)
		this.public = false
		this.label = "multistreet"
	}
}

module.exports = MultiStreetClassification
