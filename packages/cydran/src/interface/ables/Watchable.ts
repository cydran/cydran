/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { CallBackThisObject } from "CydranTypes";

interface Watchable {

	onExpressionValueChange<T>(expression: string, thisObject: CallBackThisObject, name: string, reducerFn?: (input: unknown) => T): void;

	/**
	 * Evaluates an expression.
	 * @param expression Expression to evaluate.
	 */
	evaluate<T>(expression: string): T;

	getWatchScope(): unknown;

}

export default Watchable;
