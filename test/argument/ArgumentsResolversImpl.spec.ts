import { mock, instance } from "ts-mockito";
import Module from "module/Module";
import ModuleImpl from "module/ModuleImpl";
import ArgumentsResolversImpl from "argument/ArgumentsResolversImpl";
import ConstantArgumentResolver from "argument/ConstantArgumentResolver";

let wkModule: Module;

beforeAll(() => {
	const mockMod: ModuleImpl = mock(ModuleImpl);
	wkModule = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: ArgumentsResolversImpl = new ArgumentsResolversImpl();
	expect(specimen).not.toBe(null);
});

test("disposal occurs", () => {
	const specimen: ArgumentsResolversImpl = new ArgumentsResolversImpl();
	expect(specimen.resolve(wkModule).length).toEqual(0);
	const count: number = 4;
	for(let x: number = 0; x < count; x++) {
		specimen.add(new ConstantArgumentResolver(x));
	}
	expect(specimen.resolve(wkModule).length).toEqual(count);
	specimen.$dispose();
	expect(specimen.resolve(wkModule).length).toEqual(0);
});

test("add and postProcess", () => {
	const specimen: ArgumentsResolversImpl = new ArgumentsResolversImpl();
	expect(specimen.resolve(wkModule).length).toEqual(0);
	const target: Object = {};
	let params: string[] = new Array<string>(0);
	specimen.postProcess(wkModule, target, params);

	const count: number = 4;
	const rSpies: any[] = new Array<any>(count);
	params = new Array<string>(0);

	for(let x: number = 0; x < count; x++) {
		const r: ConstantArgumentResolver = new ConstantArgumentResolver(x);
		rSpies[x] = jest.spyOn(r, 'postProcess');
		specimen.add(r);
		params[x] = x + "";
	}

	expect(specimen.resolve(wkModule).length).toEqual(count);
	specimen.postProcess(wkModule, target, params);

	for(const wkSpy of rSpies) {
		expect(wkSpy).toBeCalledTimes(1);
	}

});

test("resolve", () => {
	const specimen: ArgumentsResolversImpl = new ArgumentsResolversImpl();
	expect(specimen.resolve(wkModule).length).toEqual(0);
	const count: number = 4;

	for(let x: number = 0; x < count; x++) {
		specimen.add(new ConstantArgumentResolver(x));
	}
	const argArray: any[] = specimen.resolve(wkModule);
	expect(argArray.length).toEqual(count);
	for(let x: number = 0; x < count; x++) {
		expect(argArray[x]).toEqual(x);
	}
});
