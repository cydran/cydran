/*
 * Copyright (c) 2018-2026 The Cydran Team <https://cydran.io/>
 * SPDX-License-Identifier: MIT
 *
 * This file is part of Cydran and is licensed under the MIT License.
 * See the LICENSE file in the package root for details.
 */

import Phase from "filter/Phase";
import Logger from "log/Logger";
import noOp from "function/noOp";
import { requireNotNull, equals, isDefined, clone } from "util/Utils";
import { DEFAULT_EQUALS_DEPTH, DEFAULT_CLONE_DEPTH } from "CydranConstants";
import getLogger from "log/getLogger";
import { ListItem } from "CydranTypes";

const regex: RegExp = /(^[^ - ]+) - (.+)$/;

type LogPayload = { message: string; items: ListItem[] };

abstract class AbstractPhaseImpl implements Phase {

	private previous: Phase;

	private memo: ListItem[];

	private callback: () => void;

	private logger: Logger;

	constructor(name: string, previous: Phase) {
		let wkLogName = name;
		let expStr = "";

		if (regex.test(name)) {
			const segs: string[] = regex.exec(name);
			wkLogName = segs[1];
			expStr = segs[2];
		}

		this.logger = getLogger(wkLogName);
		this.logger.ifDebug(() => `New phase: "${expStr.trim() === "" ? wkLogName : expStr}"`);
		this.previous = requireNotNull(previous, "previous");
		this.memo = null;
		this.callback = noOp;
	}

	public process(items: ListItem[]): ListItem[] {
		const processed: ListItem[] = this.previous.process(items);

		if (!isDefined(processed) || equals(DEFAULT_EQUALS_DEPTH, processed, this.memo)) {
			this.logger.ifTrace(() => "Not changed, returning null");
			return null;
		}

		this.memo = clone(DEFAULT_CLONE_DEPTH, processed);

		return this.execute(processed);
	}

	public onChange(): void {
		this.logger.trace("Changed - Invoking callbacks");
		this.memo = null;
		this.callback();
	}

	public invalidate(): void {
		this.onChange();
		this.logger.trace("Changed - Invalidating previous");
		this.previous.invalidate();
	}

	public setCallback(callback: () => void): void {
		this.callback = callback;
		this.previous.setCallback(callback);
	}

	protected getLogger(): Logger {
		return this.logger;
	}

	protected loggerPayload(message: string, items: ListItem[]): LogPayload {
		return { message: message, items: items };
	}

	protected abstract execute(items: ListItem[]): ListItem[];

}

export default AbstractPhaseImpl;
