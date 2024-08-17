import { LOCAL_ID_REGEX, RELATIVE_PATH_REGEX, LITERAL_PATH_REGEX } from "Constants";
import { describe, test, expect } from '@jest/globals';

describe("Constants", () => {

	test("LOCAL_ID_REGEX - Matching input - Simple", () => {
		expect(LOCAL_ID_REGEX.test("foo")).toBeTruthy();
	});

	test("LOCAL_ID_REGEX - Matching input - Complex", () => {
		expect(LOCAL_ID_REGEX.test("foo;::!")).toBeTruthy();
	});

	test("LOCAL_ID_REGEX - Non-Matching input", () => {
		expect(LOCAL_ID_REGEX.test("foo/bar")).toBeFalsy();
	});

	test("RELATIVE_PATH_REGEX - Matching input - Simple", () => {
		expect(RELATIVE_PATH_REGEX.test("../foo")).toBeTruthy();
	});

	test("RELATIVE_PATH_REGEX - Matching input - Complex", () => {
		expect(RELATIVE_PATH_REGEX.test("../foo/bar/../baz/bat")).toBeTruthy();
	});

	test("RELATIVE_PATH_REGEX - Matching input - Single Dot", () => {
		expect(RELATIVE_PATH_REGEX.test("./foo/bar/../baz/bat")).toBeTruthy();
	});

	test("RELATIVE_PATH_REGEX - Non-Matching input - Simple", () => {
		expect(RELATIVE_PATH_REGEX.test("/foo")).toBeFalsy();
	});

	test("RELATIVE_PATH_REGEX - Non-Matching input - Complex", () => {
		expect(RELATIVE_PATH_REGEX.test("/foo/bar/../baz/bat")).toBeFalsy();
	});

	test("RELATIVE_PATH_REGEX - Non-Matching input - Invalid Characters", () => {
		expect(RELATIVE_PATH_REGEX.test("/foo/bar!/../baz/bat")).toBeFalsy();
	});

	test("should export LITERAL_PATH_REGEX - Matching input - Simple", () => {
		expect(LITERAL_PATH_REGEX.test("/foo")).toBeTruthy();
	});

	test("should export LITERAL_PATH_REGEX - Matching input - Complex", () => {
		expect(LITERAL_PATH_REGEX.test("/foo/bar/../bat/baz")).toBeTruthy();
	});

	test("should export LITERAL_PATH_REGEX - Matching input - Single Dot", () => {
		expect(LITERAL_PATH_REGEX.test("/foo/bar/.././bat/baz")).toBeTruthy();
	});

});