/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import IdStrategy from "behavior/core/each/IdStrategy";

class InvalidIdStrategyImpl implements IdStrategy {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public check(item: unknown): boolean {
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public enrich(item: unknown, index: number): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public extract(item: unknown): string {
		return null;
	}

	public init(): void {
		throw new Error('Invalid strategy for "each".  Must be "generated", "none", or "expression".');
	}

}

export default InvalidIdStrategyImpl;
