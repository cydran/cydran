/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { requireNotNull } from 'util/Utils';
import Logger from 'log/Logger';

class LoggerArgumentResolver implements ArgumentResolver<Logger> {

	private key: string;

	private label: string;

	constructor(key: string, label?: string) {
		this.key = requireNotNull(key, "key");
		this.label = label;
	}

	public resolve(context: Context): Logger {
		return context.getObject("logger", this.key, this.label) as Logger;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default LoggerArgumentResolver;
