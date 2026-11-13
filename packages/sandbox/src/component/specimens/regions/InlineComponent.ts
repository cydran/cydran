/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./InlineComponent.html";
import Item from "./Item";

class InlineComponent extends Component {

	constructor() {
		super(TEMPLATE);
	}

	public hello(): void {
		const person: Item = this.$c().getValue();
		window.alert("Hello " + person.firstName + "!");
	}

}

export default InlineComponent;
