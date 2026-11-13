/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component, To } from "@cydran/cydran";
import TEMPLATE from "./Modals.html";

class Modals extends Component {

	constructor() {
		super(TEMPLATE);
	}

	public popModal(): void {
		this.$c().send('show', {
			title: 'Confirmation 1',
			name: 'helloWorld',
			closeable: true
		})
		.onChannel('modal')
		.withPropagation(To.GLOBALLY);
	}

	public popOtherModal(): void {
		this.$c().send('show', {
			title: 'Confirmation 1',
			name: 'helloWorld2',
			closeable: false
		})
		.onChannel('modal')
		.withPropagation(To.GLOBALLY);
	}

	public popBlogModal(): void {
		this.$c().send('show', {
			title: "Blog",
			name: "wazzup",
			closeable: true
		})
		.onChannel('modal')
		.withPropagation(To.GLOBALLY);
	}

}

export default Modals;
