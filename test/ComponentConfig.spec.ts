import { assert } from "chai";
import { describe, it, xit } from "mocha";
import { ComponentConfig, ComponentConfigBuilder } from "../src/ComponentConfig";
import { assertNullGuarded } from "./TestUtils";

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

});
