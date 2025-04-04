/**
 * @copyright Sister Software
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { assert } from "mailwoman/sdk/test"

assert(
	// ---
	"Air & Space Museum Washington DC",
	{
		// ---
		venue: ["Air & Space Museum"],
		locality: ["Washington"],
		region: ["DC"],
	}
)

assert(
	// ---
	"Empire State Building NYC",
	{
		// ---
		venue: ["Empire State Building"],
		locality: ["NYC"],
	}
)

// checking that NAME INITIAL NAME works
assert(
	// ---
	"Donald W Reynolds Stadium",
	{
		// ---
		venue: ["Donald W Reynolds Stadium"],
	}
)

assert(
	// ---
	"Donald W. Reynolds Stadium",
	{ venue: ["Donald W. Reynolds Stadium"] }
)

// checking that "japan" is interpreted as a country, not a city
assert(
	// ---
	"Universal Studios Japan",
	{
		// ---
		venue: ["Universal Studios"],
		country: ["Japan"],
	}
)

// checking that "art" is not interpreted as a street suffix
assert(
	// ---
	"philadelphia museum of art",
	{
		// ---
		venue: ["philadelphia museum of art"],
	}
)
