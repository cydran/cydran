/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ArgumentResolver from "argument/ArgumentResolver";
import { requireValid } from "util/Utils";
import ScopeImpl from "scope/ScopeImpl";
import { Context } from "context/Context";
import { SCOPE_KEY } from "CydranConstants";

class ScopeItemArgumentResolver implements ArgumentResolver<unknown> {

	private name: string;

	constructor(key: string) {
		this.name = requireValid(key, "key", SCOPE_KEY);
	}

	public resolve(context: Context): unknown {
		const value: unknown = (context.getScope() as ScopeImpl).get(this.name);

		return value;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ScopeItemArgumentResolver;
