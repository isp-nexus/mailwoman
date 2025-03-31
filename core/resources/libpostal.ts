/**
 * @copyright Sister Software
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { Alpha2LanguageCode } from "mailwoman/core/resources/languages"
import { TextNormalizer, TextNormalizerInit } from "mailwoman/core/tokenization"
import { resourceDictionaryPathBuilder } from "mailwoman/sdk/repo"
import { readdir } from "node:fs/promises"
import { availableParallelism } from "node:os"
import { PathBuilder } from "path-ts"
import pluralize from "pluralize"
import { TextSpliterator } from "spliterator"
import { takeAsync } from "./collections.js"
import { tryStat } from "./fs.js"
import { LocaleIndex } from "./LocaleIndex.js"

const batchSize = availableParallelism()
const libPostalDataDirectory = resourceDictionaryPathBuilder("libpostal")
const libPostalInternalDataDirectory = resourceDictionaryPathBuilder("internal", "libpostal")

export type LibPostalLanguageCode = Alpha2LanguageCode | "all"

export const availableLanguages = await readdir(libPostalDataDirectory).then((directories) => {
	const languageCodeDirectories = new Set<string>()

	for (const directory of directories) {
		if (directory.includes(".")) continue

		languageCodeDirectories.add(directory)
	}

	return Array.from(languageCodeDirectories) as LibPostalLanguageCode[]
})

export interface LibPostalFileEntry {
	filePath: string
	languageCode: LibPostalLanguageCode
}

/**
 * Given a filename and a list of selected language codes, return all matching files.
 *
 * @param filename The name of the file to search for.
 * @param dataDirectory The directory to search in.
 * @param languageCodes An iterable of language codes to search for.
 *
 * @returns A list of file paths and their corresponding language codes.
 */
async function* findFilesMatchingLocale(
	filename: string,
	dataDirectory: PathBuilder,
	languageCodes: LibPostalLanguageCode[]
) {
	for (const languageCode of languageCodes) {
		const filePath = dataDirectory(languageCode, filename).toString()
		const stats = await tryStat(filePath)

		if (!stats) continue
		const entry: LibPostalFileEntry = { filePath, languageCode }

		yield entry
	}
}

interface LibPostalNormalizerInit extends TextNormalizerInit {
	pluralize?: boolean
}

/**
 * Load a dictionary file.
 */
export async function prepareLocaleIndex(
	/**
	 * An iterable of language codes
	 */
	languageCodes: LibPostalLanguageCode[] = availableLanguages,
	filename: string,
	options?: LibPostalNormalizerInit
): Promise<LocaleIndex<LibPostalLanguageCode>> {
	const normalizer = new TextNormalizer(options)
	const index = new LocaleIndex<LibPostalLanguageCode>([], {
		displayName: "libpostal",
		normalizer,
	})

	let inserted = false

	const fileEntries = takeAsync(findFilesMatchingLocale(filename, libPostalDataDirectory, languageCodes), batchSize)

	for await (const batch of fileEntries) {
		await Promise.all(
			batch.map(async ({ filePath, languageCode }) => {
				const lines = TextSpliterator.fromAsync(filePath)

				for await (const line of lines) {
					for (const entry of TextSpliterator.from(line, { delimiter: "|" })) {
						index.add(entry, languageCode)
						inserted = true
					}
				}
			})
		)
	}

	const internalFileEntries = takeAsync(
		findFilesMatchingLocale(filename, libPostalInternalDataDirectory, languageCodes),
		batchSize
	)

	for await (const batch of internalFileEntries) {
		await Promise.all(
			batch.map(async ({ filePath, languageCode }) => {
				const lines = TextSpliterator.fromAsync(filePath)

				for await (const line of lines) {
					if (!line) continue

					const firstCharacter = line[0]
					// Skip comments.
					if (firstCharacter === "#") continue

					if (firstCharacter === "!") {
						for (const entry of TextSpliterator.from(line.slice(1), { delimiter: "|" })) {
							index.remove(entry)
						}

						continue
					}

					for (const entry of TextSpliterator.from(line, { delimiter: "|" })) {
						index.add(entry, languageCode)
						inserted = true
					}
				}
			})
		)
	}

	if (index.size === 0 && !inserted) {
		throw new Error(
			`No index matches found for ${filename} in ${libPostalDataDirectory} for languages ${languageCodes}`
		)
	}

	if (options?.pluralize) {
		generatePlurals(index)
	}

	return index
}

/**
 * Generate plurals for the index.
 */
export function generatePlurals(index: LocaleIndex<LibPostalLanguageCode>) {
	for (const [singularCell, value] of index) {
		if (!value.has("en")) continue

		const plural = pluralize(singularCell)

		index.add(plural, "en")
	}
}
