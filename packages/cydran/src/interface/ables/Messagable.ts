/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import SendContinuation from "continuation/SendContinuation";
import { MessagePayload } from "CydranTypes";

interface Messagable {

	send(messageName: string, payload?: MessagePayload): SendContinuation;

}

export default Messagable;
