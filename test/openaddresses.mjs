/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 *
 *   Openaddresses test runner
 *
 *   To use this test suite:
 *
 *   1. Download a zip file from the 'results.openaddresses.io' site
 *   2. Create a subdirectory inside 'test' called 'oa' (ie. 'test/oa')
 *   3. Unzip the contents of the zip file into the directory
 *   4. Execute the suite with 'npm test oa'
 */

import { parse } from "csv-parse/sync"
import FastGlob from "fast-glob"
import { AddressParser, Tokenizer } from "mailwoman"
import { functionTestsDirectory } from "mailwoman/sdk/repo"
import { readFileSync } from "node:fs"

/**
 * @type {import("csv-parse").Options}
 */
const options = {
	trim: true,
	skip_empty_lines: true,
	relax_column_count: true,
	relax_quotes: true,
	columns: true,
}

// {
//   LON: '171.251359',
//     LAT: '-44.0831092',
//       NUMBER: '8',
//         STREET: 'Ash Drive',
//           UNIT: '',
//             CITY: 'Geraldine',
//               DISTRICT: 'Geraldine',
//                 REGION: '',
//                   POSTCODE: '',
//                     ID: '2099969',
//                       HASH: 'c97860ebc8b12d3e'
// },

const parser = new AddressParser()

/**
 * @typedef {"LON"
 * 	| "LAT"
 * 	| "NUMBER"
 * 	| "STREET"
 * 	| "UNIT"
 * 	| "CITY"
 * 	| "DISTRICT"
 * 	| "REGION"
 * 	| "POSTCODE"
 * 	| "ID"
 * 	| "HASH"} OpenAddressesColumnName
 *
 *
 * @typedef {Record<OpenAddressesColumnName, string>} OpenAddressesRow
 *
 * @typedef {"housenumber" | "street" | "postcode"} AddressComponent
 *
 * @typedef {Record<AddressComponent, string | undefined>} ExtractedAddress
 */

/**
 * @param {OpenAddressesRow} row
 *
 * @returns {ExtractedAddress} Extracted address components
 */
function extract({ NUMBER, STREET, POSTCODE }) {
	/**
	 * @type {[AddressComponent, string][]}
	 */
	const entries = [
		["housenumber", NUMBER],
		["street", STREET],
		["postcode", POSTCODE],
	]
		.map(([k, v]) => {
			return /** @type {[AddressComponent, string]} */ ([k, (typeof v === "string" ? v : "").trim()])
		})

		.filter(([, v]) => Boolean(v))

	return Object.fromEntries(entries)
}

/**
 * @param {import("tape").Test} t
 * @param {Record<string, string>} ext
 */
function assert(t, ext) {
	const text = Object.keys(ext)
		.map((k) => ext[k])
		.join(" ")
	const expected = Object.keys(ext).map((k) => {
		return { [k]: ext[k] }
	})

	const tokenizer = new Tokenizer(text)
	parser.classify(tokenizer)
	parser.solve(tokenizer)

	t.deepEquals(
		tokenizer.solution.map((solution) =>
			solution.pair.map((c) => {
				return { [c.classification.label]: c.span.body }
			})
		)[0],
		expected,
		text
	)

	return text
}

/**
 * Run all openaddresses tests
 *
 * @param {import("tape")} tape
 */
export async function all(tape) {
	// find all files ending in .test.js
	const openAddressesFiles = await FastGlob(functionTestsDirectory("oa/**/*.csv").toString()).then(($) =>
		$.map((file) => file.slice(functionTestsDirectory.length + 1))
	)

	for (const csvpath of openAddressesFiles) {
		const suite = csvpath.replace(functionTestsDirectory.toString(), "")
		const contents = readFileSync(csvpath)
		/**
		 * @type {Record<string, string>[]}
		 */
		const rows = parse(contents, options)

		tape(`oa: ${suite}`, (t) => {
			let prev = ""

			for (const row of rows) {
				const ext = extract(row)
				const hash = Object.keys(ext)
					.map((k) => ext[k])
					.join(",")

				if (hash === prev) {
					return
				}
				prev = hash
				assert(t, ext)
			}

			t.end()
		})
	}
}
