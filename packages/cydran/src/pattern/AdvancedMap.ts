/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Consumer } from "interface/Predicate";

interface AdvancedMap<T> {

	each(consumer: Consumer<T>): void;

	has(key: string): boolean;

	lacks(key: string): boolean;

	clear(): void;

	put(key: string, value: T): void;

	get(key: string): T;

	keys(): string[];

	remove(key: string): void;

	computeIfAbsent(key: string, supplier: (key: string) => T): T;

}

export default AdvancedMap;
