import { resolveNamedMethod } from "util/Utils";
import { NullValueError, InvalidTypeError, UnknownMethodError } from "error/Errors";
import { describe, expect, test } from "@jest/globals";

class Specimen {

	public value: number = 41;

	public notAFunction: string = "nope";

	public increment(by: number): number {
		this.value += by;

		return this.value;
	}

}

describe("resolveNamedMethod", () => {

	test("resolves a present method to its reference", () => {
		const specimen: Specimen = new Specimen();
		const resolved: (...args: unknown[]) => unknown = resolveNamedMethod(specimen, "increment");

		expect(typeof resolved).toEqual("function");
		expect(resolved.call(specimen, 1)).toEqual(42);
	});

	test("throws NullValueError when thisObject is null", () => {
		expect(() => resolveNamedMethod(null as unknown as object, "increment")).toThrow(NullValueError);
	});

	test("throws NullValueError when the name is null", () => {
		const specimen: Specimen = new Specimen();

		expect(() => resolveNamedMethod(specimen, null as unknown as string)).toThrow(NullValueError);
	});

	test("throws InvalidTypeError when the name is not a string", () => {
		const specimen: Specimen = new Specimen();

		expect(() => resolveNamedMethod(specimen, 42 as unknown as string)).toThrow(InvalidTypeError);
	});

	test("throws UnknownMethodError when no method with the name exists", () => {
		const specimen: Specimen = new Specimen();

		expect(() => resolveNamedMethod(specimen, "missing")).toThrow(UnknownMethodError);
	});

	test("throws UnknownMethodError when the named member is not callable", () => {
		const specimen: Specimen = new Specimen();

		expect(() => resolveNamedMethod(specimen, "notAFunction")).toThrow(UnknownMethodError);
	});

});
