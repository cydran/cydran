import { StageImpl, Context, Stage } from "@cydran/cydran";
import { expect } from '@jest/globals';
import MessageCallback from 'message/MessageCallback';

interface Message {
	channel: string;
	message: string;
	payload: any;
}

const CHANNEL_NAME: string = "test-channel";
const MESSAGE_NAME: string = "test-message";
const PAYLOAD: string = "test-payload";

let stage: Stage = null;
let context: Context = null;
let contextMessages: Message[] = [];
let context0: Context = null;
let context0Messages: Message[] = [];
let context0child0: Context = null;
let context0child0Messages: Message[] = [];
let context0child0child0: Context = null;
let context0child0child0Messages: Message[] = [];
let context0child0child1: Context = null;
let context0child0child1Messages: Message[] = [];
let context0child1: Context = null;
let context0child1Messages: Message[] = [];
let context0child1child0: Context = null;
let context0child1child0Messages: Message[] = [];
let context0child1child1: Context = null;
let context0child1child1Messages: Message[] = [];
let context1: Context = null;
let context1Messages: Message[] = [];
let context1child0: Context = null;
let context1child0Messages: Message[] = [];
let context1child0child0: Context = null;
let context1child0child0Messages: Message[] = [];
let context1child0child1: Context = null;
let context1child0child1Messages: Message[] = [];
let context1child1: Context = null;
let context1child1Messages: Message[] = [];
let context1child1child0: Context = null;
let context1child1child0Messages: Message[] = [];
let context1child1child1: Context = null;
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

beforeEach(() => {
	stage = new StageImpl("body", {
		"cydran.startup.synchronous": true
	});
	stage.start();
	context = stage.getContext();
	contextMessages = [];
	context.addListener(createListener(contextMessages));

	context0 = context.addChild("context0");
	context0Messages = [];
	context0.addListener(createListener(context0Messages));

	context0child0 = context0.addChild("context0child0");
	context0child0Messages = [];
	context0child0.addListener(createListener(context0child0Messages));

	context0child0child0 = context0child0.addChild("context0child0child0");
	context0child0child0Messages = [];
	context0child0child0.addListener(createListener(context0child0child0Messages));

	context0child0child1 = context0child0.addChild("context0child0child1");
	context0child0child1Messages = [];
	context0child0child1.addListener(createListener(context0child0child1Messages));

	context0child1 = context0.addChild("context0child1");
	context0child1Messages = [];
	context0child1.addListener(createListener(context0child1Messages));

	context0child1child0 = context0child1.addChild("context0child1child0");
	context0child1child0Messages = [];
	context0child1child0.addListener(createListener(context0child1child0Messages));

	context0child1child1 = context0child1.addChild("context0child1child1");
	context0child1child1Messages = [];
	context0child1child1.addListener(createListener(context0child1child1Messages));

	context1 = context.addChild("context1");
	context1Messages = [];
	context1.addListener(createListener(context1Messages));

	context1child0 = context1.addChild("context1child0");
	context1child0Messages = [];
	context1child0.addListener(createListener(context1child0Messages));

	context1child0child0 = context1child0.addChild("context1child0child0");
	context1child0child0Messages = [];
	context1child0child0.addListener(createListener(context1child0child0Messages));

	context1child0child1 = context1child0.addChild("context1child0child1");
	context1child0child1Messages = [];
	context1child0child1.addListener(createListener(context1child0child1Messages));

	context1child1 = context1.addChild("context1child1");
	context1child1Messages = [];
	context1child1.addListener(createListener(context1child1Messages));

	context1child1child0 = context1child1.addChild("context1child1child0");
	context1child1child0Messages = [];
	context1child1child0.addListener(createListener(context1child1child0Messages));

	context1child1child1 = context1child1.addChild("context1child1child1");
	context1child1child1Messages = [];
	context1child1child1.addListener(createListener(context1child1child1Messages));
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

test("Context Messaging - Global broadcast", () => {
	context.sendGlobally(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectMessages(contextMessages);
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

test("Context Messaging - Send to context - Root", () => {
	context.sendToContext(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectNoMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectNoMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to context - Not Root", () => {
	context1.sendToContext(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectNoMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectNoMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to context - Leaf", () => {
	context1child1child1.sendToContext(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectNoMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectNoMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectNoMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectMessages(context1child1child1Messages);
});

test("Context Messaging - Send to Descendants - Root", () => {
	context.sendToDescendants(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
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

test("Context Messaging - Send to Descendants - Not Root", () => {
	context1.sendToDescendants(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectNoMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectNoMessages(context1Messages);
	expectMessages(context1child0Messages);
	expectMessages(context1child0child0Messages);
	expectMessages(context1child0child1Messages);
	expectMessages(context1child1Messages);
	expectMessages(context1child1child0Messages);
	expectMessages(context1child1child1Messages);
});

test("Context Messaging - Send to Descendants - Leaf", () => {
	context1child1child1.sendToDescendants(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectNoMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectNoMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectNoMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to sendToImmediateChildren - Root", () => {
	context.sendToImmediateChildren(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectNoMessages(contextMessages);
	expectMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectNoMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to sendToImmediateChildren - Not Root", () => {
	context1.sendToImmediateChildren(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectNoMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectNoMessages(context1Messages);
	expectMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to sendToImmediateChildren - Leaf", () => {
	context1child1child1.sendToImmediateChildren(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectNoMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectNoMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectNoMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to sendToParent - Root", () => {
	context.sendToParent(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectNoMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectNoMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to sendToParent - Not Root", () => {
	context1.sendToParent(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectNoMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectNoMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to sendToParent - Leaf", () => {
	context1child1child1.sendToParent(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectNoMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectNoMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to sendToParents - Root", () => {
	context.sendToParents(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectNoMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectNoMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to sendToParents - Not Root", () => {
	context1child1.sendToParents(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectNoMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to sendToParents - Leaf", () => {
	context1child1child1.sendToParents(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});

test("Context Messaging - Send to Root", () => {
	context.sendToRoot(CHANNEL_NAME, MESSAGE_NAME, PAYLOAD);
	expectMessages(contextMessages);
	expectNoMessages(context0Messages);
	expectNoMessages(context0child0Messages);
	expectNoMessages(context0child0child0Messages);
	expectNoMessages(context0child0child1Messages);
	expectNoMessages(context0child1Messages);
	expectNoMessages(context0child1child0Messages);
	expectNoMessages(context0child1child1Messages);
	expectNoMessages(context1Messages);
	expectNoMessages(context1child0Messages);
	expectNoMessages(context1child0child0Messages);
	expectNoMessages(context1child0child1Messages);
	expectNoMessages(context1child1Messages);
	expectNoMessages(context1child1child0Messages);
	expectNoMessages(context1child1child1Messages);
});
