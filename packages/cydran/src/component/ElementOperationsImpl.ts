/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ElementOperations from "component/ElementOperations";
import { requireNotNull } from "util/Utils";

class ElementOperationsImpl<E extends HTMLElement> implements ElementOperations<E> {

	private element: E;

	constructor(element: E) {
		this.element = requireNotNull(element, "element");
	}

	public get(): E {
		return this.element;
	}

	public focus(): void {
		setTimeout(() => {
			this.element.focus();
		}, 1);
	}

	public blur(): void {
		setTimeout(() => {
			this.element.blur();
		}, 1);
	}
}

export default ElementOperationsImpl;
