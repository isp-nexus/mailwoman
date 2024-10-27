/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const testcase = (test, common) => {
	const assert = common.assert(test)

	assert("Carrer d'Aragó 155 08011 Barcelona", [
		{ street: "Carrer d'Aragó" },
		{ housenumber: "155" },
		{ postcode: "08011" },
		{ locality: "Barcelona" },
	])
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`address ESP: ${name}`, testFunction)
	}

	testcase(test, common)
}
