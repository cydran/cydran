/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./TutorialChild.html";

class TutorialChild extends Component {

	private localValue: string;

	constructor() {
		super(TEMPLATE);
		this.$c().onMessage("testMessage").forChannel("testGlobal").invoke("reset");
		this.reset();
	}

	public reset(): void {
		this.localValue = "initialized";
	}

	public handleClick(): void {
		console.log(this.$c().getValue());
		this.$c().getValue()["color"] = "#ff0000";
		console.log(this.$c().getValue());
	}

}

export default TutorialChild;
