/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import test from "tape"
import { PersonalTitleClassification as Classification } from "./PersonalTitleClassification.js"

test("constructor", (t) => {
	const c = new Classification()
	t.false(c.public)
	t.equals(c.label, "personal_title")
	t.equals(c.confidence, 1.0)
	t.deepEqual(c.meta, {})
	t.end()
})