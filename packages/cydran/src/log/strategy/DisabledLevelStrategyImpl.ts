import { Appender } from 'log/appender/Appender';
import Level from 'log/Level';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class DisabledLevelStrategyImpl extends AbstractLevelStrategy {

	public trace(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public ifTrace(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public debug(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public ifDebug(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public info(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public ifInfo(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public warn(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public ifWarn(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public error(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public ifError(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public fatal(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public ifFatal(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public isTrace(): boolean {
		return false;
	}

	public isDebug(): boolean {
		return false;
	}

	public isInfo(): boolean {
		return false;
	}

	public isWarn(): boolean {
		return false;
	}

	public isError(): boolean {
		return false;
	}

	public isFatal(): boolean {
		return false;
	}

	public getLevel(): string {
		return Level.DISABLED;
	}

}

export default DisabledLevelStrategyImpl;
