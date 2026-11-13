/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Type from 'interface/Type';
import CreatorStrategy from 'registry/creator/CreatorStrategy';
import Instantiator from 'registry/Instantiator';
import { requireNotNull } from 'util/Utils';

class ClassCreatorStrategyImpl<T> implements CreatorStrategy<T> {

	private classInstance: Type<T>;

	constructor(classInstance: Type<T>) {
		this.classInstance = requireNotNull(classInstance, "classInstance");
	}

	public create(): (argumentValues: unknown[]) => T {
		return Instantiator.create(this.classInstance);
	}

	public $release(): void {
		this.classInstance = null;
	}

}

export default ClassCreatorStrategyImpl;
