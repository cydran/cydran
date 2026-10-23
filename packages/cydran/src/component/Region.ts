/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Nestable } from "context/Context";

interface Region {

	hasExpression(): boolean;

	getComponent<N extends Nestable>(): N;

	setComponent(component: Nestable): void;

	tellComponent(name: string, payload: unknown): void;

	messageComponent(channelName: string, messageName: string, payload: unknown): void;

	hasComponent(): boolean;

}

export default Region;
