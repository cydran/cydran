/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import InternalComponentOptions from "component/InternalComponentOptions";
import { DEFAULT_PREFIX } from "CydranConstants";

const DEFAULT_COMPONENT_OPTIONS: InternalComponentOptions = {
	prefix: DEFAULT_PREFIX,
	parentModelFn: null,
	metadata: {},
	alwaysConnected: false
};

export default DEFAULT_COMPONENT_OPTIONS;
