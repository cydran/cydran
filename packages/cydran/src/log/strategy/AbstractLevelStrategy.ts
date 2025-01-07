import { JSType } from "CydranConstants";
import Level from "log/Level";
import { Appender } from "log/appender/Appender";
import { LevelStrategy } from "log/strategy/LevelStrategy";
import { compositeArray, isDefined } from "util/Utils";

const withStack = (...moreArgs: any): Error | undefined => {
	const wkps: any[] = moreArgs.length > 0 ? [... moreArgs] : [];
	const forStackOut: Error | null = (wkps.length > 0 &&  wkps[wkps.length] instanceof Error) ? wkps[wkps.length] : null;
	return forStackOut;
}

const resolvemsgBase = (payloadFn: () => string, logLabel: string, pender: Appender): string => {
	try {
		return payloadFn();
	} catch (ex: any) {
		pender.error(logLabel, "issue resolving log msg:", ex);
		return "";
	}
}

type LogParts = {e2send: Error | null, msg2Log: string, wkArgs: any[]};

export abstract class AbstractLevelStrategy implements LevelStrategy {
	
	abstract getLevel(): string;

	public ifTrace(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		if (this.isTrace()) {
			const msgBase: string = resolvemsgBase(payloadFn, logLabel, pender);
			const lpts: LogParts = this.buildParts(msgBase, moreArgs);
			pender.trace(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
		}
	}

	public ifDebug(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		if (this.isDebug()) {
			const msgBase: string = resolvemsgBase(payloadFn, logLabel, pender);
			const lpts: LogParts = this.buildParts(msgBase, moreArgs);
			pender.debug(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
		}
	}

	public ifInfo(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		if (this.isInfo()) {
			const msgBase: string = resolvemsgBase(payloadFn, logLabel, pender);
			const lpts: LogParts = this.buildParts(msgBase, moreArgs);
			pender.info(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
		}
	}

	public ifWarn(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		if (this.isWarn()) {
			const msgBase: string = resolvemsgBase(payloadFn, logLabel, pender);
			const lpts: LogParts = this.buildParts(msgBase, moreArgs);
			pender.warn(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
		}
	}

	public ifError(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		if (this.isError()) {
			const msgBase: string = resolvemsgBase(payloadFn, logLabel, pender);
			const lpts: LogParts = this.buildParts(msgBase, moreArgs);
			pender.error(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
		}
	}

	public ifFatal(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		if (this.isFatal()) {
			const msgBase: string = resolvemsgBase(payloadFn, logLabel, pender);
			const lpts: LogParts = this.buildParts(msgBase, moreArgs);
			pender.fatal(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
		}
	}

	public trace(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		pender.trace(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public debug(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		pender.debug(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public info(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		pender.info(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public warn(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		pender.warn(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public error(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		pender.error(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public fatal(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		pender.fatal(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public isTrace(): boolean {
		return this.isLevel(Level.TRACE);
	}

	public isDebug(): boolean {
		return this.isLevel(Level.DEBUG);
	}

	public isInfo(): boolean {
		return this.isLevel(Level.INFO);
	}

	public isWarn(): boolean {
		return this.isLevel(Level.WARN);
	}

	public isError(): boolean {
		return this.isLevel(Level.ERROR);
	}

	public isFatal(): boolean {
		return this.isLevel(Level.FATAL);
	}

	private isLevel(lvl: Level): boolean {
		return lvl >= this.getLevel();
	}

	private buildParts(msg: string, wkargs: any[]): LogParts {
		const vals: string[] = [];
		for(const v of wkargs) {
			const wkv: string = (typeof v == JSType.OBJ) ? JSON.stringify(v) : v.toString();
			vals.push(wkv);
		}
		const result = {
			e2send: withStack(wkargs),
			msg2Log: compositeArray(msg, vals),
			wkArgs: wkargs.length > 0 ? [... wkargs] : []
		}
		if (isDefined(result.e2send)) {
			result.wkArgs = result.wkArgs.slice(0, result.wkArgs.length - 1);
		}
		return result;
	}
}