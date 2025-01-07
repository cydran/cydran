import { Appender } from 'log/appender/Appender';
import Level from 'log/Level';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class DisabledLevelStrategyImpl extends AbstractLevelStrategy {

	public trace(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifTrace(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public debug(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifDebug(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public info(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifInfo(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public warn(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifWarn(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public error(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifError(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public fatal(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifFatal(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public getLevel(): string {
		return Level.DISABLED;
	}

}

export default DisabledLevelStrategyImpl;
