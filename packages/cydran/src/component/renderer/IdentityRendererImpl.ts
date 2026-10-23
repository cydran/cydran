/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Renderer from "component/Renderer";
import { requireNotNull } from "util/Utils";

class IdentityRendererImpl implements Renderer {

	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = requireNotNull(element, "element");
	}

	public render(): HTMLElement {
		return this.element;
	}

}

export default IdentityRendererImpl;