/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { GivenNameClassification } from "mailwoman/classification"
import test from "tape"
import { Span } from "../tokenization/Span.js"
import GivenNameClassifier from "./GivenNameClassifier.js"

const classifier = new GivenNameClassifier()

test("contains numerals: honours contains.numerals boolean", (t) => {
	const span = new Span("example")
	span.contains.numerals = true
	classifier.each(span)
	t.deepEqual(span.classifications, {})
	t.end()
})

const valid = ["Anderson Luís", "Peter"]

valid.forEach((token) => {
	test(`classify: ${token}`, (t) => {
		const span = classifier.classify(token)
		t.deepEqual(span.classifications, {
			GivenNameClassification: new GivenNameClassification(1.0),
		})
		t.end()
	})
})
