/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Populator from "behavior/core/each/Populator";
import { requireNotNull } from 'util/Utils';

class ElementPopulator implements Populator {

	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = requireNotNull(element, "element");
	}

	public appendChild(node: Node): void {
		this.element.appendChild(node);
	}

	public populate(): void {
		// Intentionally do nothing
	}

}

export default ElementPopulator;
