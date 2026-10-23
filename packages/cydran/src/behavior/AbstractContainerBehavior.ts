/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import AbstractBehavior from 'behavior/AbstractBehavior';
import InternalBehaviorFlags from "behavior/InternalBehaviorFlags";
import DigestableSource from "behavior/DigestableSource";

abstract class AbstractContainerBehavior<M, E extends HTMLElement | Text, P> extends AbstractBehavior<M, E, P> {

	constructor() {
		super();
		this.setFlag(InternalBehaviorFlags.PROPAGATION);
	}

	public abstract requestDigestionSources(sources: DigestableSource[]): void;

}

export default AbstractContainerBehavior;
