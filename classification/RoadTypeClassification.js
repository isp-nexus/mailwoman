/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Classification = require("./Classification")

class RoadTypeClassification extends Classification {
	constructor(confidence, meta) {
		super(confidence, meta)
		this.label = "road_type"
	}
}

module.exports = RoadTypeClassification
