import AbstractTask from "../AbstractTask.js";
import { ESLint, Linter } from "eslint";
import path from 'path';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as typescriptEslintParser from "@typescript-eslint/parser";
import * as fs from 'fs';

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

		if (fs.existsSync(tsConfigPath) === false) {
			console.error(`\n\n\nNo tsconfig.json found at ${tsConfigPath}\n\n\n`);
			process.exit(1);
		}

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
				files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
				rules: this.getTaskConfig("eslint-rules"),
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
