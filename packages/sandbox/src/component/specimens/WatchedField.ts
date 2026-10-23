/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./WatchedField.html";

class WatchedField extends Component {

	private myField: string;

	private regex: RegExp = new RegExp("[^a-zA-Z0-9 ]+");

	constructor() {
		super(TEMPLATE);
		this.myField = "Kilroy was here";
		this.$c().onExpressionValueChange("m().myField").invoke("onMyFieldChange");
	}

	public onMyFieldChange(previous: string, current: string): void {
		this.myField = current.replace(this.regex, '');
	}

}

export default WatchedField;
