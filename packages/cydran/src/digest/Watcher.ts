/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Provider from "interface/Provider";
import { CallBackThisObject } from 'CydranTypes';

interface Watcher<T> extends Provider<T> {

	addCallback(thisObject: CallBackThisObject, callback: () => void): Watcher<T>;

}

export default Watcher;
