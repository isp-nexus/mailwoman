/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Graph = require("./Graph")
const MAX_SPAN_LENGTH = 140

class Span {
	/**
	 * @param {string} body
	 * @param {number} [start]
	 */
	constructor(body = "", start = 0) {
		this.start = start
		/**
		 * @type {string}
		 */
		this.body = ""

		/**
		 * @type {string}
		 */
		this.norm = ""

		/**
		 * @type {number} The End index of the span
		 */
		this.end = 0

		this.setBody(body)

		/**
		 * @type {Record<string, import("../classification/Classification")>}
		 */
		this.classifications = {}

		/**
		 * @type {Graph<Span>}
		 */
		this.graph = new Graph()
	}

	// update the token body
	/**
	 * Set the body of the Span
	 *
	 * @param {string} body
	 */
	setBody(body = "") {
		this.body = body

		if (this.body.length > MAX_SPAN_LENGTH) {
			this.body = this.body.slice(0, MAX_SPAN_LENGTH)
		}

		this.norm = this.body.toLowerCase() // normalized body
		this.end = this.start + this.body.length

		// convenience booleans to avoid computing these in every classifier
		this.contains = {
			numerals: /\d/.test(this.body),
			final: {
				period: this.body.slice(-1) === ".",
			},
		}
	}

	/**
	 * Predicate to determine if this Span intersects another Span
	 *
	 * @param {Span} span
	 *
	 * @returns {boolean}
	 */
	intersects(span) {
		return this.start < span.end && this.end > span.start
	}

	/**
	 * Predicate to determine if this Span covers another Span
	 *
	 * @param {Span} span
	 *
	 * @returns {boolean}
	 */
	covers(span) {
		return this.start <= span.start && this.end >= span.end
	}

	// returns the distance between two Spans
	// todo: use graph to find prev and next spans for a more accurate result
	// todo: or base 'distance' on word distance (slop) rather than characters
	/**
	 * Returns the distance between two Spans
	 *
	 * @param {Span} span
	 *
	 * @returns {number}
	 */
	distance(span) {
		if (this.intersects(span)) {
			return 0
		}
		if (this.end < span.start) {
			return span.start - this.end
		} // $this is left
		return this.start - span.end // $this is right
	}

	// add a classification for this span
	/**
	 * @param {import("../classification/Classification")} classification
	 *
	 * @returns {Span}
	 */
	classify(classification) {
		const constructorName = classification.constructor.name

		// ensure that duplicate classifications do not reduce confidence
		const existing = Object.hasOwn(this.classifications, constructorName) ? this.classifications[constructorName] : null

		if (existing && existing.confidence >= classification.confidence) {
			return this
		}

		this.classifications[constructorName] = classification

		return this
	}

	/**
	 * Set the children of this Span.
	 *
	 * @param {Span[]} spans
	 *
	 * @returns
	 */
	setChildren(spans) {
		for (const span of spans) {
			this.graph.add("child", span)
		}
		return this
	}

	/**
	 * Set the phrases of this Span.
	 *
	 * @param {Span[]} phrases
	 *
	 * @returns {Span}
	 */
	setPhrases(phrases) {
		phrases.forEach((p) => this.graph.add("phrase", p), this)
		return this
	}

	/**
	 * @param {...Span} spans
	 *
	 * @returns
	 */
	static connectSiblings(...spans) {
		// Supports both var-args and Array as argument
		if (Array.isArray(spans[0])) {
			spans = spans[0]
		}

		for (const [i, span] of spans.entries()) {
			if (spans[i - 1]) {
				span.graph.add("prev", spans[i - 1])
			}

			if (spans[i + 1]) {
				span.graph.add("next", spans[i + 1])
			}
		}

		return spans
	}
}

module.exports = Span
