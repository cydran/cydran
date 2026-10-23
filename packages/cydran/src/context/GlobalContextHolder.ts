/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { requireNotNull } from 'util/Utils';
import GlobalContext from 'context/GlobalContext';

class GlobalContextHolder {

	private static instance: GlobalContext;

	private constructor() {
		GlobalContextHolder.instance = null;
	}

	public static getContext(): GlobalContext {
		return GlobalContextHolder.instance;
	}

	public static setContext(context: GlobalContext): void {
		GlobalContextHolder.instance = requireNotNull(context, "context");
	}

}

export default GlobalContextHolder;
