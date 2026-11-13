/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import MachineState from "machine/MachineState";
import Releasable from "interface/ables/Releasable";

interface State<M> extends Releasable {

	evaluate(input: string, machineState: MachineState<M>, parameter: unknown): boolean;

}

export default State;
