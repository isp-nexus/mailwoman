/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

/**
 * A resource with a display name.
 */
export interface Displayable {
	displayName?: string
}

export type WithDisplayable<T> = T & Displayable

/**
 * Type predicate to determine if a value is displayable.
 */
export function isDisplayable(value: unknown): value is Displayable {
	return typeof value === "object" && value !== null && "displayName" in value
}
