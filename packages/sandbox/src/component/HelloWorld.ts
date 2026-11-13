/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./HelloWorld.html";

class HelloWorld extends Component {

	private name: string;

	constructor() {
		super(TEMPLATE);
		this.$c().onMessage("updateName").forChannel("helloWorldChannel").invoke("setName");
		this.name = "Anonymous";
	}

	public setName(name: string): void {
		this.name = name;
	}

}

export default HelloWorld;
