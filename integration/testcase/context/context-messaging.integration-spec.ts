import { StageImpl, Context, Stage } from 'cydran';
import { expect } from '@jest/globals';

let stage: Stage = null;
let context: Context = null;

beforeEach(() => {
	stage = new StageImpl("body", {
		"cydran.startup.synchronous": true
	});
	stage.start();
	context = stage.getContext();
});

test("Context Messaging - Global broadcast", () => {
	const context0: Context = context.addChild("context0");
	const context0child0: Context = context0.addChild("context0child0");
	const context0child0child0: Context = context0child0.addChild("context0child0child0");
	const context0child0child1: Context = context0child0.addChild("context0child0child1");
	const context0child1: Context = context0.addChild("context0child1");
	const context0child1child0: Context = context0child1.addChild("context0child1child0");
	const context0child1child1: Context = context0child1.addChild("context0child1child1");

	const context1: Context = context.addChild("context1");
	const context1child0: Context = context1.addChild("context1child0");
	const context1child0child0: Context = context1child0.addChild("context1child0child0");
	const context1child0child1: Context = context1child0.addChild("context1child0child1");
	const context1child1: Context = context1.addChild("context1child1");
	const context1child1child0: Context = context1child1.addChild("context1child1child0");
	const context1child1child1: Context = context1child1.addChild("context1child1child1");


});

