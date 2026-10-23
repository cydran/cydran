/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Notifyable from "interface/ables/Notifyable";
import DigestionCandidateConsumer from "digest/DigestionCandidateConsumer";

interface DigestionState extends DigestionCandidateConsumer {

	digest(): Notifyable[];

}

export default DigestionState;
