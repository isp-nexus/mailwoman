/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import test from "tape"
import { StreetSuffixClassification as Classification } from "./StreetSuffixClassification.js"

test("constructor", (t) => {
	const c = new Classification()
	t.false(c.public)
	t.equals(c.label, "street_suffix")
	t.equals(c.confidence, 1.0)
	t.deepEqual(c.meta, {})
	t.end()
})
