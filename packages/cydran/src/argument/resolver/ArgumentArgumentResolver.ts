/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Context } from "context/Context";
import { isDefined, requireNotNull } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';

class ArgumentArgumentResolver implements ArgumentResolver<unknown> {

	private index: number;

	constructor(index: number) {
		this.index = requireNotNull(index, "index");
	}

	public resolve(context: Context, instanceArguments: unknown[] = []): unknown {
		return isDefined(instanceArguments) && isDefined(instanceArguments[this.index])
			? instanceArguments[this.index]
			: null;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ArgumentArgumentResolver;
