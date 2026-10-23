/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

interface StringSet {

	add(value: string): void;

	remove(value: string): void;

	contains(value: string): boolean;

	clear(): void;

	size(): number;

	isEmpty(): boolean;

	isPopulated(): boolean;

}

export default StringSet;
