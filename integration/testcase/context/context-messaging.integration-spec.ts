import { StageImpl, Context, Stage } from 'cydran';
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