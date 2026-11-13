/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

interface Scope {

	// TODO - Review the name of the add method for alternatives such as set() or put() as it can be called more than once and is not appending the values
	add(name: string, item: unknown): Scope;

	remove(name: string): Scope;

	extend(): Scope;

}

export default Scope;
