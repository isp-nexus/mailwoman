/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

class MustNotPreceedFilter {
	constructor(objectClassification, subjectClassification) {
		this.classification = {
			object: objectClassification,
			subject: subjectClassification,
		}
	}

	solve(tokenizer) {
		tokenizer.solution = tokenizer.solution.filter((s) => {
			const object = s.pair.filter((p) => p.classification.constructor.name === this.classification.object)
			const subject = s.pair.filter((p) => p.classification.constructor.name === this.classification.subject)

			// solution contains both object & subject classifications
			if (object.length > 0 && subject.length > 0) {
				// the object comes before the subject(s)
				if (subject.some((p) => p.span.start > object[0].span.end)) {
					// remove the object classification from this solution
					s.pair = s.pair.filter((p) => p.classification.constructor.name !== this.classification.object)
					return s.pair.length > 0
				}
			}

			return true
		})
	}
}

module.exports = MustNotPreceedFilter
