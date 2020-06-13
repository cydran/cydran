import { JSDOM } from "jsdom";
import { extractParams, extractAttributes } from "@/util/ParamUtils";

const doc = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window.document;

test("extractParams<T>(tagName: string, el: HTMLElement): T", () => {
	// TODO: fix stub
});

test("extractAttributes<T>(prefix: string, el: HTMLElement): T", () => {
	const baseObj = { click: 'm().doWork()' };
	expect(extractAttributes("c", doc.querySelector("div#whack"))["click"]).toEqual(baseObj.click);
});
