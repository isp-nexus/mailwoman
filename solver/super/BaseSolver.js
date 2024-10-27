/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

class BaseSolver {
	constructor() {
		this.setup()
	}

	// you should provide this function in your subclass
	// solve() {}

	// you may optionally provide this function in your subclass
	setup() {}
}

module.exports = BaseSolver
