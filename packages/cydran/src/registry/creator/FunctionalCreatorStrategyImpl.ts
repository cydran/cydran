/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import CreatorStrategy from "registry/creator/CreatorStrategy";
import { requireNotNull } from "util/Utils";
import { ConstructorArgument } from "CydranTypes";

class FunctionalCreatorStrategyImpl<T> implements CreatorStrategy<T> {

	private fn: (argumentValues: ConstructorArgument[]) => T;

	constructor(fn: (argumentValues: ConstructorArgument[]) => T) {
		this.fn = requireNotNull(fn, "fn");
	}

	public $release(): void {
		this.fn = null;
	}

	public create(): (argumentValues: ConstructorArgument[]) => T {
		return this.fn;
	}

}

export default FunctionalCreatorStrategyImpl;
