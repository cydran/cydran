/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ComponentFactory from "component/ComponentFactory";
import ComponentOptions from "component/ComponentOptions";
import Component from "component/Component";
import { Context, Nestable } from "context/Context";

class UtilityComponentFactoryImpl implements ComponentFactory {

	private template: string;

	private prefix: string;

	private parent: Nestable;

	private parentId: string;

	private parentModelFn: () => unknown;

	private context: Context;

	private valueFn: () => unknown;

	constructor(context: Context, template: string, prefix: string, parent: Nestable, parentId: string, parentModelFn: () => unknown, valueFn: () => unknown) {
		this.context = context;
		this.template = template;
		this.prefix = prefix;
		this.parent = parent;
		this.parentId = parentId;
		this.parentModelFn = parentModelFn;
		this.valueFn = valueFn;
	}

	public create(): Nestable {
		const component: Component = new Component(this.template, {
			prefix: this.prefix,
			parentModelFn: this.parentModelFn,
			context: this.context,
			repeatable: true
		} as ComponentOptions);

		component.$c().tell("setItemFn", this.valueFn);
		component.$c().tell("setParentContext", this.context);
		component.$c().tell("setParent", this.parent);

		return component;
	}
}

export default UtilityComponentFactoryImpl;
