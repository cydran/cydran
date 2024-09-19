import { JSDOM } from "jsdom";
import { describe } from "node:test";
import { extractAttributesWithPrefix } from "util/Utils";
import { test, expect } from '@jest/globals';

describe("Utils.Param", () => {

	test("extractAttributesWithPrefix<T>(prefix: string, el: HTMLElement): T", () => {
		const element: HTMLElement = new JSDOM("<body c:foo='first' c:bar='second' c:bat:baz='third'></body>").window.document.body;
		const result: any = extractAttributesWithPrefix("c:", element);

		expect(result["foo"]).toEqual("first");
		expect(result["bar"]).toEqual("second");
		expect(result["bat:baz"]).toEqual("third");
	});

});
