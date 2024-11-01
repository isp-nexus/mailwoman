/**
 * @copyright Sister Software
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import test from "tape"
import { WhosOnFirstClassifier } from "./WhosOnFirstClassifier.js"

const classifier = await new WhosOnFirstClassifier().ready()

for (const token of ["new york", "london", "paris", "berlin", "bern", "tokyo"]) {
	test(`locality: ${token}`, (t) => {
		const span = classifier.classify(token)
		t.true(span.is("locality"))
		t.true(span.is("area"))
		t.end()
	})
}

for (const token of ["nyc", "sf"]) {
	test(`valid internal locality: ${token}`, (t) => {
		const span = classifier.classify(token)
		t.true(span.is("locality"))
		t.true(span.is("area"))
		t.end()
	})
}

const invalid = ["texas", "california", "italy"]

for (const token of invalid) {
	test(`invalid internal locality: ${token}`, (t) => {
		const span = classifier.classify(token)
		t.false(span.is("locality"))
		t.end()
	})
}
