import { describe, expect, test, beforeEach } from "@jest/globals";
import ContextPathResolverImpl from "context/ContextPathResolverImpl";
import Context from 'context/Context';
import GlobalContextImpl from 'context/GlobalContextImpl';

describe("ContextPathResolverImpl", () => {

	let specimen: ContextPathResolverImpl = null;
	let rootContext: Context = null;
	let childContext: Context = null;
	let grandChildContext: Context = null;

	beforeEach(() => {
		specimen = new ContextPathResolverImpl();
		rootContext = new GlobalContextImpl().createChild();
		childContext = rootContext.addChild("foo");
		grandChildContext = childContext.addChild("bar");
	});

	test("resolve - Local path from root", () => {
		const result: Context = specimen.resolve(rootContext, ".");
		expect(result).toBe(rootContext);
	});

	test("resolve - Local path from child", () => {
		const result: Context = specimen.resolve(childContext, ".");
		expect(result).toBe(childContext);
	});

	test("resolve - Local path from grandchild", () => {
		const result: Context = specimen.resolve(grandChildContext, ".");
		expect(result).toBe(grandChildContext);
	});

	test("resolve - parent path from child", () => {
		const result: Context = specimen.resolve(childContext, "..");
		expect(result).toBe(rootContext);
	});

	test("resolve - parent path from grandchild", () => {
		const result: Context = specimen.resolve(grandChildContext, "..");
		expect(result).toBe(childContext);
	});

	test("resolve - Child path from root", () => {
		const result: Context = specimen.resolve(rootContext, "foo");
		expect(result).toBe(childContext);
	});

	test("resolve - Child path from child", () => {
		const result: Context = specimen.resolve(childContext, "bar");
		expect(result).toBe(grandChildContext);
	});

	test("resolve - Child path from grandchild", () => {
		expect(() => specimen.resolve(grandChildContext, "baz")).toThrow();
	});

	test("resolve - Invalid path", () => {
		expect(() => specimen.resolve(rootContext, "baz")).toThrow();
	});

	test("resolve - Grandchild path from root", () => {
		const result: Context = specimen.resolve(rootContext, "foo/bar");
		expect(result).toBe(grandChildContext);
	});

	test("resolve - Child path from root with relative", () => {
		const result: Context = specimen.resolve(rootContext, "foo/bar/..");
		expect(result).toBe(childContext);
	});

	test("resolve - Child path from root with complex relative", () => {
		const result: Context = specimen.resolve(rootContext, "foo/bar/../bar/../bar/../..");
		expect(result).toBe(rootContext);
	});

	test("resolve - Child path from root with invalid trailing slash", () => {
		expect(() => specimen.resolve(rootContext, "foo/bar/../bar/../bar/../../")).toThrow();
	});

});