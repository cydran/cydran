import Module from "module/Module";
import PubSubArgumentResolver from "argument/PubSubArgumentResolver";
import PubSubImpl from "message/PubSubImpl";

import DomImpl from 'dom/DomImpl';
import ModulesContextImpl from 'module/ModulesContextImpl';
import InstanceServices from "context/InstanceServices";
import InstanceServicesImpl from "context/InstanceServicesImpl";

const cydranContext: InstanceServices = new InstanceServicesImpl(new DomImpl(), {});
const module: Module = new ModulesContextImpl(cydranContext).getDefaultModule();

test("specimen is whole", () => {
	const specimen: PubSubArgumentResolver = new PubSubArgumentResolver(module);
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const s1: PubSubArgumentResolver = new PubSubArgumentResolver(module);
	const psub: PubSubImpl= s1.resolve(module);
	expect(psub).not.toBeNull();
	expect(psub instanceof PubSubImpl).toEqual(true);
});

test("postProcess resolver", () => {
	const s1: PubSubArgumentResolver = new PubSubArgumentResolver(module);
	const keyVal: string = "Sally";
	const obj: Object = {key: keyVal};
	const psub: PubSubImpl= s1.resolve(module);
	s1.postProcess(module, obj, psub);
	expect(psub.context.key).toEqual(keyVal);
});
