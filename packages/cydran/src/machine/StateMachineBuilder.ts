/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import MachineBuilder from "machine/MachineBuilder";
import MachineBuilderImpl from "machine/MachineBuilderImpl";

function stateMachineBuilder<M>(startState: string): MachineBuilder<M> {
	return new MachineBuilderImpl<M>(startState);
}

export default stateMachineBuilder;
