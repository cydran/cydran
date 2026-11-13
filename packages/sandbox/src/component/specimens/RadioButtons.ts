/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./RadioButtons.html";

interface Item {

	id: string | number;

	label: string;

}

class RadioButtons extends Component {

	private items: Item[];

	private choice: string = "";

	constructor() {
		super(TEMPLATE);
		this.items = [
			{ id: 0, label: "Zero" },
			{ id: 1, label: "One" },
			{ id: 2, label: "Two" },
			{ id: 3, label: "Three" },
			{ id: 4, label: "Four" }
		];
	}

}

export default RadioButtons;
