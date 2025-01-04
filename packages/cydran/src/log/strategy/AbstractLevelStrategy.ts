import Level from "log/Level";
import { Appender } from "log/appender/Appender";
import { LevelStrategy } from "log/strategy/LevelStrategy";

const withStack = (...params: any): Error | null => {
	const wkps: any[] = [... params];
	const forStackOut: Error | null = (wkps.length > 0 &&  wkps[wkps.length] instanceof Error) ? wkps[wkps.length] : null;
	return forStackOut;
}

const wkre: RegExp = /%s/i;

export abstract class AbstractLevelStrategy implements LevelStrategy {
	
	abstract getLevel(): string;

	public ifTrace(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isTrace()) {
			const e2Send: Error | null = withStack(params);
			const msg2Log: string = this.compositeMsg(payloadFn(), params);
			pender.trace(logLabel, msg2Log, e2Send);
		}
	}

	public ifDebug(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isDebug()) {
			const e2Send: Error | null = withStack(params);
			const msg2Log: string = this.compositeMsg(payloadFn(), params);
			pender.debug(logLabel, msg2Log, e2Send);
		}
	}

	public ifInfo(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isInfo()) {
			const e2Send: Error | null = withStack(params);
			const msg2Log: string = this.compositeMsg(payloadFn(), params);
			pender.info(logLabel, msg2Log, e2Send);
		}
	}

	public ifWarn(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isWarn()) {
			const e2Send: Error | null = withStack(params);
			const msg2Log: string = this.compositeMsg(payloadFn(), params);
			pender.warn(logLabel, msg2Log, e2Send);
		}
	}

	public ifError(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isError()) {
			const e2Send: Error | null = withStack(params);
			const msg2Log: string = this.compositeMsg(payloadFn(), params);
			pender.error(logLabel, msg2Log, e2Send);
		}
	}

	public ifFatal(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isFatal()) {
			const e2Send: Error | null = withStack(params);
			const msg2Log: string = this.compositeMsg(payloadFn(), params);
			pender.fatal(logLabel, msg2Log, e2Send);
		}
	}

	public trace(logLabel: string, pender: Appender, msgBase: string, ...params: any): void {
		const e2Send: Error | null = withStack(params);
		const msg2Log: string = this.compositeMsg(msgBase, params);
		pender.trace(logLabel, msg2Log, e2Send);
	}

	public debug(logLabel: string, pender: Appender, msgBase: string, ...params: any): void {
		const e2Send: Error | null = withStack(params);
		const msg2Log: string = this.compositeMsg(msgBase, params);
		pender.debug(logLabel, msg2Log, e2Send);
	}

	public info(logLabel: string, pender: Appender, msgBase: string, ...params: any): void {
		const e2Send: Error | null = withStack(params);
		const msg2Log: string = this.compositeMsg(msgBase, params);
		pender.info(logLabel, msg2Log, e2Send);
	}

	public warn(logLabel: string, pender: Appender, msgBase: string, ...params: any): void {
		const e2Send: Error | null = withStack(params);
		const msg2Log: string = this.compositeMsg(msgBase, params);
		pender.warn(logLabel, msg2Log, e2Send);
	}

	public error(logLabel: string, pender: Appender, msgBase: string, ...params: any): void {
		const e2Send: Error | null = withStack(params);
		const msg2Log: string = this.compositeMsg(msgBase, params);
		pender.error(logLabel, msg2Log, e2Send);
	}

	public fatal(logLabel: string, pender: Appender, msgBase: string, ...params: any): void {
		const e2Send: Error | null = withStack(params);
		const msg2Log: string = this.compositeMsg(msgBase, params);
		pender.fatal(logLabel, msg2Log, e2Send);
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

	private compositeMsg(msgBase: string, ...wkArgs: any): string {
		let result: string = msgBase;
		for (let n of wkArgs) {
			if(wkre.test(result)) {
				result = result.replace(wkre, n);
			}
		}
		return result;
	}
}