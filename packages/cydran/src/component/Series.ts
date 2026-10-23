/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Nestable } from "context/Context";

interface Series {

	getAt<N extends Nestable>(index: number): N;

	replace(oldComponent: Nestable, newComponent: Nestable): void;

	replaceAt(index: number, component: Nestable): void;

	remove(component: Nestable): void;

	removeAt(index: number): void;

	insertBefore(index: number, component: Nestable): void;

	insertAfter(index: number, component: Nestable): void;

	insertFirst(component: Nestable): void;

	insertLast(component: Nestable): void;

	tellComponents(name: string, payload: unknown): void;

	messageComponents(channelName: string, messageName: string, payload: unknown): void;

	hasComponents(): boolean;

	contains(component: Nestable): boolean;

	isEmpty(): boolean;

	clear(): void;

}

export default Series;
