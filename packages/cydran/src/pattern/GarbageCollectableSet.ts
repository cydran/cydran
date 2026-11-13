/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

type Finalizer<M> = (metadata: M) => void;

interface GarbageCollectableSet<I, M> {

	add(item: I, metadata?: M, finalizer?: Finalizer<M>): void;

	remove(item: I): void;

	forEach(callback: (item: I, metadata: M) => void): void;

	clear(): void;

	size(): number;

	isEmpty(): boolean;

	isPopulated(): boolean;

}

export default GarbageCollectableSet;
