/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { stat } from "node:fs/promises"
import { PathBuilderLike } from "path-ts"

/**
 * Check if a file or directory exists.
 */
export function checkIfExists(pathBuilderLike: PathBuilderLike): Promise<boolean> {
	return stat(pathBuilderLike)
		.then(() => true)
		.catch(() => false)
}
