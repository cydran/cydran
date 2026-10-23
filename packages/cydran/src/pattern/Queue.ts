/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Consumer } from 'interface/Predicate';

interface Queue<T> {

	add(item: T): void;

	pop(): T;

	isEmpty(): boolean;

	isPopulated(): boolean;

	transform(tranformFunction: (item: T, consumer: Consumer<T>) => void): void;

}

export default Queue;