/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./MultiSelects.html";

interface Item {

	name: string;

	value: number;

}

class MultiSelects extends Component {

	private myValues: string[];

	private insideList: Item[];

	constructor() {
		super(TEMPLATE);
		this.myValues = ["2", "4"];
		this.insideList = [
			{ name: 'Name 1', value: 1 },
			{ name: 'Name 2', value: 2 },
			{ name: 'Name 3', value: 3 },
			{ name: 'Name 4', value: 4 },
			{ name: 'Name 5', value: 5 }
		];
	}

}

export default MultiSelects;
