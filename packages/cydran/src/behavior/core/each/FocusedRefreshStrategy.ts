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
import DomUtils from "dom/DomUtils";
import { isDefined } from "util/Utils";
import { ListItem } from "CydranTypes";

class FocusedRefreshStrategy extends AbstractRefreshStrategy {

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

		const elements: HTMLElement[] = [];

		if (this.getState().getFirst()) {
			elements.push(this.getState().getFirst().$c().getEl());
		}

		for (const component of components) {
			elements.push(component.$c().getEl());
		}

		if (this.getState().getLast()) {
			elements.push(this.getState().getLast().$c().getEl());
		}

		const beforeElements: HTMLElement[] = [];
		const afterElements: HTMLElement[] = [];
		let focusedElement: HTMLElement = null;

		while (elements.length > 0) {
			const element: HTMLElement = elements.shift();

			if (DomUtils.elementIsFocused(element)) {
				focusedElement = element;
				continue;
			}

			(isDefined(focusedElement) ? afterElements : beforeElements).push(element);
		}

		while (beforeElements.length > 0) {
			const element: HTMLElement = beforeElements.shift();
			this.getPlacement().insertBefore(element, focusedElement);
		}

		while (afterElements.length > 0) {
			const element: HTMLElement = afterElements.pop();
			this.getPlacement().insertBefore(element, focusedElement.nextSibling);
		}

		this.getState().setIds(newIds);
	}

}

export default FocusedRefreshStrategy;
