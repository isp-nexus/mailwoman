/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const fs = require("node:fs")
const path = require("node:path")

function generateFilenames(directory, filenames) {
	return filenames.reduce((acc, filename) => {
		if (filename.indexOf("*") < 0) {
			acc.push(filename)
			return acc
		} else if (!fs.existsSync(directory)) {
			return acc
		}
		// We use a UNIX synthax in our classifier, so we need to transform this in to a JS RegExp
		const regex = new RegExp(filename.replace("*", ".*"))

		return acc.concat(fs.readdirSync(directory).filter((f) => regex.test(f)))
	}, [])
}

function singleResourceLoader(filepath, add, remove) {
	if (!fs.existsSync(filepath)) {
		return
	}
	const dict = fs.readFileSync(filepath, "utf8")
	dict.split("\n").forEach((row) => {
		if (row.trim().startsWith("#")) {
			// Do nothing, this is a comment
		} else if (row.startsWith("!")) {
			row.substring(1).split("|").forEach(remove)
		} else {
			row.split("|").forEach(add)
		}
	})
}

function multiResourceLoader({ directory, filenames }, add, remove) {
	generateFilenames(directory, filenames).forEach((filename) => {
		const filepath = path.join(directory, filename)
		singleResourceLoader(filepath, add, remove)
	})
}

function resourceLoader(dictPath) {
	return (opts, add, remove) => {
		if (typeof opts === "string") {
			const filename = path.join(dictPath, opts)
			return singleResourceLoader(filename, add, remove)
		}
		const directory = path.join(dictPath, opts.directory)
		multiResourceLoader({ directory, filenames: opts.filenames }, add, remove)
	}
}

module.exports.generateFilenames = generateFilenames
module.exports.resourceLoader = resourceLoader
