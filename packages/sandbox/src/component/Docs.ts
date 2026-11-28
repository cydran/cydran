/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import AbstractMarkdownComponent from "./AbstractMarkdownComponent";
import CONTENT from "./Docs.md";

class Docs extends AbstractMarkdownComponent {

	constructor() {
		super("Documentation", CONTENT);
	}

}

export default Docs;
