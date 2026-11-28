/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import AbstractRefreshStrategy from "behavior/core/each/AbstractRefreshStrategy";
import EachPlacement from "behavior/core/each/EachPlacement";
import EachState from "behavior/core/each/EachState";
import IdStrategy from "behavior/core/each/IdStrategy";
import Populator from "behavior/core/each/Populator";
import { Nestable } from "context/Context";
import { ListItem } from "CydranTypes";

class UnfocusedRefreshStrategy extends AbstractRefreshStrategy {

	constructor(
		placement: EachPlacement,
		populator: Populator,
		idStrategy: IdStrategy,
		state: EachState,
		createFn: (item: ListItem) => Nestable
	) {
		super(placement, populator, idStrategy, state, createFn);
	}

	public refresh(items: ListItem[]): void {
		this.enrich(items);
		const newIds: string[] = this.extract(items);
		this.updateReusedItems(items);

		if (this.idsSame(newIds)) {
			this.getState().setIds(newIds);
			return;
		}

		const components: Nestable[] = [];
		this.rebuildMap(items, components);
		this.getPlacement().clear();

		if (this.getState().getFirst()) {
			this.getPopulator().appendChild(this.getState().getFirst().$c().getEl());
		}

		for (const component of components) {
			this.getPopulator().appendChild(component.$c().getEl());
		}

		if (this.getState().getLast()) {
			this.getPopulator().appendChild(this.getState().getLast().$c().getEl());
		}

		this.getPopulator().populate();
		this.getState().setIds(newIds);
	}

}

export default UnfocusedRefreshStrategy;
