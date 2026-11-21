/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import EachBehaviorSpecimen from "./EachBehaviorSpecimen";
import TEMPLATE from "./EachElementSpecimen.html";

/**
 * Specimen: the `<c-each>` element. The same list and buttons as the Each Behavior specimen, written with the element
 * form inside a `<ul>` that also holds static items before and after the list.
 */
class EachElementSpecimen extends EachBehaviorSpecimen {

	constructor() {
		super(TEMPLATE);
	}

}

export default EachElementSpecimen;
