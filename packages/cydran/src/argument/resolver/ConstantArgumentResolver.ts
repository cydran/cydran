/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Context } from "context/Context";
import ArgumentResolver from 'argument/ArgumentResolver';

class ConstantArgumentResolver implements ArgumentResolver<unknown> {

	private value: unknown;

	constructor(value: unknown) {
		this.value = value;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public resolve(context: Context): unknown {
		return this.value;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ConstantArgumentResolver;
