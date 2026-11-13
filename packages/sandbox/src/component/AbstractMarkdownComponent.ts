/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./AbstractMarkdownComponent.html";

abstract class AbstractMarkdownComponent extends Component {

	private documentTitle: string;

	private markdown: string;

	private focusForced: boolean;

	constructor(title: string, markdown: string) {
		super(TEMPLATE, {
			metadata: {
				title: title,
				markdown: markdown
			}
		});
		this.documentTitle = this.$c().metadata().get("title");
		this.markdown = this.$c().metadata().get("markdown");
		this.focusForced = true;
	}

	public toggleForcedFocus(): void {
		this.focusForced = !this.focusForced;
	}

	public imposeFocus(): void {
		this.$c().forElement("focused-input").focus();
	}

}

export default AbstractMarkdownComponent;
