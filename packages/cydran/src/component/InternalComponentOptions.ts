/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ComponentOptions from "component/ComponentOptions";
import { Context, Nestable } from "context/Context";

interface InternalComponentOptions extends ComponentOptions {

	itemFn?: () => unknown;

	parentModelFn?: () => unknown;

	context?: Context;

	alwaysConnected?: boolean;

	parent?: Nestable;

	name?: string;

}

export default InternalComponentOptions;
