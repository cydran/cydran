/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Nestable } from "context/Context";
import { isDefined } from "util/Utils";

function bothPresentButDifferent(first: Nestable, second: Nestable): boolean {
	return isDefined(first) && isDefined(second) && first.$c().getId() !== second.$c().getId();
}

export {
	bothPresentButDifferent
};