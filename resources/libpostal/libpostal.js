/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const fs = require("node:fs")
const path = require("node:path")
const pluralize = require("pluralize")
const pelias = require("../pelias/pelias")
const custom = require("../custom/custom")
const dictPath = path.join(__dirname, "./dictionaries")
const allLanguages = fs.readdirSync(dictPath).filter((p) => !p.includes("."))

/**
 * @typedef {object} Cell
 * @property {Record<string, boolean>} langs
 *
 * @typedef {Record<string, Cell>} Index
 *
 * @typedef {object} NormalizeOptions
 * @property {RegExp[]} [replace]
 * @property {number} [minlength]
 * @property {boolean} [lowercase]
 */

/**
 * @param {Index} index
 * @param {string[]} langs
 * @param {string} filename
 * @param {any} options
 */
function load(index, langs, filename, options) {
	const add = _add(index, options)
	const remove = _remove(index, options)

	langs.forEach((lang) => {
		const filepath = path.join(dictPath, lang, filename)
		if (!fs.existsSync(filepath)) {
			return
		}
		const dict = fs.readFileSync(filepath, "utf8")

		dict.split("\n").forEach((row) => {
			row.split("|").forEach((cell) => add(lang, cell))
		})
	})

	langs.forEach((lang) => {
		pelias.load(path.join("libpostal", lang, filename), add.bind(null, lang), remove)
	})

	langs.forEach((lang) => {
		custom.load(path.join("libpostal", lang, filename), add.bind(null, lang), remove)
	})
}

/**
 * @param {string} cell
 * @param {NormalizeOptions} options
 *
 * @returns {string}
 */
function _normalize(cell, options) {
	let value = cell.trim()

	if (options && options.replace) {
		value = value.replace(options.replace[0], options.replace[1])
	}
	if (options && options.minlength) {
		if (value.length < options.minlength) {
			return ""
		}
	}
	if (options && options.lowercase) {
		value = value.toLowerCase()
	}
	return value
}

/**
 * @param {Index} index
 * @param {NormalizeOptions} options
 *
 * @returns {(lang: string, cell: string) => void}
 */
function _add(index, options) {
	return (lang, cell) => {
		const value = _normalize(cell, options)
		if (value && value.length) {
			index[value] = index[value] || { langs: {} }
			index[value].langs[lang] = true
		}
	}
}

/**
 * @param {Index} index
 * @param {NormalizeOptions} options
 *
 * @returns {(cell: string) => void}
 */
function _remove(index, options) {
	return (cell) => {
		const value = _normalize(cell, options)
		if (value && value.length) {
			delete index[value]
		}
	}
}

// This functionality is only currently available for English
// see: https://github.com/plurals/pluralize
// @todo: find similar libraries which cover other languages
/**
 * @param {Record<string, Cell>} index
 */
function generatePlurals(index) {
	for (const [cell, value] of Object.entries(index)) {
		if (!value.langs.en) continue

		const plural = pluralize(cell)
		index[plural] = index[plural] || { langs: {} }
		index[plural].langs.en = true
	}
}

module.exports.load = load
module.exports.languages = allLanguages
module.exports.generatePlurals = generatePlurals
