import { startsWith, endsWith } from '@/util/StringUtils';

test("endsWith empty string", () => {
	expect(endsWith("", "e test")).toBeFalsy();
});

test("endsWith non-empty string", () => {
	expect(endsWith("This is a test", "a test")).toBeTruthy();
});

test("startsWith empty string", () => {
	expect(startsWith("", "This ")).toBeFalsy();
});

test("startsWith non-empty string", () => {
	expect(startsWith("This is a test", "This ")).toBeTruthy();
});
