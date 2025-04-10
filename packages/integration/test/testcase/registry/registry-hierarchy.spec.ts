import { Stage, Context, create } from "@cydran/cydran";
import { describe, expect, test, beforeEach } from '@jest/globals';

let stage: Stage = null as unknown as Stage;
let context: Context = null as unknown as Context;
let context0: Context = null as unknown as Context;
let context1: Context = null as unknown as Context;

describe.skip("Registry Hierarchy", () => {

	beforeEach(() => {
		stage = create("body", {
			"cydran.startup.synchronous": true
		});
		stage.start();
		context = stage.getContext();
		context0 = context.addChild("context0");
		context1 = context0.addChild("context1");
	});

	test("Context - Local object", () => {
		context.registerConstant("message", "From context");
		context0.registerConstant("message", "From context0");
		context1.registerConstant("message", "From context1");

		const result = context1.getObject("message");

		expect(result).toBe("From context1");
	});

	test("Context - Parent object", () => {
		context.registerConstant("message", "From context");
		context0.registerConstant("message", "From context0");

		const result = context1.getObject("message");

		expect(result).toBe("From context0");
	});

	test("Context - Root object", () => {
		context.registerConstant("message", "From context");

		const result = context1.getObject("message");

		expect(result).toBe("From context");
	});

});
