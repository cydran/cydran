/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import BehaviorInternals from "behavior/BehaviorInternals";
import ComponentInternals from "component/ComponentInternals";
import DestinationContinuation from "continuation/DestinationContinuation";
import { To } from "CydranConstants";
import { requireNotNull } from "util/Utils";

class DestinationContinuationImpl implements DestinationContinuation {

	private internals: BehaviorInternals<unknown, HTMLElement | Text, unknown> | ComponentInternals;

	private channelName: string;

	private messageName: string;

	private payload: unknown;

	private startFrom: string;

	constructor(internals: BehaviorInternals<unknown, HTMLElement | Text, unknown> | ComponentInternals, channelName: string, messageName: string, payload: unknown, startFrom: string) {
		this.internals = requireNotNull(internals, "internals");
		this.channelName = requireNotNull(channelName, "channelName");
		this.messageName = requireNotNull(messageName, "messageName");
		this.payload = payload;
		this.startFrom = startFrom;
	}

	public withPropagation(propagation: To): void {
		this.internals.send(propagation, this.channelName, this.messageName, this.payload, this.startFrom);
	}

	public toSelf(): void {
		this.internals.message(this.channelName, this.messageName, this.payload);
	}

}

export default DestinationContinuationImpl;
