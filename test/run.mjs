/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import FastGlob from "fast-glob"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import tape from "tape"
import * as common from "./common.js"

/**
 * The directory path of the current file, post-compilation.
 */
const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRootPath = resolve(__dirname, "..")
const functionTestsDirectory = join(repoRootPath, "test")

/**
 * @type {string}
 */
const suiteArg = process.argv[2] || ""

/**
 * @type {string[]}
 */
const ignorePatterns = ["**/node_modules/**"]

/**
 * @type {string[]}
 */
const testFilePatterns = []

switch (suiteArg) {
	case "unit":
		testFilePatterns.push(resolve(repoRootPath, "**/*.test.js"))
		ignorePatterns.push(resolve(functionTestsDirectory, "**"))
		break
	case "func":
		testFilePatterns.push(resolve(functionTestsDirectory, "**/*.test.js"))
		break
	case "oa":
		testFilePatterns.push(resolve(functionTestsDirectory, "openaddresses.js"))
		break
	case "":
		testFilePatterns.push(resolve(repoRootPath, "**/*.test.js"))
		break
	default:
		throw new Error(`Unknown test suite: ${suiteArg}`)
}

const testFiles = await FastGlob(testFilePatterns, {
	ignore: ignorePatterns,
}).then((files) => files.map((file) => file.slice(repoRootPath.length + 1)))

console.log(`Running ${testFiles.length} tests...`)

for (const testFile of testFiles) {
	const modulePath = join("mailwoman", testFile)
	// const testModule = require(modulePath)
	const testModule = await import(modulePath)

	if (typeof testModule.all !== "function") {
		console.warn(`Skipping ${modulePath} (no 'all' function)`)
		continue
	}

	const response = testModule.all(tape, common)

	if (response instanceof Promise) {
		await response.catch((error) => {
			console.error(modulePath, error)
			process.exit(1)
		})
	}
}
