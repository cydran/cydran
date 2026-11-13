/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import IdentityRendererImpl from "component/renderer/IdentityRendererImpl";
import DomUtils from 'dom/DomUtils';

let renderer: IdentityRendererImpl = null;
let wkElem: HTMLElement = null;

beforeEach(() => {
	wkElem = DomUtils.createElement("div");
});

afterEach(() => {
	renderer = null;
	wkElem = null;
});

test("renderer is whole and ready", () => {
	renderer = new IdentityRendererImpl(wkElem);
	expect(renderer).not.toBeNull();
});

test("render the template", () => {
	renderer = new IdentityRendererImpl(wkElem);
	const result: HTMLElement = renderer.render();
	expect(result instanceof HTMLDivElement).toBe(true);
});
