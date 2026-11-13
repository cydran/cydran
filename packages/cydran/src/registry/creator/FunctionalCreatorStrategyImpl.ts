/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import CreatorStrategy from "registry/creator/CreatorStrategy";
import { requireNotNull } from "util/Utils";

class FunctionalCreatorStrategyImpl<T> implements CreatorStrategy<T> {

	private fn: (argumentValues: unknown[]) => T;

	constructor(fn: (argumentValues: unknown[]) => T) {
		this.fn = requireNotNull(fn, "fn");
	}

	public $release(): void {
		this.fn = null;
	}

	public create(): (argumentValues: unknown[]) => T {
		return this.fn;
	}

}

export default FunctionalCreatorStrategyImpl;
