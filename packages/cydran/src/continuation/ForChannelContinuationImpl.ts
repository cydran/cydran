/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ComponentInternals from "component/ComponentInternals";
import ForChannelContinuation from "continuation/ForChannelContinuation";
import { requireNotNull } from "util/Utils";

class ForChannelContinuationImpl implements ForChannelContinuation {

	private internals: ComponentInternals;

	private messageName: string;

	private channelName: string;

	constructor(internals: ComponentInternals, messageName: string, channelName: string) {
		this.internals = requireNotNull(internals, "internals");
		this.messageName = requireNotNull(messageName, "messageName");
		this.channelName = requireNotNull(channelName, "channelName");
	}

	invoke(name: string): void {
		this.internals.on(name, this.messageName, this.channelName);
	}

}

export default ForChannelContinuationImpl;
