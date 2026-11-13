/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { describe, expect, test } from '@jest/globals';
import getLogger from 'log/getLogger';
import Logger from 'log/Logger';
import { requireNotNull } from "util/Utils";
import GlobalContextImpl from "context/GlobalContextImpl";

requireNotNull(GlobalContextImpl, "GlobalContextImpl");

describe("getLogger", () => {

	test("Not null", () => {
		const specimen: Logger = getLogger("test", "test");
		expect(specimen).not.toBeNull();
	});
	
});
