/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Tellable from "interface/ables/Tellable";
import Behavior from "behavior/Behavior";
import { Context } from "context/Context";

interface Behaviors extends Tellable {

	add(behavior: Behavior<unknown, HTMLElement | Text, unknown>): void;

	isEmpty(): boolean;

	isPopulated(): boolean;

	message(channelName: string, messageName: string, payload?: unknown): void;

	setContext(context: Context): void;

}

export default Behaviors;
