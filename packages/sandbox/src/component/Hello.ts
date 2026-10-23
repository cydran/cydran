/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./Hello.html";

interface Item {

	id?: string;

	name: string;

}

class Hello extends Component {

	private name: string;

	private items: Item[];

	private active: boolean;

	constructor() {
		super(TEMPLATE);
		this.items = [];
		this.name = "";
		this.active = false;
	}

	public add(): void {
		this.items.push({
			name: this.name
		});

		this.name = "";
	}

	public resetForm(): void {
		this.$c().forForms().reset();
	}

}

export default Hello;
