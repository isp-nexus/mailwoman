/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { Classification } from "./Classification.js"

export class MultiStreetClassification extends Classification {
	public override readonly label = "multistreet"
	public override readonly public = false
}

export default MultiStreetClassification
