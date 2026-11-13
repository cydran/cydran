/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Component } from "@cydran/cydran";
import TEMPLATE from "./RegionBehaviorSpecimen.html";
import RegionChild from "./RegionChild";

/**
 * Specimen: `RegionBehavior` (`<c-region>`). Exercises placement/replacement (single
 * occupancy), clearing, `setByObjectId` (DI placement), `value` surfacing into the child
 * (`v()`), and `lock` (a locked region rejects replacement).
 *
 * The "locked" region is seeded once in onMount (the first set into an empty locked region
 * is allowed); a later replacement attempt should throw LockedRegionError.
 */
class RegionBehaviorSpecimen extends Component {

	private payload: { label: string };

	private lockError: boolean;

	constructor() {
		super(TEMPLATE);
		this.payload = { label: "alpha" };
		this.lockError = false;
	}

	public onMount(): void {
		this.$c().regions().set("locked", new RegionChild("locked-original"));
	}

	public setA(): void {
		this.$c().regions().set("slot", new RegionChild("A"));
	}

	public setB(): void {
		this.$c().regions().set("slot", new RegionChild("B"));
	}

	public setViaDi(): void {
		this.$c().regions().setByObjectId("slot", "regionDiChild");
	}

	public clearSlot(): void {
		this.$c().regions().set("slot", null);
	}

	public changePayload(): void {
		this.payload = { label: "beta" };
	}

	public tryReplaceLocked(): void {
		try {
			this.$c().regions().set("locked", new RegionChild("locked-new"));
		} catch {
			this.lockError = true;
		}
	}

}

export default RegionBehaviorSpecimen;
