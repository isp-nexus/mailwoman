/**
 * @copyright Sister Software
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { ClassificationsMatchMap } from "mailwoman/core"
import test from "tape"
import { LevelDesignatorClassifier } from "./LevelDesignatorClassifier.js"

const classifier = await new LevelDesignatorClassifier().ready()

for (const token of ["fl", "floor"]) {
	test(`english level types: ${token}`, (t) => {
		const span = classifier.classify(token)

		t.same(span.classifications, ClassificationsMatchMap.from("level_designator"))

		t.end()
	})
}
