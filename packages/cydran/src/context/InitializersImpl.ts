/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Initializers from "context/Initializers";
import { CallBackThisObject } from "CydranTypes";
import { defaulted, requireNotNull } from 'util/Utils';

type Callback<C> = (context? : C) => void;

type Registration<C> = { thisObject: CallBackThisObject; callback: Callback<C> };

class InitializersImpl<C> implements Initializers<C> {

	private callbacks: Registration<C>[];

	constructor() {
		this.callbacks = [];
	}

	public add(thisObject: CallBackThisObject, callback: (context? : C) => void): void {
		requireNotNull(callback, "callback");
		this.callbacks.push({ thisObject: defaulted(thisObject, {}), callback: callback });
	}

	public execute(context: C): void {
		for (const registration of this.callbacks) {
			registration.callback.call(registration.thisObject, context);
		}

		this.callbacks = [];
	}

}

export default InitializersImpl;
