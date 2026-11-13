/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

abstract class CydranError extends Error {

	public readonly message: string;

	/**
	 * Constructor
	 *
	 * @param msg string Message describing the nature of the error
	 */
	constructor(msg: string) {
		super();

		this.name = new.target.name;
		this.message = msg;
	}

}

export default CydranError;