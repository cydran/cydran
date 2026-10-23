/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import DigestionCandidate from "digest/DigestionCandidate";
import Tellable from "interface/ables/Tellable";
import Releasable from "interface/ables/Releasable";
import { CallBackThisObject } from "CydranTypes";

interface Mediator<T> extends Releasable, DigestionCandidate, Tellable {

	get(): T;

	set(value: unknown): void;

	watch(thisObject: CallBackThisObject, name: string): void;

}

export default Mediator;
