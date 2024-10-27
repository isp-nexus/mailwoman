/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const testcase = (test, common) => {
	const assert = common.assert(test)

	assert("Zadarska 17, Pula", [{ street: "Zadarska" }, { housenumber: "17" }, { locality: "Pula" }])
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`address HRV: ${name}`, testFunction)
	}

	testcase(test, common)
}
