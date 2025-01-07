import Level from "log/Level";
import { Appender } from "log/appender/Appender";
import { LevelStrategy } from "log/strategy/LevelStrategy";
import { composite } from "util/Utils";

const withStack = (...moreArgs: any): Error | undefined => {
	const wkps: any[] = [... moreArgs];
	const forStackOut: Error | null = (wkps.length > 0 &&  wkps[wkps.length] instanceof Error) ? wkps[wkps.length] : null;
	return forStackOut;
}

const resolveBaseMsg = (payloadFn: () => string, logLabel: string, pender: Appender): string => {
	try {
		return payloadFn();
	} catch (ex: any) {
		pender.error(logLabel, "issue resolving log msg:", ex);
		return "";
	}
}

export abstract class AbstractLevelStrategy implements LevelStrategy {
	
	abstract getLevel(): string;

	public ifTrace(logLabel: string, pender: Appender, payloadFn: () => any, ...moreArgs: any): void {
		if (this.isTrace()) {
			const baseMsg: string = resolveBaseMsg(payloadFn, logLabel, pender);
			const e2Send: Error | null = withStack(moreArgs);
			const msg2Log: string = composite(baseMsg, moreArgs);
			pender.trace(logLabel, msg2Log, e2Send, moreArgs);
		}
	}

	public ifDebug(logLabel: string, pender: Appender, payloadFn: () => any, ...moreArgs: any): void {
		if (this.isDebug()) {
			const baseMsg: string = resolveBaseMsg(payloadFn, logLabel, pender);
			const e2Send: Error | null = withStack(moreArgs);
			const msg2Log: string = composite(baseMsg, moreArgs);
			pender.debug(logLabel, msg2Log, e2Send, moreArgs);
		}
	}

	public ifInfo(logLabel: string, pender: Appender, payloadFn: () => any, ...moreArgs: any): void {
		if (this.isInfo()) {
			const baseMsg: string = resolveBaseMsg(payloadFn, logLabel, pender);
			const e2Send: Error | null = withStack(moreArgs);
			const msg2Log: string = composite(baseMsg, moreArgs);
			pender.info(logLabel, msg2Log, e2Send, moreArgs);
		}
	}

	public ifWarn(logLabel: string, pender: Appender, payloadFn: () => any, ...moreArgs: any): void {
		if (this.isWarn()) {
			const baseMsg: string = resolveBaseMsg(payloadFn, logLabel, pender);
			const e2Send: Error | null = withStack(moreArgs);
			const msg2Log: string = composite(baseMsg, moreArgs);
			pender.warn(logLabel, msg2Log, e2Send, moreArgs);
		}
	}

	public ifError(logLabel: string, pender: Appender, payloadFn: () => any, ...moreArgs: any): void {
		if (this.isError()) {
			const baseMsg: string = resolveBaseMsg(payloadFn, logLabel, pender);
			const e2Send: Error | null = withStack(moreArgs);
			const msg2Log: string = composite(baseMsg, moreArgs);
			pender.error(logLabel, msg2Log, e2Send, moreArgs);
		}
	}

	public ifFatal(logLabel: string, pender: Appender, payloadFn: () => any, ...moreArgs: any): void {
		if (this.isFatal()) {
			const baseMsg: string = resolveBaseMsg(payloadFn, logLabel, pender);
			const e2Send: Error | null = withStack(moreArgs);
			const msg2Log: string = composite(baseMsg, moreArgs);
			pender.fatal(logLabel, msg2Log, e2Send, moreArgs);
		}
	}

	public trace(logLabel: string, pender: Appender, msgBase: string, ...moreArgs: any): void {
		const e2Send: Error | null = withStack(moreArgs);
		const msg2Log: string = composite(msgBase, moreArgs);
		pender.trace(logLabel, msg2Log, e2Send, moreArgs);
	}

	public debug(logLabel: string, pender: Appender, msgBase: string, ...moreArgs: any): void {
		const e2Send: Error | null = withStack(moreArgs);
		const msg2Log: string = composite(msgBase, moreArgs);
		pender.debug(logLabel, msg2Log, e2Send, moreArgs);
	}

	public info(logLabel: string, pender: Appender, msgBase: string, ...moreArgs: any): void {
		const e2Send: Error | null = withStack(moreArgs);
		const msg2Log: string = composite(msgBase, moreArgs);
		pender.info(logLabel, msg2Log, e2Send, moreArgs);
	}

	public warn(logLabel: string, pender: Appender, msgBase: string, ...moreArgs: any): void {
		const e2Send: Error | null = withStack(moreArgs);
		const msg2Log: string = composite(msgBase, moreArgs);
		pender.warn(logLabel, msg2Log, e2Send, moreArgs);
	}

	public error(logLabel: string, pender: Appender, msgBase: string, ...moreArgs: any): void {
		const e2Send: Error | null = withStack(moreArgs);
		const msg2Log: string = composite(msgBase, moreArgs);
		pender.error(logLabel, msg2Log, e2Send, moreArgs);
	}

	public fatal(logLabel: string, pender: Appender, msgBase: string, ...moreArgs: any): void {
		const e2Send: Error | null = withStack(moreArgs);
		const msg2Log: string = composite(msgBase, moreArgs);
		pender.fatal(logLabel, msg2Log, e2Send, moreArgs);
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
}