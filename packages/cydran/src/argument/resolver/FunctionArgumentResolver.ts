/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ArgumentResolver from 'argument/ArgumentResolver';
import { requireNotNull } from 'util/Utils';
import { IllegalArgumentError } from "error/Errors";
import { JSType } from "CydranConstants";
import { Context } from "context/Context";

class FunctionArgumentResolver implements ArgumentResolver<unknown> {

	private fn: () => unknown;

	constructor(fn: () => unknown) {
		this.fn = requireNotNull(fn, "fn");

		if (typeof this.fn !== JSType.FN) {
			throw new IllegalArgumentError("supplied argument not a function");
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public resolve(context: Context): unknown {

		// TODO - Allow for passing in context this object for use in invocation of the function
		const instance: unknown = this.fn();

		return instance;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default FunctionArgumentResolver;
