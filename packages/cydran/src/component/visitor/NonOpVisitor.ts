/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ElementVisitor from "component/visitor/ElementVisitor";

class NonOpVisitor<C> implements ElementVisitor<HTMLElement | Text | Comment, C> {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public visit(element: HTMLElement | Text | Comment, internals: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		// Intentionally do nothing
	}

}

export default NonOpVisitor;
