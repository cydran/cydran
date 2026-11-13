/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

interface ElementVisitor<E extends HTMLElement | Text | Comment, C> {

	visit(element: E, internals: C, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void;

}

export default ElementVisitor;
