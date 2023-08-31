import Context from "context/Context";
import PubSubArgumentResolver from "argument/resolver/PubSubArgumentResolver";
import PubSubImpl from "message/PubSubImpl";
import { StageImpl } from 'context/RootContextImpl';

const context: Context = new StageImpl("body");

let specimen: PubSubArgumentResolver;

beforeEach(() => {
	specimen = new PubSubArgumentResolver(context);
});

afterEach(() => {
	specimen = null;
});

test("specimen is whole", () => {
	expect(specimen).not.toBeNull();
});

test("resolve item", () => {
	const psub: PubSubImpl= specimen.resolve(context);
	expect(psub).not.toBeNull();
	expect(psub instanceof PubSubImpl).toEqual(true);
});

test("postProcess resolver", () => {
	const keyVal: string = "Sally";
	const obj: Object = {key: keyVal};
	const psub: PubSubImpl= specimen.resolve(context);
	specimen.postProcess(context, obj, psub);
	expect(psub.targetThis.key).toEqual(keyVal);
});
