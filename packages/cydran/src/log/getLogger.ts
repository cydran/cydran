/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Logger from 'log/Logger';

import { requireNotNull } from "util/Utils";
import GlobalContextHolder from "context/GlobalContextHolder";

function getLogger(key: string, label?: string): Logger {
	requireNotNull(key, "key");

	return GlobalContextHolder.getContext().getObject("logger", key, label);
}

export default getLogger;