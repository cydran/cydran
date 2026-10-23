/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Watchable from "interface/ables/Watchable";
import Watcher from "digest/Watcher";
import Logger from "log/Logger";
import { requireNotNull } from "util/Utils";
import { asIdentity } from "util/AsFunctions";
import GarbageCollectablePairedSet from 'pattern/GarbageCollectablePairedSet';
import GarbageCollectablePairedSetImpl from "pattern/GarbageCollectablePairedSetImpl";
import { CallBackThisObject } from 'CydranTypes';

type Callback = () => void;

class WatcherImpl<T> implements Watcher<T> {

	private value: unknown;

	private callbacks: GarbageCollectablePairedSet<CallBackThisObject, Callback, CallBackThisObject>;

	private logger: Logger;

	constructor(watchable: Watchable, expression: string, logr: Logger) {
		requireNotNull(watchable, "watchable");
		requireNotNull(expression, "expression");
		this.logger = logr;
		this.callbacks = new GarbageCollectablePairedSetImpl<CallBackThisObject, Callback, CallBackThisObject>();
		this.value = watchable.evaluate(expression);
		watchable.onExpressionValueChange(expression, this, "onChange", asIdentity);
	}

	public onChange(previous: unknown, current: unknown): void {
		this.logger.ifTrace(() => ({
			message: "Changed",
			previous: previous,
			current: current
		}));

		this.value = current;

		this.callbacks.forEach((thisObject: CallBackThisObject, callback: Callback) => {
			callback.apply(thisObject, []);
		});
	}

	public addCallback(thisObject: CallBackThisObject, callback: () => void): Watcher<T> {
		requireNotNull(thisObject, "thisObject");
		requireNotNull(callback, "callback");
		this.callbacks.add(thisObject, callback);

		return this;
	}

	public get(): T {
		return this.value as T;
	}
}

export default WatcherImpl;
