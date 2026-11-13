/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import StageComponent from "stage/StageComponent";
import { describe, expect, test } from '@jest/globals';
import GlobalContextImpl from "context/GlobalContextImpl";
import Renderer from 'component/Renderer';
import StageRendererImpl from 'component/renderer/StageRendererImpl';

expect(GlobalContextImpl).not.toBeNull();

describe("StageComponent", () => {

	test("instantiation and whole", () => {
		const renderer: Renderer = new StageRendererImpl("body");
		const specimen: StageComponent = new StageComponent(renderer);
		expect(specimen).not.toBeNull();
	});

});