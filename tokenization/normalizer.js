/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const removeAccents = require("remove-accents")

/**
 * @typedef {object} NormalizerOptions
 * @property {boolean} [lowercase]
 * @property {boolean} [removeAccents]
 * @property {boolean} [removeHyphen]
 * @property {boolean} [removeSpaces]
 */

/**
 * Create a normalizer function.
 *
 * @param {NormalizerOptions} [options]
 */
function normalizer(options = {}) {
	/**
	 * @param {string} value
	 */
	return (value) => {
		value = value.trim()
		if (options.lowercase) {
			value = value.toLowerCase()
		}
		if (options.removeAccents) {
			value = removeAccents(value)
		}
		if (options.removeHyphen) {
			value = value.replace(/-/g, " ")
		}
		if (options.removeSpaces) {
			value = value.replace(/ /g, "")
		}
		return value
	}
}

module.exports = normalizer
