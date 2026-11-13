/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import noOp from 'function/noOp';
import { test, expect, jest } from '@jest/globals';

class MockObj {
	public doWork(): void {
		noOp();
	}
}

test("noOp", () => {
	const wkObj: MockObj = new MockObj();
	const wkSpy = jest.spyOn(wkObj, 'doWork');
	wkObj.doWork();
	expect(wkSpy).toBeCalledTimes(1);
});
