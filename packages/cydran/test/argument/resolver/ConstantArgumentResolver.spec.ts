import { mock, instance } from "ts-mockito";
import Context from "context/Context";
import ConstantArgumentResolver from "argument/resolver/ConstantArgumentResolver";
import GlobalContextImpl from "context/GlobalContextImpl";

let wkContext: Context;

beforeAll(() => {
	wkContext = new GlobalContextImpl().createChild();
});

test("specimen is whole", () => {
	const specimen: ConstantArgumentResolver = new ConstantArgumentResolver(null);
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const obj1: Object = null;
	const s1: ConstantArgumentResolver = new ConstantArgumentResolver(obj1);
	expect(s1.resolve(wkContext)).toBe(null);

	const obj2: Object = { bubba: "licious" };
	const s2: ConstantArgumentResolver = new ConstantArgumentResolver(obj2);
	expect(s2.resolve(wkContext)).toEqual(obj2);

	const obj3: string = "bubbalicious";
	const s3: ConstantArgumentResolver = new ConstantArgumentResolver(obj3);
	expect(s3.resolve(wkContext)).toEqual(obj3);

	const obj4: Function = (a1: string): string => { return a1.toUpperCase(); };
	const s4: ConstantArgumentResolver = new ConstantArgumentResolver(obj4);
	const fnA1: string = "silly";
	expect(s4.resolve(wkContext)(fnA1)).toEqual(fnA1.toUpperCase());
});
