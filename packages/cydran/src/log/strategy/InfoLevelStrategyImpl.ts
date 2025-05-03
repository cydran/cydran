import Level from 'log/Level';
import { Appender } from 'log/appender/Appender';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class InfoLevelStrategyImpl extends AbstractLevelStrategy {

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

	public isTrace(): boolean {
		return false;
	}

	public isDebug(): boolean {
		return false;
	}

	public isInfo(): boolean {
		return true;
	}

	public isWarn(): boolean {
		return true;
	}

	public isError(): boolean {
		return true;
	}

	public isFatal(): boolean {
		return true;
	}

	public getLevel(): string {
		return Level.INFO;
	}

}

export default InfoLevelStrategyImpl;
