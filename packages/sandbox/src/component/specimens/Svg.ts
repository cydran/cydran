/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./Svg.html";

class Svg extends Component {

	private color: string;

	private hideImage: boolean = true;

	constructor() {
		super(TEMPLATE);
		this.color = "#97c024";
		this.hideImage = true;
	}

	public toggleImage(): void {
		this.hideImage = !this.hideImage;
	}

}

export default Svg;
