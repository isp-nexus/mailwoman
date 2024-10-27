/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const testcase = (test, common) => {
	const assert = common.assert(test)

	// street simple
	assert("Foostraße", [{ street: "Foostraße" }])

	// should not attach a second suffix
	assert("Foostraße Rd", [{ street: "Foostraße" }])
	assert("foo st and", [{ street: "foo st" }])

	// address simple
	assert("Foostraße 1", [{ street: "Foostraße" }, { housenumber: "1" }])
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`compound_street: ${name}`, testFunction)
	}

	testcase(test, common)
}
