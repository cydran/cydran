import Level from "log/Level";
import { Appender } from "log/appender/Appender";
import { LevelStrategy } from "log/strategy/LevelStrategy";

export abstract class AbstractLevelStrategy implements LevelStrategy {
	
	abstract getLevel(): string;

	public ifTrace(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isTrace()) {
			pender.trace(logLabel, payloadFn(), params);
		}
	}

	public ifDebug(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isDebug()) {
			pender.debug(logLabel, payloadFn(), params);
		}
	}

	public ifInfo(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isInfo()) {
			pender.info(logLabel, payloadFn(), params);
		}
	}

	public ifWarn(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isWarn()) {
			pender.warn(logLabel, payloadFn(), params);
		}
	}

	public ifError(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isError()) {
			pender.error(logLabel, payloadFn(), params);
		}
	}

	public ifFatal(logLabel: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		if (this.isFatal()) {
			pender.fatal(logLabel, payloadFn(), params);
		}
	}

	public trace(logLabel: string, pender: Appender, payload: any, ...params: any): void {
		pender.trace(logLabel, payload, params);
	}

	public debug(logLabel: string, pender: Appender, payload: any, ...params: any): void {
		pender.debug(logLabel, payload, params);
	}

	public info(logLabel: string, pender: Appender, payload: any, ...params: any): void {
		pender.info(logLabel, payload, params);
	}

	public warn(logLabel: string, pender: Appender, payload: any, ...params: any): void {
		pender.warn(logLabel, payload, params);
	}

	public error(logLabel: string, pender: Appender, payload: any, ...params: any): void {
		pender.error(logLabel, payload, params);
	}

	public fatal(logLabel: string, pender: Appender, payload: any, ...params: any): void {
		pender.fatal(logLabel, payload, params);
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