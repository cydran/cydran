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

const resolvemsgBase = (primaryMsgFn: () => string, logLabel: string, appender: Appender): string => {
	try {
		return primaryMsgFn();
	} catch (ex: any) {
	 appender.error(logLabel, "issue resolving log msg:", ex);
		return "";
	}
}

type LogParts = {e2send: Error | null, msg2Log: string, wkArgs: any[]};

export abstract class AbstractLevelStrategy implements LevelStrategy {
	
	abstract getLevel(): string;

	public ifTrace(logLabel: string, appender: Appender, primaryMsgFn: () => any, moreArgs: any[]): void {
		const msgBase: string = resolvemsgBase(primaryMsgFn, logLabel, appender);
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.trace(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public ifDebug(logLabel: string, appender: Appender, primaryMsgFn: () => any, moreArgs: any[]): void {
		const msgBase: string = resolvemsgBase(primaryMsgFn, logLabel, appender);
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.debug(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public ifInfo(logLabel: string, appender: Appender, primaryMsgFn: () => any, moreArgs: any[]): void {
		const msgBase: string = resolvemsgBase(primaryMsgFn, logLabel, appender);
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.info(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public ifWarn(logLabel: string, appender: Appender, primaryMsgFn: () => any, moreArgs: any[]): void {
		const msgBase: string = resolvemsgBase(primaryMsgFn, logLabel, appender);
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.warn(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public ifError(logLabel: string, appender: Appender, primaryMsgFn: () => any, moreArgs: any[]): void {
		const msgBase: string = resolvemsgBase(primaryMsgFn, logLabel, appender);
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.error(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public ifFatal(logLabel: string, appender: Appender, primaryMsgFn: () => any, moreArgs: any[]): void {
		const msgBase: string = resolvemsgBase(primaryMsgFn, logLabel, appender);
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.fatal(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public trace(logLabel: string, appender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.trace(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public debug(logLabel: string, appender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.debug(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public info(logLabel: string, appender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.info(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public warn(logLabel: string, appender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.warn(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public error(logLabel: string, appender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.error(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}

	public fatal(logLabel: string, appender: Appender, msgBase: string, moreArgs: any[]): void {
		const lpts: LogParts = this.buildParts(msgBase, moreArgs);
		appender.fatal(logLabel, lpts.msg2Log, lpts.e2send, lpts.wkArgs);
	}
	
	abstract isTrace(): boolean;

	abstract isDebug(): boolean;

	abstract isInfo(): boolean;

	abstract isWarn(): boolean;

	abstract isError(): boolean;

	abstract isFatal(): boolean;

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