/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Populator from "behavior/core/each/Populator";
import DomUtils from "dom/DomUtils";
import { requireNotNull } from "util/Utils";

/**
 * Collects appended nodes in a document fragment and inserts them all at once when populated.
 */
class FragmentPopulator implements Populator {

	private insertFn: (node: Node) => void;

	private fragment: DocumentFragment;

	constructor(insertFn: (node: Node) => void) {
		this.insertFn = requireNotNull(insertFn, "insertFn");
		this.fragment = DomUtils.createDocumentFragment();
	}

	public appendChild(node: Node): void {
		this.fragment.appendChild(node);
	}

	public populate(): void {
		this.insertFn(this.fragment);
		this.fragment = DomUtils.createDocumentFragment();
	}

}

export default FragmentPopulator;
