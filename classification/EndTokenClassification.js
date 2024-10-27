/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Classification = require("./Classification")

class EndTokenClassification extends Classification {
	constructor(confidence, meta) {
		super(confidence, meta)
		this.label = "end_token"
	}
}

module.exports = EndTokenClassification
