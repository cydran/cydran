/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import EachConfig from "behavior/core/each/EachConfig";
import { requireNotNull } from 'util/Utils';

class EachConfigImpl implements EachConfig {

	private expression: string;

	private prefix: string;

	private behaviorPrefix: string;

	constructor(expression: string, prefix: string, behaviorPrefix: string) {
		this.expression = requireNotNull(expression, "expression");
		this.prefix = requireNotNull(prefix, "prefix");
		this.behaviorPrefix = requireNotNull(behaviorPrefix, "behaviorPrefix");
	}

	public getExpression(): string {
		return this.expression;
	}

	public getPrefix(): string {
		return this.prefix;
	}

	public getBehaviorPrefix(): string {
		return this.behaviorPrefix;
	}

}

export default EachConfigImpl;
