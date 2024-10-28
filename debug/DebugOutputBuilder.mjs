/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import chalk from "chalk"
import { performance } from "node:perf_hooks"
import { format, inspect } from "node:util"
import AddressParser from "../parser/AddressParser.js"
import Span from "../tokenization/Span.js"
import Tokenizer from "../tokenization/Tokenizer.js"

/**
 * Generates ansi color-coded debugging output from a postal address.
 */
export class DebugOutputBuilder {
	/**
	 * @type {string[]}
	 */
	sb = []
	/**
	 * @param {string | object} data
	 */
	write = (data) => {
		if (typeof data === "object") {
			this.sb.push(inspect(data, { colors: true }))
		} else {
			this.sb.push(data)
		}
	}

	toString() {
		return this.sb.join("")
	}

	/**
	 * @param {...(string | object)} lines
	 */
	writeLine(...lines) {
		if (lines) {
			lines.forEach(this.write)
		}

		this.write("\n")
	}

	/**
	 * @param {Tokenizer} tokenizer
	 * @param {string} label
	 */
	tokenizer(tokenizer, label) {
		/**
		 * @param {string} title
		 * @param {Span[]} s
		 */
		const spans = (title, s) => {
			this.write(title.padEnd(32) + "➜  ")

			if (s.length === 0) {
				this.writeLine()
			}

			for (const [i, span] of s.entries()) {
				this.write(
					chalk.bgBlue.bold(format(" %s ", span.body)) +
						chalk.bgWhite.bold.gray(format(" %d:%d ", span.start, span.end))
				)

				if (i === s.length - 1) {
					this.writeLine()
				} else {
					this.write(" ")
				}
			}
		}

		this.writeLine()
		this.writeLine("=".repeat(64))
		this.writeLine(`TOKENIZATION ${label}`)
		this.writeLine("-".repeat(64))

		this.write("INPUT".padEnd(32) + "➜  ")
		this.writeLine(tokenizer.span.body)

		spans("SECTIONS", tokenizer.section)

		for (const [i, section] of tokenizer.section.entries()) {
			spans(format("S%d TOKENS", i), section.graph.findAll("child"))
		}

		for (const [i, section] of tokenizer.section.entries()) {
			spans(format("S%d PHRASES", i), section.graph.findAll("phrase"))
		}

		this.writeLine()
	}

	/**
	 * Print word classifications
	 *
	 * @param {Tokenizer} tokenizer
	 * @param {string} [_label]
	 */
	wordClassifications(tokenizer, _label) {
		this.writeLine("-".repeat(64))
		this.writeLine("WORDS")
		this.writeLine("-".repeat(64))

		for (const section of tokenizer.section) {
			const children = section.graph.findAll("child")

			for (const word of children) {
				const keys = Object.keys(word.classifications)

				if (!keys.length) continue

				this.write(word.body.padEnd(32) + "➜  ")

				for (const [key, classification] of Object.entries(word.classifications)) {
					let block = chalk.bgGreen.bold(format(" %s ", classification.label))

					block += chalk.bgWhite.bold.gray(format(" %s ", classification.confidence.toFixed(2)))

					this.write(block)

					if (key !== keys[keys.length - 1]) {
						this.write(" ")
					}
				}

				this.writeLine()
			}
		}

		this.writeLine()
	}

	/**
	 * Print phrase classifications
	 *
	 * @param {Tokenizer} tokenizer
	 * @param {string} [_label]
	 */
	phraseClassifications(tokenizer, _label) {
		this.writeLine("-".repeat(64))
		this.writeLine("PHRASES")
		this.writeLine("-".repeat(64))

		for (const section of tokenizer.section) {
			const phrases = section.graph.findAll("phrase")

			for (const phrase of phrases) {
				const keys = Object.keys(phrase.classifications)

				if (!keys.length) continue

				this.write(phrase.body.padEnd(32) + "➜  ")

				for (const [key, classification] of Object.entries(phrase.classifications)) {
					let block = chalk.bgRed.bold(format(" %s ", classification.label))

					block += chalk.bgWhite.bold.gray(format(" %s ", classification.confidence.toFixed(2)))

					this.write(block)

					if (key !== keys[keys.length - 1]) {
						this.write(" ")
					}
				}
				this.writeLine()
			}
		}

		this.writeLine()
	}

	/**
	 * @param {Tokenizer} tokenizer
	 * @param {string} label
	 */
	classifications(tokenizer, label) {
		this.writeLine("=".repeat(64))
		this.writeLine(`CLASSIFICATIONS ${label}`)

		this.wordClassifications(tokenizer, label)
		this.phraseClassifications(tokenizer, label)
	}

	/**
	 * @param {Tokenizer} tokenizer
	 * @param {string} label
	 */
	solutions(tokenizer, label) {
		this.writeLine("=".repeat(64))
		this.writeLine(`SOLUTIONS ${label}`)
		this.writeLine("-".repeat(64))

		// Print all solutions
		tokenizer.solution.forEach((s) => {
			const score = chalk.yellow.bold("(" + s.score.toFixed(2) + ")")
			this.writeLine(
				score,
				" ➜ ",
				s.pair.map((c) => {
					return {
						[c.classification.label]: c.span.body,
						// offset: c.span.start
					}
				})
			)
			this.writeLine()
		})
	}

	/**
	 * Parse a formatted address string.
	 *
	 * @param {string} input
	 */
	parse(input) {
		performance.mark("start-tokenizer")
		const t = new Tokenizer(input)
		performance.mark("end-tokenizer")

		const tokenizerMeasure = performance.measure("Tokenizer", "start-tokenizer", "end-tokenizer")

		this.tokenizer(t, format("(%sms)", tokenizerMeasure.duration.toFixed(2)))

		const parser = new AddressParser()

		performance.mark("start-classify")
		parser.classify(t)

		performance.mark("end-classify")

		const classifyMeasure = performance.measure("Classify", "start-classify", "end-classify")

		this.classifications(t, format("(%sms)", classifyMeasure.duration.toFixed(2)))

		performance.mark("start-solve")
		parser.solve(t)
		performance.mark("end-solve")

		const solveMeasure = performance.measure("Solve", "start-solve", "end-solve")

		this.solutions(t, format("(%sms)", solveMeasure.duration.toFixed(2)))

		return this
	}
}
