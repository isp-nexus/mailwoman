/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { DebugOutputBuilder, Tokenizer } from "mailwoman"

/**
 * Parse an address.
 *
 * @type {import("express").RequestHandler}
 */
export function parseRouteHandler(req, res) {
	/**
	 * @type {import("mailwoman").Parser}
	 */
	const parser = req.app.locals.parser.address

	if (typeof req.query.text !== "string") {
		res.status(400).json({ error: "missing `text` query parameter" })
		return
	}

	if (req.query.text.length === 0) {
		res.status(400).json({ error: "`text` query parameter is empty" })
		return
	}

	// input text
	const text = req.query.text

	// tokenizer
	const t = new Tokenizer(text)
	parser.classify(t)
	parser.solve(t)

	// send json
	res.status(200).json({
		input: {
			body: t.span.body,
			start: t.span.start,
			end: t.span.end,
		},
		solutions: t.solution.map(jsonify),
		debug: req.query.debug && new DebugOutputBuilder().parse(text).toString(),
	})
}

/**
 * @param {import("../../solver/Solution.js")} solution
 *
 * @returns {Record<string, any>} JSON representation of a solution
 */
function jsonify(solution) {
	return {
		score: solution.score,
		classifications: solution.pair.map((c) => {
			return {
				label: c.classification.label,
				value: c.span.body,
				// confidence: c.classification.confidence,
				start: c.span.start,
				end: c.span.end,
			}
		}),
	}
}
