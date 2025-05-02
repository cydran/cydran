import AbstractTask from "../AbstractTask.js";
import { ESLint, Linter } from "eslint";
import path from 'path';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as typescriptEslintParser from "@typescript-eslint/parser";

class EsLintTask extends AbstractTask<any> {

	constructor() {
		super("EsLintTask");
	}

	public async execute(): Promise<void> {
		await this.lint("src");

		// TODO - Support linting test files
//		await this.lint("test");
	}

	private async lint(directoryName: string): Promise<void> {
		const targetDirectory: string = path.join(this.getConfig().getEnvironment().getRootPath(), directoryName);
		const tsConfigPath = path.join(this.getConfig().getEnvironment().getRootPath(), "tsconfig.json");

		const config: Linter.Config<Linter.RulesRecord>[] = tseslint.config(
			eslint.configs.recommended,
			tseslint.configs.recommended,
			{
				languageOptions: {
					"parser": typescriptEslintParser,
					"parserOptions": {
						"ecmaVersion": "latest",
						"sourceType": "script",
						"project": tsConfigPath
					},
				},
				// "plugins": [typescriptEslintPlugin],
				files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
				rules: {
					"@typescript-eslint/no-explicit-any": "off",
					"@typescript-eslint/no-unused-vars": "off",
					"@typescript-eslint/ban-types": "off",
					"@typescript-eslint/no-this-alias": "off",
					"@typescript-eslint/no-unsafe-function-type": "off",
					"@typescript-eslint/no-wrapper-object-types": "off",
					"@typescript-eslint/no-empty-object-type": "off",
					"no-useless-escape": "off",
					"no-mixed-spaces-and-tabs": "off",
					"no-case-declarations": "off",
					"no-prototype-builtins": "off",
					"prefer-rest-params": "off",
					"no-fallthrough": "off",
					"prefer-spread": "off",
					"prefer-const": "off"
				}
			}
		) as Linter.Config<Linter.RulesRecord>[];

		const params: ESLint.Options = {
			cwd: targetDirectory,
			overrideConfigFile: true,
			overrideConfig: config
		};

		try {
			const eslint = new ESLint(params);
			const results = await eslint.lintFiles(["."]);
			const formatter = await eslint.loadFormatter("stylish");
			const resultText = formatter.format(results);
			console.log(resultText);

			if (results.filter(result => result.errorCount > 0).length > 0) {
				process.exit(1);
			}
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
	}

}

export default EsLintTask;
