/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ListenerImpl from 'message/ListenerImpl';
import { describe, expect, test } from '@jest/globals';

function getThisObject() {
	return {
		handler: function (payload: any) {
			this.value = payload;
		},
		value: "bat"
	};
}

describe("ListenerImpl", () => {

	test("Correct message consumed", () => {
		const thisObject: any = getThisObject();
		const listener: ListenerImpl = new ListenerImpl(() => thisObject);
		listener.register("messageName", thisObject.handler);
		listener.receive("messageName", "baz");

		expect(thisObject.value).toEqual("baz");
	});

});
