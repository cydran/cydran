import Level from 'log/Level';
import { Appender } from 'log/appender/Appender';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class FatalLevelStrategyImpl extends AbstractLevelStrategy {

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
		return true;
	}
	
	public getLevel(): string {
		return Level.FATAL;
	}

}

export default FatalLevelStrategyImpl;
