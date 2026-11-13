/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import BlogServiceImpl from './BlogServiceImpl';
import { argumentsBuilder, Context } from "@cydran/cydran";

function serviceCapability(context: Context) {
	context.registerSingleton("blogService", BlogServiceImpl, argumentsBuilder().withLogger("BlogServiceImpl").withTransmitter().build());
}

export default serviceCapability;
