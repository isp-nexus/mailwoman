/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import test from "tape"
import { StreetPrefixClassifier } from "./StreetPrefixClassifier.js"

const classifier = await new StreetPrefixClassifier().ready()

test("index: does contain single char tokens", (t) => {
	const singleCharacterTokens = Iterator.from(classifier.index)
		.filter(([token]) => token.length < 2)
		.map(([token, languages]) => [token, Array.from(languages)])
		.toArray()

	t.notDeepEqual(singleCharacterTokens, [], "StreetPrefixClassifier contain single character tokens")
	t.end()
})

const valid = ["rue", "allée", "allee", "avenue", "av", "rt.", "boulevard", "blvd", "blvd."]

valid.forEach((token) => {
	test(`french prefix: ${token}`, (t) => {
		const actual = classifier.classify(token).classifications.get("street_prefix")

		t.true(actual, `"${token}" is classified as a street prefix`)

		t.true(actual?.languages?.has("fr"), `"${token}" is classified as a french street prefix`)

		t.end()
	})
})
