import Context from "context/Context";
import PubSubArgumentResolver from "argument/PubSubArgumentResolver";
import PubSubImpl from "message/PubSubImpl";
import StageImpl from 'context/RootContextImpl';

const context: Context = new StageImpl("body");

test("specimen is whole", () => {
	const specimen: PubSubArgumentResolver = new PubSubArgumentResolver(context);
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const s1: PubSubArgumentResolver = new PubSubArgumentResolver(context);
	const psub: PubSubImpl= s1.resolve(context);
	expect(psub).not.toBeNull();
	expect(psub instanceof PubSubImpl).toEqual(true);
});

test("postProcess resolver", () => {
	const s1: PubSubArgumentResolver = new PubSubArgumentResolver(context);
	const keyVal: string = "Sally";
	const obj: Object = {key: keyVal};
	const psub: PubSubImpl= s1.resolve(context);
	s1.postProcess(context, obj, psub);
	expect(psub.targetThis.key).toEqual(keyVal);
});
