import { JSDOM } from "jsdom";
import { extractAttributes } from "util/Utils";

test("extractAttributes<T>(prefix: string, el: HTMLElement): T", () => {
	const element: HTMLElement = new JSDOM("<body c:foo='first' c:bar='second' c:bat:baz='third'></body>").window.document.body;
	const result: any = extractAttributes("c:", element);

	expect(result["foo"]).toEqual("first");
	expect(result["bar"]).toEqual("second");
	expect(result["bat:baz"]).toEqual("third");
});
