/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { AbstractBehavior } from "@cydran/cydran";
import { markdown } from "markdown";

class MarkdownBehavior extends AbstractBehavior<string, HTMLElement, unknown> {

	public onMount(): void {
		if (this.isMutable()) {
			this.getMediator().watch(this, "onChange");
		}

		this.onChange(null, this.getMediator().get());
	}

	protected onChange(previous: string, current: string): void {
		if (current) {
			this.getEl().innerHTML = markdown.toHTML(current);
		}
	}

}

export default MarkdownBehavior;
