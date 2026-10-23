/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

export interface IsLevelType {

	/**
	 * Is the log level at least at "trace" level
	 * @returns boolean
	 */
	isTrace(): boolean;

	/**
	 * Is the log level at least at "debug" level
	 * @returns boolean
	 */
	isDebug(): boolean;

	/**
	 * Is the log level at least at "info" level
	 * @returns boolean
	 */
	isInfo(): boolean;

	/**
	 * Is the log level at least at "warn" level
	 * @returns boolean
	 */
	isWarn(): boolean;

	/**
	 * Is the log level at least at "error" level
	 * @returns boolean
	 */
	isError(): boolean;

	/**
	 * Is the log level at least at "fatal" level
	 * @returns boolean
	 */
	isFatal(): boolean;
}