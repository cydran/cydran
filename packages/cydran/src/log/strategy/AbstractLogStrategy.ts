import Level from "log/Level";
import { Appender } from "log/appender/Appender";
import { LevelStrategy } from "log/strategy/LevelStrategy";
import { IflevelStrategy } from "log/strategy/IfLevelStrategy";

export abstract class AbstractLevelStrategy implements LevelStrategy {
	
	abstract getLevel(): string;

	public ifTrace(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.trace(logName, payloadFn(), params);
	}

	public ifDebug(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.debug(logName, payloadFn(), params);
	}

	public ifInfo(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.info(logName, payloadFn(), params);
	}

	public ifWarn(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.warn(logName, payloadFn(), params);
	}

	public ifError(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.error(logName, payloadFn(), params);
	}

	public ifFatal(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		pender.fatal(logName, payloadFn(), params);
	}

	public trace(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.trace(logName, payload, params);
	}

	public debug(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.debug(logName, payload, params);
	}

	public info(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.info(logName, payload, params);
	}

	public warn(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.warn(logName, payload, params);
	}

	public error(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.error(logName, payload, params);
	}

	public fatal(logName: string, pender: Appender, payload: string, ...params: any): void {
		pender.fatal(logName, payload, params);
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

	private isLevel(lvl: Level) {
		return lvl >= this.getLevel();
	}
}