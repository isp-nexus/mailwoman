/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

class OrphanedUnitTypeDeclassifier {
	solve(tokenizer) {
		tokenizer.solution = tokenizer.solution.filter((s) => {
			// only applies to solutions containing a UnitTypeClassification
			const unitType = s.pair.filter((p) => p.classification.constructor.name === "UnitTypeClassification")
			if (unitType.length === 0) {
				return true
			}

			// check for presence of a UnitClassification
			const unit = s.pair.filter((p) => p.classification.constructor.name === "UnitClassification")

			// remove UnitTypeClassification with no corresponding UnitClassification
			if (unit.length === 0) {
				s.pair = s.pair.filter((p) => p.classification.constructor.name !== "UnitTypeClassification")
				return s.pair.length > 0
			}

			return true
		})
	}
}

module.exports = OrphanedUnitTypeDeclassifier
