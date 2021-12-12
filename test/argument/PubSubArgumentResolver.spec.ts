import { mock, instance, when, reset, spy, verify } from "ts-mockito";
import Module from "module/Module";
import ModuleImpl from "module/ModuleImpl";
import PubSubArgumentResolver from "argument/PubSubArgumentResolver";
import PubSubImpl from "message/PubSubImpl";

let wkModule: Module;

beforeAll(() => {
	const mockMod: ModuleImpl = mock(ModuleImpl);
	wkModule = instance(mockMod);
});

test("specimen is whole", () => {
	const specimen: PubSubArgumentResolver = new PubSubArgumentResolver(wkModule);
	expect(specimen).not.toBe(null);
});

test("resolve item", () => {
	const s1: PubSubArgumentResolver = new PubSubArgumentResolver(wkModule);
	const psub: PubSubImpl= s1.resolve(wkModule);
	expect(psub).not.toBe(null);
	expect(psub instanceof PubSubImpl).toEqual(true);
});

test("postProcess resolver", () => {
	const s1: PubSubArgumentResolver = new PubSubArgumentResolver(wkModule);
	const keyVal: string = "Sally";
	const obj: Object = {key: keyVal};
	const psub: PubSubImpl= s1.resolve(wkModule);
	s1.postProcess(wkModule, obj, psub);
	expect(psub.context.key).toEqual(keyVal);
});
