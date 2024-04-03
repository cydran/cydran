import { Stage, Context, StageImpl } from 'cydran';
let stage: Stage = null;
let context: Context = null;
let context0: Context = null;
let context1: Context = null;

beforeEach(() => {
	stage = new StageImpl("body", {
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