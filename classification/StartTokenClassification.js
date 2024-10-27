/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Classification = require("./Classification")

class StartTokenClassification extends Classification {
	constructor(confidence, meta) {
		super(confidence, meta)
		this.label = "start_token"
	}
}

module.exports = StartTokenClassification
