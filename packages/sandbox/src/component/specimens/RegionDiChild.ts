/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./RegionDiChild.html";

/**
 * DI-registered child (no constructor args) so it can be placed into a region via
 * `$c().regions().setByObjectId(name, "regionDiChild")`.
 */
class RegionDiChild extends Component {

	private tag: string;

	constructor() {
		super(TEMPLATE);
		this.tag = "DI";
	}

}

export default RegionDiChild;
