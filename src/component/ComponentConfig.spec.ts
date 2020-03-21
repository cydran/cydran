import { ComponentConfig, ComponentConfigBuilder, ComponentConfigImpl, ComponentIdPair } from "@/component/ComponentConfig";
import { assertNullGuarded } from "@/util/TestUtils";
import { assert } from "chai";
import { describe, it, xit } from "mocha";
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

describe("ComponentConfig tests", () => {

	it("ComponentConfigBuild values", () => {
		const instance: ComponentConfig = new ComponentConfigBuilder()
			.withPrefix("custom-prefix")
			.withAttribute("first")
			.withAttribute("second")
			.withMetadata("alpha", "one")
			.withMetadata("beta", "two")
			.withMetadata("gamma", "three")
			.build();

		assert.isNotNull(instance, "is null");
		assert.equal(instance.getPrefix(), "custom-prefix", "must have custom prefix");
		assert.equal(instance.getAttributes().length, 2, "attributes must have 2 elements");
		assert.equal(instance.getAttributes()[0], "first", "attribute 0 must be 'first'");
		assert.equal(instance.getAttributes()[1], "second", "attribute 1 must be 'second'");
		assert.equal(instance.getMetadata("alpha"), "one", "metadata value alpha must be 'one'");
		assert.equal(instance.getMetadata("beta"), "two", "metadata value beta must be 'two'");
		assert.equal(instance.getMetadata("gamma"), "three", "metadata value gamma must be 'three'");
		assert.isNull(instance.getMetadata("bogus"), "metadata value bogus must be null");
	});

	it("ComponentConfigBuild withPrefix(null)", () => {
		assertNullGuarded("prefix", () => new ComponentConfigBuilder().withPrefix(null));
	});

	it("ComponentConfigBuild withAttribute(null)", () => {
		assertNullGuarded("name", () => new ComponentConfigBuilder().withAttribute(null));
	});

	it("ComponentConfigBuild withMetadata(null, nonNull)", () => {
		assertNullGuarded("name", () => new ComponentConfigBuilder().withMetadata(null, "value"));
	});

	it("ComponentConfigBuild withMetadata(nonNull, null)", () => {
		assertNullGuarded("value", () => new ComponentConfigBuilder().withMetadata("name", null));
	});

	it("set/get ParentModelFn(parentModelFn: () => any): void?|Function", () => {
		const tFn = function() { /**/ };
		const cc: ComponentConfigImpl = new ComponentConfigImpl();
		const spyCC: ComponentConfigImpl = spy(cc);
		cc.setParentModelFn(tFn);
		verify(spyCC.setParentModelFn(tFn)).once();
		assert.equal(tFn, cc.getParentModelFn());
	});

	it("set/get TopComponentIds(topComponentIds: ComponentIdPair[]): void?|ComponentIdPair[]", () => {
		const cc: ComponentConfigImpl = new ComponentConfigImpl();
		const spyCC: ComponentConfigImpl = spy(cc);
		cc.setTopComponentIds(idPairs);
		verify(spyCC.setTopComponentIds(idPairs)).once();
		assert.equal(idPairs, cc.getTopComponentIds());
	});

	it("set/get BottomComponentIds(topComponentIds: ComponentIdPair[]): void?|ComponentIdPair[]", () => {
		const cc: ComponentConfigImpl = new ComponentConfigImpl();
		const spyCC: ComponentConfigImpl = spy(cc);
		cc.setBottomComponentIds(idPairs);
		verify(spyCC.setBottomComponentIds(idPairs)).once();
		assert.equal(idPairs, cc.getBottomComponentIds());
	});

});
