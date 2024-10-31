/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { Classification } from "../classification/Classification.js"

export class PlaceClassification extends Classification {
	public override readonly label = "place"
}

export default PlaceClassification