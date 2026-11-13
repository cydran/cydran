/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

interface PairedWeakMap<K extends object, L extends object, V extends object> {

	set(firstKey: K, secondKey: L, value: V): void;

	get(firstKey: K, secondKey: L): V | undefined;

	delete(firstKey: K, secondKey: L): void;

	has(firstKey: K, secondKey: L): boolean;

	clear(): void;

}

export default PairedWeakMap;