/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { CallBackThisObject } from 'CydranTypes';
// TODO - Determine if the type argument is necessary

interface Initializers<C> {

	add(thisObject: CallBackThisObject, callback: (context? : C) => void): void;

	execute(context: C): void;

}

export default Initializers;
