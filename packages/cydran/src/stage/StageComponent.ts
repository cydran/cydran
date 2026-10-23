/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Component from "component/Component";
import ComponentOptions from "component/ComponentOptions";
import Renderer from "component/Renderer";

class StageComponent extends Component {

	constructor(renderer: Renderer) {
		super(renderer, {
			name: `StageComponent`,
			alwaysConnected: true
		} as ComponentOptions);
	}

}

export default StageComponent;
