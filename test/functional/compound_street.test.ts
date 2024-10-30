/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { assert } from "mailwoman/sdk/test/utils"
// street simple
assert("Foostraße", [{ street: "Foostraße" }])

// should not attach a second suffix
assert("Foostraße Rd", [{ street: "Foostraße" }])
assert("foo st and", [{ street: "foo st" }])

// address simple
assert("Foostraße 1", [{ street: "Foostraße" }, { housenumber: "1" }])
