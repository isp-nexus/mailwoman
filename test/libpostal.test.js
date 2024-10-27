/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const testcase = (test, common) => {
	const assert = common.assert(test)

	// https://github.com/openvenues/libpostal/issues/382
	assert("3360 Grand Ave Oakland 94610-2737 CA", [
		{ housenumber: "3360" },
		{ street: "Grand Ave" },
		{ locality: "Oakland" },
		{ postcode: "94610-2737" },
		{ region: "CA" },
	])
}

module.exports.all = (tape, common) => {
	function test(name, testFunction) {
		return tape(`functional: ${name}`, testFunction)
	}

	testcase(test, common)
}
