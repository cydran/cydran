/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Releasable from "interface/ables/Releasable";

interface Listener extends Releasable {

	register(messageName: string, callback: (payload: unknown) => void, before?: () => void, after?: () => void): void;

	receive(messageName: string, payload: unknown): void;

}

export default Listener;
