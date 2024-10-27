/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const glob = require("glob")
const tape = require("tape")
const common = require("./common")
const suite = process.argv[2] || ["unit", "func"]

// find all files ending in .test.js
const files = glob.sync("**/*.test.js", {
	realpath: true,
	ignore: ["**/node_modules/**"],
})

// unit and functional test predecates
/**
 * @param {string} f
 */
const unit = (f) => !/\/test\//.test(f)
/**
 * @param {string} f
 */
const func = (f) => /\/test\//.test(f)

/**
 * Test runner
 *
 * @param {string} f
 *
 * @returns
 */
const run = (f) => require(f).all(tape, common)

// run unit tests
if (suite.includes("unit")) {
	files.filter(unit).forEach(run)
}

// run functional tests
if (suite.includes("func")) {
	files.filter(func).forEach(run)
}

// run openaddresses tests
if (suite.includes("oa")) {
	require("./openaddresses.js").all(tape)
}
