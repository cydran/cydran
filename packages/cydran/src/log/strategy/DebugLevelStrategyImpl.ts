import Level from 'log/Level';
import { Appender } from 'log/appender/Appender';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class DebugLevelStrategyImpl extends AbstractLevelStrategy {

	public trace(logLabel: string, appenders: Appender[], msgBase: string, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}

	public ifTrace(logLabel: string, appenders: Appender[], primaryMsgFn: () => unknown, moreArgs: unknown[]): void {
		// Intentionally do nothing
	}
	
	public isTrace(): boolean {
		return false;
	}

	public isDebug(): boolean {
		return true;
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
		return Level.DEBUG;
	}

}

export default DebugLevelStrategyImpl;
