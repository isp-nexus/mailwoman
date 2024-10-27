/**
 * @copyright OpenISP, Inc.
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
	copyrightHolder: "OpenISP, Inc.",
	packageTitle: "Mailwoman",
	spdxLicenseIdentifier: "AGPL-3.0",
	overrides: {
		plugins: { html },
		ignores: [
			// ---
			"**/dist/**",
			"**/*.json",
			"**/out/**",
			"**/node_modules/**",
		],
		rules: {
			"@typescript-eslint/no-require-imports": "off",
			"no-prototype-builtins": "off",
		},
	},
})

export default MailwomanESLintConfig
