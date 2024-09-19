import { OBJECT_ID, LITERAL_OBJECT_PATH, RELATIVE_OBJECT_PATH } from "CydranConstants";
import { describe, test, expect } from '@jest/globals';

describe("CydranConstants", () => {

	test("OBJECT_ID - Matching input - Simple", () => {
		expect(OBJECT_ID.test("foo")).toBeTruthy();
	});

	test("OBJECT_ID - Matching input - Complex", () => {
		expect(OBJECT_ID.test("fooBarBaz")).toBeTruthy();
	});

	test("OBJECT_ID - Non-Matching input", () => {
		expect(OBJECT_ID.test("foo/bar")).toBeFalsy();
	});

	test("RELATIVE_OBJECT_PATH - Matching input - Simple", () => {
		expect(RELATIVE_OBJECT_PATH.test("../foo")).toBeTruthy();
	});

	test("RELATIVE_OBJECT_PATH - Matching input - Complex", () => {
		expect(RELATIVE_OBJECT_PATH.test("../foo/bar/../baz/bat")).toBeTruthy();
	});

	test("RELATIVE_OBJECT_PATH - Matching input - Single Dot", () => {
		expect(RELATIVE_OBJECT_PATH.test("./foo/bar/../baz/bat")).toBeTruthy();
	});

	test("RELATIVE_OBJECT_PATH - Non-Matching input - Simple", () => {
		expect(RELATIVE_OBJECT_PATH.test("/foo")).toBeFalsy();
	});

	test("RELATIVE_OBJECT_PATH - Non-Matching input - Complex", () => {
		expect(RELATIVE_OBJECT_PATH.test("/foo/bar/../baz/bat")).toBeFalsy();
	});

	test("RELATIVE_OBJECT_PATH - Non-Matching input - Invalid Characters", () => {
		expect(RELATIVE_OBJECT_PATH.test("/foo/bar!/../baz/bat")).toBeFalsy();
	});

	test("should export LITERAL_OBJECT_PATH - Matching input - Simple", () => {
		expect(LITERAL_OBJECT_PATH.test("/foo")).toBeTruthy();
	});

	test("should export LITERAL_OBJECT_PATH - Matching input - Complex", () => {
		expect(LITERAL_OBJECT_PATH.test("/foo/bar/../bat/baz")).toBeTruthy();
	});

	test("should export LITERAL_OBJECT_PATH - Matching input - Single Dot", () => {
		expect(LITERAL_OBJECT_PATH.test("/foo/bar/.././bat/baz")).toBeTruthy();
	});

});