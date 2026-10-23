/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./SeriesItem.html";

/**
 * A minimal child component used as an element within a `<c-series>`. Each instance
 * renders its own `label`, so tests can assert both count and order of the series.
 */
class SeriesItem extends Component {

	private label: string;

	constructor(label: string) {
		super(TEMPLATE);
		this.label = label;
	}

}

export default SeriesItem;
