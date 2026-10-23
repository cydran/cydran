/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { VarPredicate, VarConsumer } from "interface/Predicate";
import Machine from "machine/Machine";

interface MachineBuilder<M> {

	withState(state: string, callbacks: VarConsumer<unknown, M>[]): MachineBuilder<M>;

	withTransition(state: string, input: string, targetState: string, callbacks: VarConsumer<unknown, M>[], predicate?: VarPredicate<unknown, M>): MachineBuilder<M>;

	build(): Machine<M>;

}

export default MachineBuilder;
