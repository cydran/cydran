/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component, To } from "@cydran/cydran";
import TEMPLATE from "./MessageClosureGcSpecimen.html";

/**
 * Specimen: a message subscription registered by METHOD NAME on a channel. The component sends to its
 * own context on a button press. Registration by name resolves to a prototype method — strongly
 * reachable via the class — so the subscription survives forced GC. (Inline closures are no longer
 * accepted by the API, which removes the prior closure-GC footgun by design.)
 */
class MessageClosureGcSpecimen extends Component {

	private n: number;

	private viaClosure: string;

	private viaMethod: string;

	constructor() {
		super(TEMPLATE);
		this.n = 0;
		this.viaClosure = "none";
		this.viaMethod = "none";
		// Method name — resolves to a prototype method that survives GC.
		this.$c().onMessage("ping").forChannel("gcTest").invoke("onPing");
	}

	public onPing(payload: unknown): void {
		this.viaMethod = "got=" + payload;
	}

	public sendPing(): void {
		this.n++;
		this.$c().send("ping", this.n).onChannel("gcTest").withPropagation(To.CONTEXT);
	}

}

export default MessageClosureGcSpecimen;
