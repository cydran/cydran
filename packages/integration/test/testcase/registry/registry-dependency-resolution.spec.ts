import { Stage, Context, create, argumentsBuilder, requireNotNull, ArgumentsResolvers } from "@cydran/cydran";
import { describe, expect, test, beforeEach } from '@jest/globals';

let stage: Stage = null;
let context: Context = null;
let childContext: Context = null;

class TestClass {

	private value0: string;
	
	private propertyProvider0: () => string;

	private propertyFallbackSubscriber0: (thisObject: Object, callback: (key: string, value: any) => void) => void;

	private received: string[];

	constructor(value0: string, propertyProvider0: () => string, propertyFallbackSubscriber0: (thisObject: Object, callback: (key: string, value: any) => void) => void) {
		this.value0 = requireNotNull(value0, "value0");
		this.propertyProvider0 = requireNotNull(propertyProvider0, "propertyProvider0");
		this.propertyFallbackSubscriber0 = requireNotNull(propertyFallbackSubscriber0, "propertyFallbackSubscriber0");
		this.received = [];
		propertyFallbackSubscriber0(this, (key: string, value: any) => {
			this.received.push(key + ":" + value);
		});
	}

	public getValue0(): string {
		return this.value0;
	}

	public getProperty0(): string {
		return this.propertyProvider0();
	}

	public getReceived(): string[] {
		return this.received;
	}

}

describe("Registry Dependency Resolution", () => {

	beforeEach(() => {
		stage = create("body", {
			"cydran.startup.synchronous": true
		});
		stage.start();
		context = stage.getContext();
		childContext = context.addChild("childContext");

		const resolvers: ArgumentsResolvers = argumentsBuilder()
			.with("value0")
			.withPropertyProvider("property0")
			.withPropertyFallbackSubscriber("cydran.logging.childContext.level", "cydran.logging")
			.build();

		context.registerPrototype("testClass", TestClass, resolvers, true);
		context.registerConstant("value0", "From parent context");
		childContext.registerConstant("value0", "From child context");
		context.getProperties().set("property0", "property from parent context");
		childContext.getProperties().set("property0", "property from child context");
	});
 
	test("Context - Local object", () => {
		const specimen: TestClass = childContext.getObject("testClass");
		context.getProperties().set("cydran.logging.level", "TRACE");
		childContext.getProperties().set("cydran.logging.childContext.level", "DEBUG");
		context.getProperties().set("cydran.logging.level", "INFO");

		expect(specimen).not.toBeNull();
		expect(specimen.getValue0()).toBe("From child context");
		expect(specimen.getProperty0()).toBe("property from child context");
		expect(specimen.getReceived()).toEqual([
			"cydran.logging.level:TRACE",
			"cydran.logging.childContext.level:DEBUG",
			"cydran.logging.childContext.level:DEBUG"
		]);
	});

});
