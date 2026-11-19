/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

type Finalizer<M> = (metadata: M) => void;

interface GarbageCollectablePairedSet<I, J, M> {

	add(firstItem: I, secondItem: J, metadata?: M, finalizer?: Finalizer<M>): void;

	remove(firstItem: I, secondItem: J): void;

	forEach(callback: (firstItem: I, secondItem: J, metadata: M) => void): void;

	clear(): void;

	size(): number;

	isEmpty(): boolean;

	isPopulated(): boolean;

}

export default GarbageCollectablePairedSet;
