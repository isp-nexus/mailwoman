/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const testcase = (test, common) => {
	const assert = common.assert(test)

	assert("Divadelná 41/3, Trnava", [{ street: "Divadelná" }, { housenumber: "41/3" }, { locality: "Trnava" }])
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`address SVK: ${name}`, testFunction)
	}

	testcase(test, common)
}
