/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Phase from "filter/Phase";

class IdentityPhaseImpl implements Phase {

	public process(items: unknown[]): unknown[] {
		return items;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public setCallback(callback: () => void): void {
		// Intentionally do nothing
	}

	public invalidate(): void {
		// Intentionally do nothing
	}

}

export default IdentityPhaseImpl;
