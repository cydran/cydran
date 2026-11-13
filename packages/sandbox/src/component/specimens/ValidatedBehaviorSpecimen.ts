/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./ValidatedBehaviorSpecimen.html";

/**
 * Specimen: `c-validated` (`ValidatedBehavior`). Its `onMount()` is currently a TODO stub, so
 * the behavior is a no-op — it mounts without error and does not affect the element. This
 * specimen + test document that current reality; update both when validation is implemented.
 */
class ValidatedBehaviorSpecimen extends Component {

	private value: string;

	constructor() {
		super(TEMPLATE);
		this.value = "editable";
	}

}

export default ValidatedBehaviorSpecimen;
