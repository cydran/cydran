/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ElementVisitor from "component/visitor/ElementVisitor";
import RegionBehavior from "behavior/core/RegionBehavior";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import RegionElement from 'element/RegionElement';
import ComponentInternals from "component/ComponentInternals";

class RegionVisitor implements ElementVisitor<RegionElement, unknown> {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public visit(element: RegionElement, internals: ComponentInternals, consumer: (element: HTMLElement | Text | Comment) => void, topLevel: boolean): void {
		const region: RegionBehavior = new RegionBehavior(internals);

		const dependencies: BehaviorDependencies = {
			parent: internals,
			el: element,
			expression: "",
			model: internals.getModel(),
			prefix: internals.getExtractor().getPrefix(),
			behaviorPrefix: internals.getExtractor().asTypePrefix("region"),
			validated: internals.isValidated(),
			mutable: true
		};

		internals.addBehavior(region);
		region.tell(BehaviorTransitions.INIT, dependencies);
	}
}

export default RegionVisitor;
