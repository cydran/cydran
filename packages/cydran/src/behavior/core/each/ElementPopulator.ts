/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Populator from "behavior/core/each/Populator";
import { requireNotNull } from "util/Utils";

/**
 * Inserts each node as soon as it is appended. Used where a document fragment can't be used, such as a select.
 */
class ElementPopulator implements Populator {

	private insertFn: (node: Node) => void;

	constructor(insertFn: (node: Node) => void) {
		this.insertFn = requireNotNull(insertFn, "insertFn");
	}

	public appendChild(node: Node): void {
		this.insertFn(node);
	}

	public populate(): void {
		// Intentionally do nothing
	}

}

export default ElementPopulator;
