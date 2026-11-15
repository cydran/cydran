/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Factory from "registry/factory/Factory";
import { Context, Registry } from "context/Context";
import { requireNotNull, requireValid } from "util/Utils";
import { OBJECT_ID } from "CydranConstants";

/**
 * A factory that stands in for a registration in another registry. It looks the source id up in the source
 * registry's own registrations every time it is resolved, so it follows a re-registration of that id.
 */
class AliasFactoryImpl<T> implements Factory<T> {

	private source: Registry;

	private sourceId: string;

	constructor(source: Registry, sourceId: string) {
		requireNotNull(source, "source");
		requireValid(sourceId, "sourceId", OBJECT_ID);
		this.source = source;
		this.sourceId = sourceId;
	}

	public get(localContext: Context, originContext: Context, instanceArguments: unknown[]): T {
		return this.source.getLocalObject(this.sourceId, instanceArguments, localContext);
	}

	public getSource(): Registry {
		return this.source;
	}

	public getSourceId(): string {
		return this.sourceId;
	}

	public $release(): void {
		// Intentionally do nothing, the source registration belongs to the source registry
	}

}

export default AliasFactoryImpl;
