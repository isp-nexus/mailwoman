/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { ClassificationsMatchMap } from "mailwoman/core"
import test from "tape"
import { MiddleInitialClassifier } from "./MiddleInitialClassifier.js"

const classifier = new MiddleInitialClassifier()

for (const token of ["M.", "M"]) {
	test(`classify: ${token}`, (t) => {
		const span = classifier.classify(token)

		t.same(span.classifications, ClassificationsMatchMap.from("middle_initial"))

		t.end()
	})
}

for (const token of ["Mae", "122", "M,", "&", "Mr", "Esq"]) {
	test(`classify: ${token}`, (t) => {
		const span = classifier.classify(token)
		t.equal(span.classifications.size, 0)
		t.end()
	})
}
