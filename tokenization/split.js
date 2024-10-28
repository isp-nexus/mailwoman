/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Span = require("./Span")

/**
 * @param {Span} span
 * @param {(char: string) => boolean} f
 *
 * @returns {Span[]}
 */
function split(span, f) {
	// A span is used to record a slice of s of the form s[start:end].
	// The start index is inclusive and the end index is exclusive.
	const spans = []

	// Find the field start and end indices.
	let wasField = false
	let fromIndex = 0

	// Iterate unicode code points in string
	for (let i = 0; i < span.body.length; i++) {
		const char = span.body.charAt(i)
		if (f(char)) {
			if (wasField) {
				spans.push(
					span.graph
						.findAll("child")
						.find((s) => s.start === span.start + fromIndex && s.body === span.body.substring(fromIndex, i)) ||
						new Span(span.body.substring(fromIndex, i), span.start + fromIndex)
				)
				wasField = false
			}
		} else if (!wasField) {
			fromIndex = i
			wasField = true
		}
	}

	// Last field might end at EOF.
	if (wasField) {
		spans.push(
			span.graph
				.findAll("child")
				.find(
					(s) => s.start === span.start + fromIndex && s.body === span.body.substring(fromIndex, span.body.length)
				) || new Span(span.body.substring(fromIndex, span.body.length), span.start + fromIndex)
		)
	}

	// Add siblings to graph
	Span.connectSiblings(...spans)

	return spans
}

module.exports = split
