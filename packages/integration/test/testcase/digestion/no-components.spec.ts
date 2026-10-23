/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { create, Stage } from "@cydran/cydran";
import { describe, test, expect } from '@jest/globals';

describe("Digestion - No components", () => {

	test("Digestion - No behaviors", () => {
		document.body.innerHTML = '<div></div>';

		const stage: Stage = create("body", { "cydran.logging.level": "WARN" });
		stage.start();

		expect(stage.isStarted()).toEqual(true);
		expect(stage.getContext().getObject("cydranStage")).not.toBeNull();
	});

});
