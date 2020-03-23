import { assertNoErrorThrown, assertNullGuarded } from "@/util/TestUtils";
import { assert, expect } from "chai";
import { JSDOM } from "jsdom";
import { describe, it, xit } from "mocha";
import { spy, verify, when } from "ts-mockito";
import { extractParams, extractAttributes } from "@/util/ParamUtils";

describe("ParamUtils tests", () => {
	const doc = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window.document;

	xit("extractParams<T>(tagName: string, el: HTMLElement): T", () => {
		// TODO: fix stub
	});

	it("extractAttributes<T>(prefix: string, el: HTMLElement): T", () => {
		const baseObj = { click: 'm().doWork()' };
		assert.equal(baseObj.click, extractAttributes("c", doc.querySelector("div#whack"))["click"]);
	});

});
