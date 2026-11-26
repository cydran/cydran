/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ElementVisitor from "component/visitor/ElementVisitor";
import ComponentInternals from "component/ComponentInternals";
import BehaviorDependencies from "behavior/BehaviorDependencies";
import BehaviorTransitions from "behavior/BehaviorTransitions";
import EachElementBehavior from "behavior/core/EachElementBehavior";
import EachElement from "element/EachElement";
import { isMutableBehaviorExpression, trimBehaviorExpression } from "component/visitor/BehaviorExpressions";
import { TemplateError } from "error/Errors";
import { elementAsString, hasContents, isDefined } from "util/Utils";

const ITEMS_ATTRIBUTE: string = "items";

/**
 * Visits a <c-each> element. It sets up the same each behavior the c-each attribute uses, reading the list
 * expression from the items attribute, and leaves the element's children to the behavior.
 */
class EachVisitor implements ElementVisitor<EachElement, unknown> {

	/* eslint-disable @typescript-eslint/no-unused-vars */
	public visit(
		element: EachElement,
		internals: ComponentInternals,
		consumer: (element: HTMLElement | Text | Comment) => void,
		topLevel: boolean
	): void {
		const items: string = element.getAttribute(ITEMS_ATTRIBUTE);

		if (topLevel) {
			throw new TemplateError(
				`<c-each> is not supported as the top-level element of a component template: ${elementAsString(element)}`
			);
		}

		if (!isDefined(items) || !hasContents(items.trim())) {
			throw new TemplateError(
				`<c-each> requires an ${ITEMS_ATTRIBUTE} attribute with the list expression: ${elementAsString(element)}`
			);
		}

		const each: EachElementBehavior = new EachElementBehavior();

		const dependencies: BehaviorDependencies = {
			parent: internals,
			el: element,
			expression: trimBehaviorExpression(items),
			model: internals.getModel(),
			prefix: internals.getExtractor().getPrefix(),
			behaviorPrefix: internals.getExtractor().asTypePrefix("each"),
			validated: internals.isValidated(),
			mutable: isMutableBehaviorExpression(items)
		};

		each.tell(BehaviorTransitions.INIT, dependencies);
		internals.addBehavior(each);
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

}

export default EachVisitor;
