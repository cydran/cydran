/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { isDefined } from 'util/Utils';
import { Context } from 'context/Context';
import { ContextUnavailableError } from "error/Errors";
import Transmitter from 'message/Transmitter';
import { To } from 'CydranConstants';

class TransmitterImpl implements Transmitter {

	private context: Context;

	constructor(context: Context) {
		this.context = context;
	}

	public setContext(context: Context): void {
		this.context = context;
	}

	public send(propagation: To, channelName: string, messageName: string, payload?: unknown, startFrom?: string): void {
		this.getContext().send(propagation, channelName, messageName, payload, startFrom);
	}

	private getContext(): Context {
		if (!isDefined(this.context)) {
			throw new ContextUnavailableError("Context is not available for messaging.");
		}

		return this.context;
	}

}

export default TransmitterImpl;
