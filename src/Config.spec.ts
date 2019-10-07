import {assert} from "chai";
import {describe, it, xit} from "mocha";
import Config from "./Config";

describe("Config tests", () => {

	it("new Config()", () => {
		let instance: Config = new Config();
		assert.isNotNull(instance, "is null");
	});

	it(".nameSpace default value", () => {
		let instance: Config = new Config();
		let expected: string = "data-c";
		let result: string = instance.nameSpace();
		assert.equal(expected, result, "is not the default value");
	});

	it(".eventNameSpace default value", () => {
		let instance: Config = new Config();
		let expected: string = "data-c-on";
		let result: string = instance.eventNameSpace();
		assert.equal(expected, result, "is not the default value");
	});


	let prefix: string = "xyz-c";
	it("new Config(prefix) - new value: " + prefix, () => {
		let expected: string = prefix;
		let instance: Config = new Config().useNameSpace(prefix);

		let result: string = instance.nameSpace();
		assert.equal(expected, result, "is not the new value");
	});

	it("new Config(prefix) - new value: " + prefix + "-on", () => {
		let expected: string = prefix + "-on";
		let instance: Config = new Config().useNameSpace(prefix);

		let result: string = instance.eventNameSpace();
		assert.equal(expected, result, "is not the new value");
	});

});
