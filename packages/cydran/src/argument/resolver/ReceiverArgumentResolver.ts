/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ReceiverImpl from "message/ReceiverImpl";
import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import Receiver from 'message/Receiver';

class ReceiverArgumentResolver implements ArgumentResolver<Receiver> {

	public resolve(context: Context): Receiver {
		return new ReceiverImpl(context);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ReceiverArgumentResolver;
