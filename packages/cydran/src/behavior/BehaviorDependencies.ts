/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ComponentInternals from "component/ComponentInternals";

interface BehaviorDependencies {
	/**
	 * Guts of a {@link Component}
	 */
	parent: ComponentInternals;

	/**
	 * The bound HTML element
	 */
	el: HTMLElement | Text;

	/**
	 * The bound expression of "truthiness"
	 */
	expression: string;

	/**
	 * The bound Cydran model of the {@link Component}
	 */
	model: unknown;

	/**
	 * Prefix of any Cydran attribute.
	 */
	prefix: string;

	/**
	 * Attribute prefix of the behavior.
	 */
	behaviorPrefix: string;

	// /**
	//  * Context instance.
	//  */
	// context: Context;
	// TODO - Remove once migrated

	/**
	 * Whether validation is active.
	 */
	validated: boolean;

	/**
	 * Whether the expression is mutable.
	 */
	mutable: boolean;

}

export default BehaviorDependencies;
