/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Releasable from "interface/ables/Releasable";
import { Context } from 'context/Context';

interface Factory<T> extends Releasable {

	get(localContext: Context, originContext: Context, instanceArguments: unknown[]): T;

}

export default Factory;
