/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Stage } from "@cydran/cydran";
import ModalContainer from "./ModalContainer";

function modalInitializer(stage: Stage): void {
	const container: ModalContainer = new ModalContainer();
	stage.after().insertLast(container);
}

export { modalInitializer };
