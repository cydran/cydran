/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Evaluatable from "interface/ables/Evaluatable";
import Notifyable from "interface/ables/Notifyable";

interface DigestionCandidate extends Evaluatable, Notifyable {

	getExpression(): string;

}

export default DigestionCandidate;
