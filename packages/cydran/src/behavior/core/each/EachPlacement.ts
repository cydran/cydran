/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Populator from "behavior/core/each/Populator";

/**
 * Where a list's rendered nodes live. The attribute form renders into its host element, and the element form renders
 * between two comment markers. Every DOM operation the each behavior and its refresh strategies perform on the list's
 * location goes through this interface, so neither needs to know which form it is.
 */
interface EachPlacement {

	/**
	 * Removes every rendered node.
	 */
	clear(): void;

	/**
	 * Adds a node at the end of the list.
	 */
	append(node: Node): void;

	/**
	 * Inserts a node before a rendered node, or at the end of the list when the reference is null.
	 */
	insertBefore(node: Node, reference: Node): void;

	/**
	 * Removes a rendered node.
	 */
	remove(node: Node): void;

	/**
	 * Creates the populator used to append many nodes at once.
	 */
	createPopulator(): Populator;

	/**
	 * Whether the document's active element is inside the list.
	 */
	isFocused(): boolean;

}

export default EachPlacement;
