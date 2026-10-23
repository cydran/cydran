/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ArgumentResolver from "argument/ArgumentResolver";
import { Context } from "context/Context";

class ImplicitConfigurationArgumentResolver implements ArgumentResolver<unknown> {

	private options: unknown;

	constructor(options: unknown) {
		this.options = options;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public resolve(context: Context): unknown {
		return this.options;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ImplicitConfigurationArgumentResolver;