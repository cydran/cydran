/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Releasable from "interface/ables/Releasable";
import MessageCallback from "message/MessageCallback";
import { CallBackThisObject } from 'CydranTypes';

interface Broker extends Releasable {

	send(channelName: string, messageName: string, payload?: unknown): void;

	addListener(thisObject: CallBackThisObject, callback: MessageCallback): void;

	removeListener(thisObject: CallBackThisObject, callback: MessageCallback): void;

}

export default Broker;
