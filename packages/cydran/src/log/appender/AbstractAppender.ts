/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import { Appender } from "log/appender/Appender";

export const getNow = (): string => {
	const now = new Date();
	return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}`;
};

export abstract class AbstractAppender implements Appender {
	private id: string;

	constructor(id: string) {
		this.id = id;
	}

	public getId(): string {
		return this.id;
	}

	abstract getAlias(): string;

	abstract trace(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;

	abstract debug(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;

	abstract info(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;

	abstract warn(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;

	abstract error(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;
	
	abstract fatal(label: string, message: string, error?: Error, moreArgs?: unknown[]): void;
	
}