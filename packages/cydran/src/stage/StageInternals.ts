/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Context, Nestable, SeriesOperations, Stage } from "context/Context";
import Releasable from "interface/ables/Releasable";
import { CallBackThisObject } from 'CydranTypes';

interface StageInternals extends Releasable {

	addComponentBefore(component: Nestable): void;

	addComponentAfter(component: Nestable): void;

	getContext(): Context;

	start(): void;

	setComponent(component: Nestable): void;

	setComponentByObjectId(componentName: string, defaultComponentName?: string): void;

	addInitializer(thisObject: CallBackThisObject, callback: (stage: Stage) => void): void;

	isStarted(): boolean;

	before(): SeriesOperations;

	after(): SeriesOperations;

}

export default StageInternals;
