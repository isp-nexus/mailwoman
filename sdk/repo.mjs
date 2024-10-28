/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createPathBuilderResolver } from "path-ts"

/**
 * Aliased path to the root of the repository.
 *
 * @typedef {"mailwoman"} RepoRootAlias
 */

/**
 * Compiled directory name for TS output files.
 */
export const OutDirectoryName = "out"

/**
 * @typedef {"out"} OutDirectoryName
 */

/**
 * The directory path of the current file, post-compilation.
 */
// eslint-disable-next-line jsdoc/valid-types
const __dirname = /** @type {import("path-ts").Join<[RepoRootAlias, ...OutDirectoryName, "sdk"], "/">} */ (
	dirname(fileURLToPath(import.meta.url))
)

const PathReflection = /** @type {const} */ (["mailwoman", OutDirectoryName, "sdk"])

/**
 * The absolute path to the root of the repository.
 */
const RepoRootAbsolutePath = /** @type {RepoRootAlias} */ (resolve(__dirname, ...PathReflection.map(() => "..")))

/**
 * Path builder relative to the repo root.
 */
export const repoRootPathBuilder = createPathBuilderResolver(RepoRootAbsolutePath)

/**
 * Absolute path to the test directory.
 */
export const functionTestsDirectory = repoRootPathBuilder("test")
