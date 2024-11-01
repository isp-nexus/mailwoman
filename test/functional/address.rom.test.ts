/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { assert } from "mailwoman/sdk/test/utils"

assert("Bulevardul Iuliu Maniu, Bucharest", [{ street: "Bulevardul Iuliu Maniu" }, { locality: "Bucharest" }])

assert("Bdul Iuliu Maniu 111 Bucharest", [
	{ street: "Bdul Iuliu Maniu" },
	{ housenumber: "111" },
	{ locality: "Bucharest" },
])

assert("Splaiul Independenței 313", [{ street: "Splaiul Independenței" }, { housenumber: "313" }])

assert("15 Strada Doctor Carol Davila", [{ housenumber: "15" }, { street: "Strada Doctor Carol Davila" }])

assert("Calea Victoriei 54 Bucharest ", [
	{ street: "Calea Victoriei" },
	{ housenumber: "54" },
	{ locality: "Bucharest" },
])
