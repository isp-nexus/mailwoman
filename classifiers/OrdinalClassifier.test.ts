/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { ClassificationsMatchMap } from "mailwoman/core"
import test from "tape"
import { OrdinalClassifier } from "./OrdinalClassifier.js"

const classifier = new OrdinalClassifier()

test("English: single digit", (t) => {
	const span = classifier.classify("1st")
	t.same(span.classifications, ClassificationsMatchMap.from("ordinal"))
	t.end()
})

test("English: multiple digits", (t) => {
	const span = classifier.classify("250th")
	t.same(span.classifications, ClassificationsMatchMap.from("ordinal"))
	t.end()
})

test("English: single digit", (t) => {
	const span = classifier.classify("1rd")
	t.equal(span.classifications.size, 0)
	t.end()
})

test("English: multiple digits", (t) => {
	const span = classifier.classify("250nd")
	t.equal(span.classifications.size, 0)
	t.end()
})
