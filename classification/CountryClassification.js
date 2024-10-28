/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Classification = require("./Classification")

class CountryClassification extends Classification {
	constructor(confidence, meta) {
		super(0.9, meta)
		this.public = true
		this.label = "country"
	}
}

module.exports = CountryClassification
