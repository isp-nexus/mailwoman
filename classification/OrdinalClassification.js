/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Classification = require("./Classification")

class OrdinalClassification extends Classification {
	constructor(confidence, meta) {
		super(confidence, meta)
		this.label = "ordinal"
	}
}

module.exports = OrdinalClassification
