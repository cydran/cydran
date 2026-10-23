/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

interface WatchContinuation {

	reducedBy<T>(reducerFn: (input: unknown) => T): WatchContinuation;

	invoke(name: string): void;

}

export default WatchContinuation;
