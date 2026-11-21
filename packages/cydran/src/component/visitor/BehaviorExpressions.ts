/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { endsWith, startsWith, trim } from "util/Utils";
import { LSB, LSQ, RSB, RSQ } from "Tokens";

/**
 * Removes the {{ }} or [[ ]] delimiters around a behavior expression, if present.
 */
function trimBehaviorExpression(value: string): string {
	let result: string = trim(value, LSQ, RSQ);

	if (result === value) {
		result = trim(value, LSB, RSB);
	}

	return result;
}

/**
 * Whether a behavior expression is watched. An expression written [[ ]] is evaluated once and not watched.
 */
function isMutableBehaviorExpression(value: string): boolean {
	return !(startsWith(value, LSB) && endsWith(value, RSB));
}

export { trimBehaviorExpression, isMutableBehaviorExpression };
