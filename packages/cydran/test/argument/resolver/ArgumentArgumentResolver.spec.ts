import { mock, instance } from "ts-mockito";
import Context from "context/Context";
import ArgumentArgumentResolver from "argument/resolver/ArgumentArgumentResolver";
import GlobalContextImpl from "context/GlobalContextImpl";

let wkContext: Context;

beforeAll(() => {
	wkContext = new GlobalContextImpl().createChild();
});

test("specimen is whole", () => {
	const specimen: ArgumentArgumentResolver = new ArgumentArgumentResolver(0);
	expect(specimen).not.toBeNull();
});

test("resolve successfully", () => {
	const specimen: ArgumentArgumentResolver = new ArgumentArgumentResolver(0);
	expect(specimen.resolve(wkContext, ["abc"])).toEqual("abc");
});

test("resolve with null", () => {
	const specimen: ArgumentArgumentResolver = new ArgumentArgumentResolver(1);
	expect(specimen.resolve(wkContext, ["abc"])).toBeNull();
});
