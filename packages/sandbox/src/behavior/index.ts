/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Context } from "@cydran/cydran";
import MarkdownBehavior from './MarkdownBehavior';

function behaviorCapability(context: Context) {
	context.registerPrototype("cydran:behavior:markdown:*", MarkdownBehavior);
}

export default behaviorCapability;
