/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { JSDOM } from "jsdom";
import { extractAttributesWithPrefix } from "util/Utils";
import { describe, test, expect } from '@jest/globals';

describe("Utils.Param", () => {

	test("extractAttributesWithPrefix<T>(prefix: string, el: HTMLElement): T", () => {
		const element: HTMLElement = new JSDOM("<body c:foo='first' c:bar='second' c:bat:baz='third'></body>").window.document.body;
		const result: any = extractAttributesWithPrefix("c:", element, ["foo", "bar", "bat:baz"]);

		expect(result["foo"]).toEqual("first");
		expect(result["bar"]).toEqual("second");
		expect(result["bat:baz"]).toEqual("third");
	});

});
