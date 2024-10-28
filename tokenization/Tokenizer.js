/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const Span = require("./Span")
const split = require("./split")
const funcs = require("./split_funcs")
const permutate = require("./permutate")

class Tokenizer {
	/**
	 * @param {string} input
	 */
	constructor(input) {
		this.span = new Span(input)
		/**
		 * Sections of the tokenization.
		 *
		 * @type {Span[]}
		 */
		this.section = split(this.span, funcs.fieldsFuncBoundary)

		/**
		 * Percentage of the input text covered by the tokenization.
		 *
		 * @type {number}
		 */
		this.coverage = 0

		this.split()
		this.computeCoverage()
		this.permute(0, 10)

		/**
		 * Solutions to the tokenization.
		 *
		 * @type {import("../solver/Solution")[]} solution
		 */
		this.solution = []
	}

	/**
	 * Split the tokenization into sections.
	 */
	split() {
		for (const section of this.section) {
			section.setChildren(split(section, funcs.fieldsFuncWhiteSpace))
			section.setChildren(split(section, funcs.fieldsFuncHyphenOrWhiteSpace))
		}
	}

	/**
	 * Permute the phrases of the tokenization.
	 *
	 * @param {number} windowMin
	 * @param {number} windowMax
	 */
	permute(windowMin, windowMax) {
		for (const section of this.section) {
			section.setPhrases(permutate(section.graph.findAll("child"), windowMin, windowMax))
		}
	}

	/**
	 * Compute the coverage of the tokenization.
	 *
	 * @param {number} sum
	 * @param {Span | null} curr
	 *
	 * @returns {number}
	 */
	computeCoverageRec(sum, curr) {
		if (!curr) {
			return sum
		}

		return this.computeCoverageRec(sum + curr.end - curr.start, curr.graph.findOne("next"))
	}

	/**
	 * Compute the coverage of the tokenization.
	 *
	 * @returns {void}
	 */
	computeCoverage() {
		this.coverage = 0

		this.section.forEach((s) => {
			this.coverage += this.computeCoverageRec(0, s.graph.findOne("child"))
		}, this)
	}
}

module.exports = Tokenizer
