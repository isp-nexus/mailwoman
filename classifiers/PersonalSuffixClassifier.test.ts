/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { ClassificationsMatchMap } from "mailwoman/core"
import test from "tape"
import { PersonalSuffixClassifier } from "./PersonalSuffixClassifier.js"

const classifier = await new PersonalSuffixClassifier().ready()

const valid = ["junior", "jr", "senior", "sr"]

for (const token of valid) {
	test(`classify: ${token}`, (t) => {
		const span = classifier.classify(token)

		t.same(span.classifications, ClassificationsMatchMap.from("personal_suffix"))

		t.end()
	})
}
