import { create, Context, Stage, Component, MessageCallback, To, Nestable } from "@cydran/cydran";
import { expect, describe, beforeEach, test } from '@jest/globals';

class TestComponent extends Component {

	constructor() {
		super("<div></div>");
	}

}

interface Message {
	channel: string;
	message: string;
	payload: any;
}

const CHANNEL_NAME: string = "test-channel";
const MESSAGE_NAME: string = "test-message";
const PAYLOAD: string = "test-payload";

let stage: Stage = null as unknown as Stage;
let context: Context = null as unknown as Context;
let contextMessages: Message[] = [];
let context0: Context = null as unknown as Context;
let context0Messages: Message[] = [];
let context0child0: Context = null as unknown as Context;
let context0child0Messages: Message[] = [];
let context0child0child0: Context = null as unknown as Context;
let context0child0child0Messages: Message[] = [];
let context0child0child1: Context = null as unknown as Context;
let context0child0child1Messages: Message[] = [];
let context0child1: Context = null as unknown as Context;
let context0child1Messages: Message[] = [];
let context0child1child0: Context = null as unknown as Context;
let context0child1child0Messages: Message[] = [];
let context0child1child1: Context = null as unknown as Context;
let context0child1child1Messages: Message[] = [];
let context1: Context = null as unknown as Context;
let context1Messages: Message[] = [];
let context1child0: Context = null as unknown as Context;
let context1child0Messages: Message[] = [];
let context1child0child0: Context = null as unknown as Context;
let context1child0child0Messages: Message[] = [];
let context1child0child1: Context = null as unknown as Context;
let context1child0child1Messages: Message[] = [];
let context1child1: Context = null as unknown as Context;
let context1child1Messages: Message[] = [];
let context1child1child0: Context = null as unknown as Context;
let context1child1child0Messages: Message[] = [];
let context1child1child1: Context = null as unknown as Context;
let context1child1child1Messages: Message[] = [];

function createListener(target: Message[]): MessageCallback {
	return (channel: string, message: string, payload: any) => {
		target.push({
			channel: channel,
			message: message,
			payload: payload
		});
	};
}

