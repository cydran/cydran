/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import CacheStrategy from "registry/cache/CacheStrategy";

class NoopCacheStrategyImpl<T> implements CacheStrategy<T> {

	public resolve(supplier: () => T): T {
		const value: T = supplier();

		return value;
	}

	public $release(): void {
		// Intentionally do nothing
	}

}

export default NoopCacheStrategyImpl;
