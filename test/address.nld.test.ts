/**
 * @copyright Sister Software
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { assert } from "mailwoman/sdk/test"

assert(
	// ---
	"Julianastraat, Heel",
	{
		// ---
		street: ["Julianastraat"],
		locality: ["Heel"],
	}
)

assert(
	// ---
	"Lindenlaan, Sint Odilienberg",
	{
		// ---
		street: ["Lindenlaan"],
		locality: ["Sint Odilienberg"],
	}
)

assert(
	// ---
	"Bosserdijk, Hoogland",
	{
		// ---
		street: ["Bosserdijk"],
		locality: ["Hoogland"],
	}
)

assert(
	// ---
	"Rubicondreef, Utrecht",
	// ---
	{ street: ["Rubicondreef"], locality: ["Utrecht"] }
)

assert(
	// ---
	"St Ludgerusstraat, Utrecht",
	{
		// ---
		street: ["Ludgerusstraat"],
		locality: ["Utrecht"],
	}
)

assert(
	// ---
	"Lange Groenendaal, Gouda",
	{
		// ---
		street: ["Lange Groenendaal"],
		locality: ["Gouda"],
	}
)

assert(
	// ---
	"Achter Clarenburg, Utrecht",
	{
		// ---
		street: ["Achter Clarenburg"],
		locality: ["Utrecht"],
	}
)

assert(
	// ---
	"Rozenburg",
	{ locality: ["Rozenburg"] },
	{ street: ["Rozenburg"] }
)

assert(
	// ---
	"Bloemendaal",
	{ locality: ["Bloemendaal"] },
	{ street: ["Bloemendaal"] }
)

assert(
	// ---
	"Brinkstraat 87, 7512EC, Enschede",
	{
		// ---
		street: ["Brinkstraat"],
		house_number: ["87"],
		postcode: ["7512EC"],
		locality: ["Enschede"],
	}
)

assert(
	// ---
	"Blekerssngl, Gouda",
	{
		// ---
		street: ["Blekerssngl"],
		locality: ["Gouda"],
	}
)

assert(
	// ---
	"Weerdsingel O.Z., Utrecht",
	{
		street: ["Weerdsingel O.Z."],
		locality: ["Utrecht"],
	}
)

assert(
	// ---
	"Oranjelaan Westzijde 41, Puttershoek",
	{
		// ---
		street: ["Oranjelaan Westzijde"],
		house_number: ["41"],
		locality: ["Puttershoek"],
	}
)

assert(
	// ---
	"Rembrandtplein, Amsterdam",
	{
		// ---
		street: ["Rembrandtplein"],
		locality: ["Amsterdam"],
	}
)

assert(
	// ---
	"Korte Tiendeweg, Gouda",
	{
		// ---
		street: ["Korte Tiendeweg"],
		locality: ["Gouda"],
	}
)

assert(
	// ---
	"Burgemeester Martenssingel, Gouda",
	{
		// ---
		street: ["Burgemeester Martenssingel"],
		locality: ["Gouda"],
	}
)

assert(
	// ---
	"Agorabaan, Lelystad",
	{
		// ---
		street: ["Agorabaan"],
		locality: ["Lelystad"],
	}
)

assert(
	// ---
	"1234AB, Amsterdam",
	{
		// ---
		postcode: ["1234AB"],
		locality: ["Amsterdam"],
	}
)

assert(
	// ---
	"Haarlemmerdijk 12, 1234ST, Amsterdam",
	{
		// ---
		street: ["Haarlemmerdijk"],
		house_number: ["12"],
		postcode: ["1234ST"],
		locality: ["Amsterdam"],
	}
)

// Postcode cannot have 'SA', 'SD' or 'SS' alphanumeric sequence
// https://github.com/pelias/parser/issues/145
assert(
	// ---
	"1234SA, Amsterdam",
	{
		// ---
		locality: ["Amsterdam"],
	}
)

// Postcode cannot have 'SA', 'SD' or 'SS' alphanumeric sequence
// https://github.com/pelias/parser/issues/145
assert(
	// ---
	"Haarlemmerdijk 12, 1234SS, Amsterdam",
	{
		// ---
		street: ["Haarlemmerdijk"],
		house_number: ["12"],
		locality: ["Amsterdam"],
	}
)

// First digit cannot be '0'
// https://github.com/pelias/parser/issues/145
assert(
	// ---
	"Haarlemmerdijk 12, 0123AB, Amsterdam",
	{
		// ---
		street: ["Haarlemmerdijk"],
		house_number: ["12"],
		locality: ["Amsterdam"],
	}
)
