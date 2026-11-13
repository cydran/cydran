/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Populator from "behavior/core/each/Populator";
import DomUtils from "dom/DomUtils";
import { requireNotNull } from 'util/Utils';

class FragmentPopulator implements Populator {

	private element: HTMLElement;

	private fragment: DocumentFragment;

	constructor(element: HTMLElement) {
		this.element = requireNotNull(element, "element");
		this.fragment = DomUtils.createDocumentFragment();
	}

	public appendChild(node: Node): void {
		this.fragment.appendChild(node);
	}

	public populate(): void {
		this.element.appendChild(this.fragment);
		this.fragment = DomUtils.createDocumentFragment();
	}

}

export default FragmentPopulator;
