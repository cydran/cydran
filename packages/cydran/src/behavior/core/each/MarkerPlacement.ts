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
import { isDefined, requireNotNull } from "util/Utils";

/**
 * Placement for the <c-each> element: the list is every node between a top and a bottom comment marker. Nodes outside
 * the markers are never touched.
 */
class MarkerPlacement implements EachPlacement {

	private top: Comment;

	private bottom: Comment;

	constructor(top: Comment, bottom: Comment) {
		this.top = requireNotNull(top, "top");
		this.bottom = requireNotNull(bottom, "bottom");
	}

	public clear(): void {
		while (this.top.nextSibling !== this.bottom) {
			this.getParent().removeChild(this.top.nextSibling);
		}
	}

	public append(node: Node): void {
		requireNotNull(node, "node");
		this.getParent().insertBefore(node, this.bottom);
	}

	public insertBefore(node: Node, reference: Node): void {
		requireNotNull(node, "node");
		this.getParent().insertBefore(node, isDefined(reference) ? reference : this.bottom);
	}

	public remove(node: Node): void {
		requireNotNull(node, "node");
		this.getParent().removeChild(node);
	}

	public createPopulator(): Populator {
		const insertFn: (node: Node) => void = (node: Node) => this.getParent().insertBefore(node, this.bottom);
		const parent: Node = this.getParent();
		const select: boolean =
			parent.nodeType === Node.ELEMENT_NODE && (parent as HTMLElement).tagName.toLowerCase() === TagNames.SELECT;

		return select ? new ElementPopulator(insertFn) : new FragmentPopulator(insertFn);
	}

	public isFocused(): boolean {
		const activeElement: Element = DomUtils.getDocument().activeElement;
		let focused: boolean = false;
		let node: Node = this.top.nextSibling;

		while (!focused && isDefined(node) && node !== this.bottom) {
			focused = node.contains(activeElement);
			node = node.nextSibling;
		}

		return focused;
	}

	private getParent(): Node {
		return this.top.parentNode;
	}

}

export default MarkerPlacement;
