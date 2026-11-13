/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import SimpleMap from "interface/SimpleMap";
import StringSet from "pattern/StringSet";

class StringSetImpl implements StringSet {

	private values: SimpleMap<boolean>;

	constructor() {
		this.values = {};
	}

	public add(value: string): void {
		const key: string = '' + value.trim();
		this.values[key] = true;
	}

	public remove(value: string): void {
		const key: string = '' + value.trim();

		if (this.values[key]) {
			delete this.values[key];
		}
	}

	public contains(value: string): boolean {
		const key: string = '' + value.trim();
		return !!this.values[key];
	}

	public clear(): void {
		this.values = {};
	}

	public size(): number {
		const count: number = Object.keys(this.values).length;
		return count;
	}

	public isEmpty(): boolean {
		return this.size() === 0;
	}

	public isPopulated(): boolean {
		return !this.isEmpty();
	}

}

export default StringSetImpl;
