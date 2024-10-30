/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { Classification } from "./Classification.js"

export class OrdinalClassification extends Classification {
	public override readonly label = "ordinal"
}

export default OrdinalClassification
