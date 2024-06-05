import { mock, instance } from "ts-mockito";
import Context from "context/Context";
import ContextArgumentResolver from "argument/resolver/ContextArgumentResolver";
import GlobalContextImpl from "context/GlobalContextImpl";

let wkContext: Context;

beforeAll(() => {
	wkContext = new GlobalContextImpl().createChild();
});

test("specimen is whole", () => {
	const specimen: ContextArgumentResolver = new ContextArgumentResolver();
	expect(specimen).not.toBeNull();
});

test("resolve", () => {
	const specimen: ContextArgumentResolver = new ContextArgumentResolver();
	expect(specimen.resolve(wkContext)).toEqual(wkContext);
});
