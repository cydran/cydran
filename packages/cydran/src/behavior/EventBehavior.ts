/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import AbstractBehavior from "behavior/AbstractBehavior";
import { DOM_KEY } from "CydranConstants";
import { requireNotNull } from 'util/Utils';

class EventBehavior extends AbstractBehavior<unknown, HTMLElement, unknown> {

	private eventKey: string;

	constructor(eventKey: string) {
		super();
		this.eventKey = requireNotNull(eventKey, "eventKey");
	}

	public onInit(): void {
		this.bridge(this.eventKey);
		this.on(this.eventKey).forChannel(DOM_KEY).invoke("handleEvent");
	}

	public handleEvent(event: Event): void {
		this.invoke({$event: event});
	}

}

export default EventBehavior;
