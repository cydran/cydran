/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./RegionChild.html";

/**
 * Child component placed into a region. Renders its own `tag` (identity) and the value
 * surfaced from the parent via the region's `value` expression (`v().label`).
 */
class RegionChild extends Component {

	private tag: string;

	constructor(tag: string) {
		super(TEMPLATE);
		this.tag = tag;
	}

}

export default RegionChild;
