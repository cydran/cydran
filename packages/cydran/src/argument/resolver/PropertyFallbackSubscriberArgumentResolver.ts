/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import ArgumentResolver from 'argument/ArgumentResolver';
import { Context } from "context/Context";
import { CallBackThisObject, PropertyFallBackSubscriber } from 'CydranTypes';
import { requireNotNull } from 'util/Utils';

class PropertyFallbackSubscriberArgumentResolver implements ArgumentResolver<PropertyFallBackSubscriber> {

	private preferredKey: string;
	
	private prefix?: string;

	constructor(preferredKey: string, prefix?: string) {
		this.preferredKey = requireNotNull(preferredKey, "preferredKey");
		this.prefix = prefix;
	}

	public resolve(context: Context): PropertyFallBackSubscriber {
		const subscriber: PropertyFallBackSubscriber = (thisObject: CallBackThisObject, name: string) => {
				context.getProperties().addFallbackObserver(thisObject, name, this.preferredKey, this.prefix);
			};

		return subscriber;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: object, param: unknown): void {
		// Intentionally do nothing
	}

}

export default PropertyFallbackSubscriberArgumentResolver;
