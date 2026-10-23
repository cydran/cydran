/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./SharedModel.html";

class SharedModel extends Component {

	private value: string;

	constructor() {
		super(TEMPLATE);
		this.value = "";
	}

}

export default SharedModel;
