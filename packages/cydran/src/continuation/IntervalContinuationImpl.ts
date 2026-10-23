/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import IntervalContinuation from "continuation/IntervalContinuation";
import { requireNotNull } from 'util/Utils';
import ComponentInternals from 'component/ComponentInternals';

class IntervalContinuationImpl implements IntervalContinuation {

	private internals: ComponentInternals;

	private delay: number;

	constructor(internals: ComponentInternals, delay: number) {
		this.internals = requireNotNull(internals, "internals");
		this.delay = requireNotNull(delay, "delay");
	}

	public invoke(name: string): void {
		this.internals.addInterval(name, this.delay);
	}

}

export default IntervalContinuationImpl;
