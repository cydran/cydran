/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component, To } from "@cydran/cydran";
import TEMPLATE from "./Home.html";

class Home extends Component {

	constructor() {
		super(TEMPLATE);
	}

	public handleClick(name: string): void {
		this.$c().send('navigate', name).onChannel('navigation').withPropagation(To.CONTEXT);
	}

}

export default Home;
