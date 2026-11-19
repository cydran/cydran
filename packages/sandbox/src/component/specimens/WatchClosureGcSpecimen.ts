/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./WatchClosureGcSpecimen.html";

/**
 * Specimen: a reactive watch registered by METHOD NAME via
 * `$c().onExpressionValueChange("m().count").invoke("onCountChange")`. Registration by name resolves to
 * a prototype method — strongly reachable via the class — so the watch survives forced GC. (Inline
 * closures are no longer accepted by the API, which removes the prior closure-GC footgun by design.)
 */
class WatchClosureGcSpecimen extends Component {

	private count: number;

	private mirror: string;

	private mirrorMethod: string;

	constructor() {
		super(TEMPLATE);
		this.count = 0;
		this.mirror = "unseen";
		this.mirrorMethod = "unseen";
		// Registered in the constructor (component onInit is not a called hook).
		// Method name — resolves to a prototype method that survives GC.
		this.$c().onExpressionValueChange("m().count").invoke("onCountChange");
	}

	public onCountChange(previous: number, current: number): void {
		this.mirrorMethod = "seen=" + current;
	}

	public increment(): void {
		this.count++;
	}

}

export default WatchClosureGcSpecimen;
