/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import EachPlacement from "behavior/core/each/EachPlacement";
import EachState from "behavior/core/each/EachState";
import RefreshStrategy from "behavior/core/each/RefreshStrategy";
import ComponentTransitions from "component/ComponentTransitions";
import { Nestable } from "context/Context";
import { requireNotNull } from "util/Utils";
import { ListItem } from "CydranTypes";

class EmptyRefreshStrategy implements RefreshStrategy {

	private placement: EachPlacement;

	private state: EachState;

	constructor(placement: EachPlacement, state: EachState) {
		this.placement = requireNotNull(placement, "placement");
		this.state = requireNotNull(state, "state");
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public refresh(current: ListItem[]): void {
		for (const key of Object.keys(this.state.getMap())) {
			const component: Nestable = this.state.getMap()[key];
			component.$c().tell(ComponentTransitions.UNMOUNT);
		}

		this.state.setIds([]);
		this.state.setMap({});

		this.placement.clear();

		if (this.state.getEmpty()) {
			this.placement.append(this.state.getEmpty().$c().getEl());
		}
	}

}

export default EmptyRefreshStrategy;
