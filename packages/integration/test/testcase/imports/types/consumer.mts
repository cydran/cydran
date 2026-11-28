/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

// Type-checked by types.spec.ts as a consumer of @cydran/cydran, not run.

import { Component, create, Stage } from "@cydran/cydran";

class App extends Component {

	constructor() {
		super("<div></div>");
	}

}

const stage: Stage = create("body", {});

stage.setComponent(new App());

export { stage };
