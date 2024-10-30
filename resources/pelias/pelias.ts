/**
 * @copyright OpenISP, Inc.
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { resourceDictionaryPathBuilder } from "mailwoman/sdk/repo"
import { createResourceLoader } from "../helper.js"

const dictPath = resourceDictionaryPathBuilder("pelias")

export const load = createResourceLoader(dictPath)
