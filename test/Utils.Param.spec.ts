import { JSDOM } from "jsdom";
import { extractAttributes } from "util/Utils";

const doc = new JSDOM("<div id='whack' c:click='m().doWork()'></div>").window.document;

test("extractAttributes<T>(prefix: string, el: HTMLElement): T", () => {
	const baseObj = { click: 'm().doWork()' };
	expect(extractAttributes("c", doc.querySelector("div#whack"))["click"]).toEqual(baseObj.click);
});
