/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { CallBackThisObject } from "CydranTypes";

interface Observable {

	notify(...payload: unknown[]): void;

	register(thisObject: CallBackThisObject, callback: (...payload: unknown[]) => void, predicate?: (...payload: unknown[]) => boolean, mapper?: (key: string, value: unknown) => unknown): void;

	unregister(thisObject: CallBackThisObject, callback: (...payload: unknown[]) => void): void;

}

export default Observable;
