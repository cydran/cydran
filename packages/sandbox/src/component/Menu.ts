/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component, To } from "@cydran/cydran";
import TEMPLATE from "./Menu.html";

class Menu extends Component {

	private expanded: boolean;

	private label: string;

	constructor() {
		super(TEMPLATE);
		this.expanded = false;
		this.label = "Cydran"
	}

	public handleClick(name: string): void {
		this.$c().send('navigate', name).onChannel('navigation').withPropagation(To.CONTEXT);
	}

	public handleMenuToggle(): void {
		this.expanded = !this.expanded;
	}

	public sendUpdate(): void {
		this.$c().send("updateName", "Bob").onChannel("helloWorldChannel").withPropagation(To.GLOBALLY);
	}

	public getLabel(): string {
		return this.label;
	}

}

export default Menu;
