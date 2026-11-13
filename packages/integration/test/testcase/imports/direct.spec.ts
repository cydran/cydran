/**
 * @jest-environment jsdom
 */
/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import * as testCydran from "@cydran/cydran";

test("Cydran should be defined and populated", () => {
	expect(testCydran).not.toBeNull();
	expect(testCydran["Component"]).toBeDefined();
});
