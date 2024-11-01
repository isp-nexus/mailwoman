/**
 * @copyright Sister Software
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

import { createESLintPackageConfig } from "@sister.software/eslint-config"
import html from "eslint-plugin-html"

// @ts-check

/**
 * ESLint configuration for the Mailwoman repo
 */
const MailwomanESLintConfig = createESLintPackageConfig({
	packageTitle: "Mailwoman",
	spdxLicenseIdentifier: "AGPL-3.0",

	overrides: {
		plugins: { html },
		rules: {
			"guard-for-in": "error",
			"@typescript-eslint/no-explicit-any": "error",
			"jsdoc/require-property-description": "off",
			"jsdoc/require-returns-description": "off",
			"jsdoc/require-param-description": "off",
			"jsdoc/require-yields": "off",
		},
	},
})

export default MailwomanESLintConfig
