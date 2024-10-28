/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 * @member {Function} solve
 * @member {Function} [setup]
 * @interface Solver
 */

/**
 * Base class for all solvers
 *
 * @abstract
 */
class BaseSolver {
	constructor() {
		this.setup?.()
	}

	/**
	 * @abstract
	 * @param {import("../../tokenization/Tokenizer")} tokenizer
	 */
	solve(tokenizer) {}

	// you may optionally provide this function in your subclass
	/**
	 * @abstract
	 * @returns {void}
	 * @optional
	 */
	setup() {}
}

module.exports = BaseSolver
