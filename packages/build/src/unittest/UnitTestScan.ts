import fs from "fs";
import path from "path";
import { requireNotNull } from "../Utils.js";
import resolveFiles from "../ResolveFiles.js";
import { UnitTestsConfig, isActive, readUnitTestsConfig } from "./UnitTestsConfig.js";

const SOURCE_SUFFIX: string = ".ts";
const TEST_SUFFIX: string = ".spec.ts";
const TEST_GLOB: string = "**/*" + TEST_SUFFIX;

interface SourceFile {

	/** Package-relative path of the source file. */
	path: string;

	/** Package-relative path where its unit test is expected. */
	expectedTest: string;

	tested: boolean;

}

interface TestFile {

	/** Package-relative path of the test file. */
	path: string;

	/** Package-relative path where its source file is expected. */
	expectedSource: string;

	orphaned: boolean;

}

interface UnitTestScan {

	config: UnitTestsConfig;

	sources: SourceFile[];

	tests: TestFile[];

}

function toPackagePath(packageRoot: string, absolutePath: string): string {
	return path.relative(packageRoot, absolutePath).split(path.sep).join("/");
}

function withoutSuffix(value: string, suffix: string): string {
	return value.endsWith(suffix) ? value.slice(0, value.length - suffix.length) : value;
}

function isOutside(relativePath: string): boolean {
	return relativePath === ".." || relativePath.startsWith(".." + path.sep) || path.isAbsolute(relativePath);
}

/**
 * Maps each checked source file to its expected unit test. Throws when a matched file lies outside the source
 * directory, because it has no place in the mapping.
 */
function scanSources(packageRoot: string, srcPath: string, testPath: string, config: UnitTestsConfig): SourceFile[] {
	const sources: SourceFile[] = [];

	for (const packagePath of resolveFiles(packageRoot, config.include, config.exclude)) {
		const sourcePath: string = path.join(packageRoot, packagePath);
		const relativePath: string = path.relative(srcPath, sourcePath);

		if (isOutside(relativePath)) {
			throw new Error(`${packagePath} is outside the source directory (${toPackagePath(packageRoot, srcPath)})`);
		}

		const expectedTest: string = path.join(testPath, withoutSuffix(relativePath, SOURCE_SUFFIX) + TEST_SUFFIX);

		sources.push({
			path: packagePath,
			expectedTest: toPackagePath(packageRoot, expectedTest),
			tested: fs.existsSync(expectedTest)
		});
	}

	return sources;
}

/**
 * Maps each unit test under the test directory back to its expected source file. A missing test directory has no
 * tests.
 */
function scanTests(packageRoot: string, srcPath: string, testPath: string): TestFile[] {
	let tests: TestFile[] = [];

	if (fs.existsSync(testPath) && fs.statSync(testPath).isDirectory()) {
		tests = resolveFiles(testPath, [TEST_GLOB], []).map((relativePath) => {
			const expectedSource: string = path.join(srcPath, withoutSuffix(relativePath, TEST_SUFFIX) + SOURCE_SUFFIX);

			return {
				path: toPackagePath(packageRoot, path.join(testPath, relativePath)),
				expectedSource: toPackagePath(packageRoot, expectedSource),
				orphaned: !fs.existsSync(expectedSource)
			};
		});
	}

	return tests;
}

/**
 * Scans the package when its unit-tests section is active, and returns null when it is not. Throws when the section is
 * invalid or a matched source file lies outside the source directory.
 */
function scanIfActive(packageRoot: string, srcPath: string, testPath: string, raw: any): UnitTestScan {
	requireNotNull(packageRoot, "packageRoot");
	requireNotNull(srcPath, "srcPath");
	requireNotNull(testPath, "testPath");

	let scan: UnitTestScan = null;

	if (isActive(raw)) {
		const config: UnitTestsConfig = readUnitTestsConfig(raw);

		scan = {
			config: config,
			sources: scanSources(packageRoot, srcPath, testPath, config),
			tests: scanTests(packageRoot, srcPath, testPath)
		};
	}

	return scan;
}

export { SourceFile, TestFile, UnitTestScan, scanIfActive };
