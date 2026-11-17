/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Nestable } from "context/Context";
import { MessagePayload } from "CydranTypes";

interface Region {

	hasExpression(): boolean;

	getComponent<N extends Nestable>(): N;

	setComponent(component: Nestable): void;

	tellComponent(name: string, payload: MessagePayload): void;

	messageComponent(channelName: string, messageName: string, payload: MessagePayload): void;

	hasComponent(): boolean;

}

export default Region;
