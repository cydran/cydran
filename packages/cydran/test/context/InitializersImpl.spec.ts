import InitializersImpl from "context/InitializersImpl";
import { CallBackThisObject } from "CydranTypes";
import { test, expect } from '@jest/globals';

test("execute invokes every registered callback once, in registration order", () => {
	const order: number[] = [];
	const specimen: InitializersImpl<string> = new InitializersImpl<string>();

	specimen.add({}, () => { order.push(1); });
	specimen.add({}, () => { order.push(2); });
	specimen.add({}, () => { order.push(3); });
	specimen.execute("ctx");

	expect(order).toEqual([1, 2, 3]);
});

test("callback receives its thisObject as this and the context as the argument", () => {
	const target: { seenThis: unknown; seenCtx: unknown } = { seenThis: null, seenCtx: null };
	const specimen: InitializersImpl<string> = new InitializersImpl<string>();

	specimen.add(target, function (this: typeof target, ctx: string): void {
		this.seenThis = this;
		this.seenCtx = ctx;
	});
	specimen.execute("CTX");

	expect(target.seenThis).toBe(target);
	expect(target.seenCtx).toBe("CTX");
});

test("execute clears the list; a second execute invokes nothing", () => {
	let count: number = 0;
	const specimen: InitializersImpl<string> = new InitializersImpl<string>();

	specimen.add({}, () => { count += 1; });
	specimen.execute("ctx");
	specimen.execute("ctx");

	expect(count).toBe(1);
});

test("duplicate registration runs the callback twice (no de-duplication)", () => {
	let count: number = 0;
	const target: CallBackThisObject = {};
	const callback: () => void = () => { count += 1; };
	const specimen: InitializersImpl<string> = new InitializersImpl<string>();

	specimen.add(target, callback);
	specimen.add(target, callback);
	specimen.execute("ctx");

	expect(count).toBe(2);
});

// Retention across GC — guards against reverting to weak-reference storage. The callback is registered
// inline with no other strong reference; under weak storage a forced collection could drop it before
// execute() runs. Requires node --expose-gc; skipped (noted) when global.gc is unavailable.
const forceGc: (() => void) | undefined = (globalThis as { gc?: () => void }).gc as (() => void);

(forceGc as unknown ? test : test.skip)("registered callback survives a forced garbage collection", async () => {
	const calls: number[] = [];
	const specimen: InitializersImpl<string> = new InitializersImpl<string>();

	specimen.add({}, () => { calls.push(1); });

	forceGc();
	await new Promise<void>((resolve) => setTimeout(resolve, 0));
	forceGc();

	specimen.execute("ctx");

	expect(calls).toEqual([1]);
});
