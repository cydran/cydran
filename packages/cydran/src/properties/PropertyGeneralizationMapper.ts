/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { requireNotNull } from "util/Utils";

class PropertyGeneralizationMapper {

	private preferredKey: string;

	private prefix: string;

	private mapper: (key: string) => unknown;

	constructor(preferredKey: string, prefix: string, mapper: (key: string) => unknown) {
		this.preferredKey = requireNotNull(preferredKey, "preferredKey");
		this.prefix = prefix;
		this.mapper = requireNotNull(mapper, "mapper");
	}

	public getMapper(): (key: string, value: unknown) => unknown {
		return (key, value) => this.determineValue(key, value);
	}

	private determineValue(key: string, value: unknown): unknown {
		return (value === undefined) ? this.mapper(key) : value;
	}

}

export default PropertyGeneralizationMapper;