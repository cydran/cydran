/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import EachPlacement from "behavior/core/each/EachPlacement";
import Populator from "behavior/core/each/Populator";
import ElementPopulator from "behavior/core/each/ElementPopulator";
import FragmentPopulator from "behavior/core/each/FragmentPopulator";
import DomUtils from "dom/DomUtils";
import { TagNames } from "CydranConstants";
import { removeChildElements, requireNotNull } from "util/Utils";

/**
 * Placement for the c-each attribute form: the list is every child of the host element.
 */
class ElementPlacement implements EachPlacement {

	private element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = requireNotNull(element, "element");
	}

	public clear(): void {
		removeChildElements(this.element);
	}

	public append(node: Node): void {
		requireNotNull(node, "node");
		this.element.appendChild(node);
	}

	public insertBefore(node: Node, reference: Node): void {
		requireNotNull(node, "node");
		this.element.insertBefore(node, reference);
	}

	public remove(node: Node): void {
		requireNotNull(node, "node");
		this.element.removeChild(node);
	}

	public createPopulator(): Populator {
		const insertFn: (node: Node) => void = (node: Node) => this.element.appendChild(node);

		return this.element.tagName.toLowerCase() === TagNames.SELECT
			? new ElementPopulator(insertFn)
			: new FragmentPopulator(insertFn);
	}

	public isFocused(): boolean {
		return DomUtils.elementIsFocused(this.element);
	}

}

export default ElementPlacement;
