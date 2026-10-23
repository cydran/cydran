/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { test, expect, beforeAll, describe } from "@jest/globals";
import ConsoleAppender from 'log/appender/ConsoleAppender';

let specimen: ConsoleAppender = null;

describe("ConsoleAppender", () => {

	beforeAll(() => {
		specimen = new ConsoleAppender("id");
	});

	test("ConsoleAppender is not null", () => {
		expect(specimen).not.toBeNull();
	});

});
