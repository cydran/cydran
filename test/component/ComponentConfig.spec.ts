import { ComponentConfig, ComponentConfigBuilder, ComponentConfigImpl, ComponentIdPair } from "@/component/ComponentConfig";
import { assertNullGuarded } from "@/util/TestUtils";
import { spy, verify } from "ts-mockito";

const max: number = 0;
const min: number = 100;

function randomIdent() {
	let retval = "";
	for (let x = 0; x < 3; x++) {
		retval += (Math.floor(Math.random() * (max - min + 1) + min) + ((x < 2) ? "-" : ""));
	}

	return retval;
}

const idPairs: ComponentIdPair[] = [];

for (let x = 0; x < 5; x++) {
	const tObj = {
		componentId: randomIdent(),
		moduleId: randomIdent()
	};

	idPairs.push(tObj);
}

test("ComponentConfigBuild values", () => {
	const instance: ComponentConfig = new ComponentConfigBuilder()
		.withPrefix("custom-prefix")
		.withMetadata("alpha", "one")
		.withMetadata("beta", "two")
		.withMetadata("gamma", "three")
		.build();

	expect(instance).not.toBeNull();
	expect(instance.getPrefix()).toEqual("custom-prefix");
	expect(instance.getMetadata("alpha")).toEqual("one");
	expect(instance.getMetadata("beta")).toEqual("two");
	expect(instance.getMetadata("gamma")).toEqual("three");
	expect(instance.getMetadata("bogus")).toBeNull();
});

test("ComponentConfigBuild withPrefix(null)", () => {
	assertNullGuarded("prefix", () => new ComponentConfigBuilder().withPrefix(null));
});

test("ComponentConfigBuild withMetadata(null, nonNull)", () => {
	assertNullGuarded("name", () => new ComponentConfigBuilder().withMetadata(null, "value"));
});

test("ComponentConfigBuild withMetadata(nonNull, null)", () => {
	assertNullGuarded("value", () => new ComponentConfigBuilder().withMetadata("name", null));
});

test("set/get ParentModelFn(parentModelFn: () => any): void?|Function", () => {
	const tFn = function() { /**/ };
	const cc: ComponentConfigImpl = new ComponentConfigImpl();
	const spyCC: ComponentConfigImpl = spy(cc);
	cc.setParentModelFn(tFn);
	verify(spyCC.setParentModelFn(tFn)).once();
	expect(tFn).toEqual(cc.getParentModelFn());
});