describe.skip("Context Component Lifecycle", () => {

	beforeEach(() => {
		stage = create("body", { "cydran.startup.synchronous": true });
		stage.start();
		context = stage.getContext();
		contextMessages = [];
		context.addListener({}, createListener(contextMessages));

		context0 = context.addChild("context0");
		context0Messages = [];
		context0.addListener({}, createListener(context0Messages));

		context0child0 = context0.addChild("context0child0");
		context0child0Messages = [];
		context0child0.addListener({}, createListener(context0child0Messages));

		context0child0child0 = context0child0.addChild("context0child0child0");
		context0child0child0Messages = [];
		context0child0child0.addListener({}, createListener(context0child0child0Messages));

		context0child0child1 = context0child0.addChild("context0child0child1");
		context0child0child1Messages = [];
		context0child0child1.addListener({}, createListener(context0child0child1Messages));

		context0child1 = context0.addChild("context0child1");
		context0child1Messages = [];
		context0child1.addListener({}, createListener(context0child1Messages));

		context0child1child0 = context0child1.addChild("context0child1child0");
		context0child1child0Messages = [];
		context0child1child0.addListener({}, createListener(context0child1child0Messages));

		context0child1child1 = context0child1.addChild("context0child1child1");
		context0child1child1Messages = [];
		context0child1child1.addListener({}, createListener(context0child1child1Messages));

		context1 = context.addChild("context1");
		context1Messages = [];
		context1.addListener({}, createListener(context1Messages));

		context1child0 = context1.addChild("context1child0");
		context1child0Messages = [];
		context1child0.addListener({}, createListener(context1child0Messages));

		context1child0child0 = context1child0.addChild("context1child0child0");
		context1child0child0Messages = [];
		context1child0child0.addListener({}, createListener(context1child0child0Messages));

		context1child0child1 = context1child0.addChild("context1child0child1");
		context1child0child1Messages = [];
		context1child0child1.addListener({}, createListener(context1child0child1Messages));

		context1child1 = context1.addChild("context1child1");
		context1child1Messages = [];
		context1child1.addListener({}, createListener(context1child1Messages));

		context1child1child0 = context1child1.addChild("context1child1child0");
		context1child1child0Messages = [];
		context1child1child0.addListener({}, createListener(context1child1child0Messages));

		context1child1child1 = context1child1.addChild("context1child1child1");
		context1child1child1Messages = [];
		context1child1child1.addListener({}, createListener(context1child1child1Messages));
	});

	function expectMessages(messages: Message[]) {
		expect(messages.length).toBe(1);
		expect(messages[0].channel).toBe(CHANNEL_NAME);
		expect(messages[0].message).toBe(MESSAGE_NAME);
		expect(messages[0].payload).toBe(PAYLOAD);
	}

	function expectNoMessages(messages: Message[]) {
		expect(messages.length).toBe(0);
	}

	function clearMessages(messages: Message[]) {
		while (messages.length > 0) {
			messages.pop();
		}
	}

	function clearAllMessages() {
		clearMessages(contextMessages);
		clearMessages(context0Messages);
		clearMessages(context0child0Messages);
		clearMessages(context0child0child0Messages);
		clearMessages(context0child0child1Messages);
		clearMessages(context0child1Messages);
		clearMessages(context0child1child0Messages);
		clearMessages(context0child1child1Messages);
		clearMessages(context1Messages);
		clearMessages(context1child0Messages);
		clearMessages(context1child0child0Messages);
		clearMessages(context1child0child1Messages);
		clearMessages(context1child1Messages);
		clearMessages(context1child1child0Messages);
		clearMessages(context1child1child1Messages);
	}

	test("Component instantiated manually and messages are broadcasted", () => {
		const component: TestComponent = new TestComponent();
		assertThrown("Context is not available for messaging.", () => {
			component.$c().send(MESSAGE_NAME, PAYLOAD).onChannel(CHANNEL_NAME).withPropagation(To.GLOBALLY);
		}, "ContextUnavailableError");
	});

	test("Component instantiated manually, placed on a stage, and messages are broadcasted", () => {
		const component: TestComponent = new TestComponent();
		stage.setComponent(component);
		component.$c().send(MESSAGE_NAME, PAYLOAD).onChannel(CHANNEL_NAME).withPropagation(To.DESCENDANTS);

		// Verify messages are broadcasted starting at the root context 
		expectNoMessages(contextMessages);
		expectMessages(context0Messages);
		expectMessages(context0child0Messages);
		expectMessages(context0child0child0Messages);
		expectMessages(context0child0child1Messages);
		expectMessages(context0child1Messages);
		expectMessages(context0child1child0Messages);
		expectMessages(context0child1child1Messages);
		expectMessages(context1Messages);
		expectMessages(context1child0Messages);
		expectMessages(context1child0child0Messages);
		expectMessages(context1child0child1Messages);
		expectMessages(context1child1Messages);
		expectMessages(context1child1child0Messages);
		expectMessages(context1child1child1Messages);
	});

	test("Component instantiated manually, has a context set, and messages are broadcasted", () => {
		const component: TestComponent = new TestComponent();
		component.setContext(context0);
		stage.setComponent(component);
		component.$c().send(MESSAGE_NAME, PAYLOAD).onChannel(CHANNEL_NAME).withPropagation(To.DESCENDANTS);

		// Verify messages are broadcasted starting at the set context 
		expectNoMessages(contextMessages);
		expectNoMessages(context0Messages);
		expectMessages(context0child0Messages);
		expectMessages(context0child0child0Messages);
		expectMessages(context0child0child1Messages);
		expectMessages(context0child1Messages);
		expectMessages(context0child1child0Messages);
		expectMessages(context0child1child1Messages);
		expectNoMessages(context1Messages);
		expectNoMessages(context1child0Messages);
		expectNoMessages(context1child0child0Messages);
		expectNoMessages(context1child0child1Messages);
		expectNoMessages(context1child1Messages);
		expectNoMessages(context1child1child0Messages);
		expectNoMessages(context1child1child1Messages);
	});

	/**
	 * Component instantiated manually, has a context set, placed on a stage, and messages are broadcasted, removed from stage, and messages are broadcasted
	 */
	test("Component instantiated manually, has a context set, placed on a stage, and messages are broadcasted, removed from stage, and messages are broadcasted", () => {
		const component: TestComponent = new TestComponent();
		component.setContext(context0);
		stage.setComponent(component);
		component.$c().send(MESSAGE_NAME, PAYLOAD).onChannel(CHANNEL_NAME).withPropagation(To.DESCENDANTS);

		// Verify messages are broadcasted starting at the set context
		expectNoMessages(contextMessages);
		expectNoMessages(context0Messages);
		expectMessages(context0child0Messages);
		expectMessages(context0child0child0Messages);
		expectMessages(context0child0child1Messages);
		expectMessages(context0child1Messages);
		expectMessages(context0child1child0Messages);
		expectMessages(context0child1child1Messages);
		expectNoMessages(context1Messages);
		expectNoMessages(context1child0Messages);
		expectNoMessages(context1child0child0Messages);
		expectNoMessages(context1child0child1Messages);
		expectNoMessages(context1child1Messages);
		expectNoMessages(context1child1child0Messages);
		expectNoMessages(context1child1child1Messages);

		clearAllMessages();
		stage.setComponent(null as unknown as Nestable);
		component.$c().send(MESSAGE_NAME, PAYLOAD).onChannel(CHANNEL_NAME).withPropagation(To.DESCENDANTS);

		// Verify messages are broadcasted starting at the set context
		expectNoMessages(contextMessages);
		expectNoMessages(context0Messages);
		expectMessages(context0child0Messages);
		expectMessages(context0child0child0Messages);
		expectMessages(context0child0child1Messages);
		expectMessages(context0child1Messages);
		expectMessages(context0child1child0Messages);
		expectMessages(context0child1child1Messages);
		expectNoMessages(context1Messages);
		expectNoMessages(context1child0Messages);
		expectNoMessages(context1child0child0Messages);
		expectNoMessages(context1child0child1Messages);
		expectNoMessages(context1child1Messages);
		expectNoMessages(context1child1child0Messages);
		expectNoMessages(context1child1child1Messages);
	});

	test("Component instantiated from registry and messages are broadcasted", () => {
		context0.registerSingleton("test-component", TestComponent);
		const component: TestComponent = context0.getObject("test-component");

		component.$c().send(MESSAGE_NAME, PAYLOAD).onChannel(CHANNEL_NAME).withPropagation(To.DESCENDANTS);

		// Verify messages are broadcasted starting at the injected context
		expectNoMessages(contextMessages);
		expectNoMessages(context0Messages);
		expectMessages(context0child0Messages);
		expectMessages(context0child0child0Messages);
		expectMessages(context0child0child1Messages);
		expectMessages(context0child1Messages);
		expectMessages(context0child1child0Messages);
		expectMessages(context0child1child1Messages);
		expectNoMessages(context1Messages);
		expectNoMessages(context1child0Messages);
		expectNoMessages(context1child0child0Messages);
		expectNoMessages(context1child0child1Messages);
		expectNoMessages(context1child1Messages);
		expectNoMessages(context1child1child0Messages);
		expectNoMessages(context1child1child1Messages);
	});

	test("Component instantiated from registry, placed on a stage, and messages are broadcasted", () => {
		context0.registerSingleton("test-component", TestComponent);
		const component: TestComponent = context0.getObject("test-component");
		stage.setComponent(component);

		component.$c().send(MESSAGE_NAME, PAYLOAD).onChannel(CHANNEL_NAME).withPropagation(To.DESCENDANTS);

		// Verify messages are broadcasted starting at the injected context
		expectNoMessages(contextMessages);
		expectNoMessages(context0Messages);
		expectMessages(context0child0Messages);
		expectMessages(context0child0child0Messages);
		expectMessages(context0child0child1Messages);
		expectMessages(context0child1Messages);
		expectMessages(context0child1child0Messages);
		expectMessages(context0child1child1Messages);
		expectNoMessages(context1Messages);
		expectNoMessages(context1child0Messages);
		expectNoMessages(context1child0child0Messages);
		expectNoMessages(context1child0child1Messages);
		expectNoMessages(context1child1Messages);
		expectNoMessages(context1child1child0Messages);
		expectNoMessages(context1child1child1Messages);
	});

	test("Component instantiated from registry has a context set messages are broadcast placed on a stage messages are broadcasted removed from a stage and messages are broadcasted", () => {
		context0.registerSingleton("test-component", TestComponent);
		const component: TestComponent = context0.getObject("test-component");
		component.$c().send(MESSAGE_NAME, PAYLOAD).onChannel(CHANNEL_NAME).withPropagation(To.DESCENDANTS);

		// Verify messages are broadcasted starting at the injected context during all broadcast operations
		expectNoMessages(contextMessages);
		expectNoMessages(context0Messages);
		expectMessages(context0child0Messages);
		expectMessages(context0child0child0Messages);
		expectMessages(context0child0child1Messages);
		expectMessages(context0child1Messages);
		expectMessages(context0child1child0Messages);
		expectMessages(context0child1child1Messages);
		expectNoMessages(context1Messages);
		expectNoMessages(context1child0Messages);
		expectNoMessages(context1child0child0Messages);
		expectNoMessages(context1child0child1Messages);
		expectNoMessages(context1child1Messages);
		expectNoMessages(context1child1child0Messages);
		expectNoMessages(context1child1child1Messages);
		clearAllMessages();

		stage.setComponent(component);
		component.$c().send(MESSAGE_NAME, PAYLOAD).onChannel(CHANNEL_NAME).withPropagation(To.DESCENDANTS);

		// Verify messages are broadcasted starting at the injected context during all broadcast operations
		expectNoMessages(contextMessages);
		expectNoMessages(context0Messages);
		expectMessages(context0child0Messages);
		expectMessages(context0child0child0Messages);
		expectMessages(context0child0child1Messages);
		expectMessages(context0child1Messages);
		expectMessages(context0child1child0Messages);
		expectMessages(context0child1child1Messages);
		expectNoMessages(context1Messages);
		expectNoMessages(context1child0Messages);
		expectNoMessages(context1child0child0Messages);
		expectNoMessages(context1child0child1Messages);
		expectNoMessages(context1child1Messages);
		expectNoMessages(context1child1child0Messages);
		expectNoMessages(context1child1child1Messages);
		clearAllMessages();

		stage.setComponent(null as unknown as Nestable);

		component.$c().send(MESSAGE_NAME, PAYLOAD).onChannel(CHANNEL_NAME).withPropagation(To.DESCENDANTS);

		// Verify messages are broadcasted starting at the injected context during all broadcast operations
		expectNoMessages(contextMessages);
		expectNoMessages(context0Messages);
		expectMessages(context0child0Messages);
		expectMessages(context0child0child0Messages);
		expectMessages(context0child0child1Messages);
		expectMessages(context0child1Messages);
		expectMessages(context0child1child0Messages);
		expectMessages(context0child1child1Messages);
		expectNoMessages(context1Messages);
		expectNoMessages(context1child0Messages);
		expectNoMessages(context1child0child0Messages);
		expectNoMessages(context1child0child1Messages);
		expectNoMessages(context1child1Messages);
		expectNoMessages(context1child1child0Messages);
		expectNoMessages(context1child1child1Messages);
	});

	test("Component manually instantiated and object is retrieved from component's context", () => {
		const expected: any = context.getObject("cydran:behavior:checked:input");
		context.registerConstant("cydran:behavior:checked:input", {});
		const component: TestComponent = new TestComponent();
		const result: any = component.$c().getObject("cydran:behavior:checked:input");

		// Verify object came from global
		expect(result).toStrictEqual(expected);
	});

	test("Component manually instantiated, context is set, and object is retrieved from component's context", () => {
		const expected: any = {};
		context.registerConstant("cydran:behavior:checked:input", expected);
		const component: TestComponent = new TestComponent();
		component.setContext(context);
		const result: any = component.$c().getObject("cydran:behavior:checked:input");

		// Verify object came from set context
		expect(result).toStrictEqual(expected);
	});

	test("Component manually instantiated, context is set, and component is placed on the stage, object is retrieved from component's context", () => {
		const expected: any = {};
		context.registerConstant("cydran:behavior:checked:input", expected);
		const component: TestComponent = new TestComponent();
		component.setContext(context);
		stage.setComponent(component);
		const result: any = component.$c().getObject("cydran:behavior:checked:input");

		// Verify object came from set context
		expect(result).toStrictEqual(expected);
	});

	test("Component instantiated from registry, context is injected, and object is retrieved from context", () => {
		const expected: any = {};
		context.registerConstant("cydran:behavior:checked:input", expected);
		context.registerPrototype("test-component", TestComponent);
		const component: TestComponent = context.getObject("test-component");
		const result: any = component.$c().getObject("cydran:behavior:checked:input");

		// Verify object came from injected context
		expect(result).toStrictEqual(expected);
	});

	test("Component instantiated from registry, context is injected, and component is placed on the stage, and object is retrieved from context", () => {
		const expected: any = {};
		context.registerConstant("cydran:behavior:checked:input", expected);
		context.registerPrototype("test-component", TestComponent);
		const component: TestComponent = context.getObject("test-component");
		stage.setComponent(component);
		const result: any = component.$c().getObject("cydran:behavior:checked:input");

		// Verify object came from injected context
		expect(result).toStrictEqual(expected);
	});

	function assertThrown(expected: string, activity: () => void, expectedType?: string) {
		const actualExpectedType = (expectedType === null || expectedType === undefined) ? "NullValueError" : expectedType;
		let thrown: Error = null as unknown as Error;

		const actualExpected: string = expected.includes(" ") ? expected : `${expected} shall not be null`;

		try {
			activity();
		} catch (e) {
			thrown = e;
		}

		if (!thrown) {
			throw new Error(`Error must be thrown. Expected: ${actualExpected}.`);
		}

		if ((thrown as Error).name !== actualExpectedType) {
			throw new Error(`Must have correct name. Expected: ${actualExpectedType}. Actual: ${(thrown as Error).name}.`);
		}
	}

});
