import { Appender } from 'log/appender/Appender';
import Level from 'log/Level';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class DisabledLevelStrategyImpl extends AbstractLevelStrategy {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public trace(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public ifTrace(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public debug(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public ifDebug(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public info(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public ifInfo(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public warn(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public ifWarn(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public error(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public ifError(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public fatal(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
