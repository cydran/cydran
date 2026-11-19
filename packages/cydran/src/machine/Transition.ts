/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Releasable from "interface/ables/Releasable";
import MachineState from "machine/MachineState";

interface Transition<M> extends Releasable {

	execute(state: MachineState<M>, parameter: unknown): boolean;

	executeCallbacks(model: M, parameter: unknown): void;

	getTargetState(): string;

}

export default Transition;
