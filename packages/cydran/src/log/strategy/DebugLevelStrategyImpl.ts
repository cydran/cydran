import Level from 'log/Level';
import { Appender } from 'log/appender/Appender';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class DebugLevelStrategyImpl extends AbstractLevelStrategy {

	public trace(logLabel: string, pender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifTrace(logLabel: string, pender: Appender, payloadFn: () => any, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public getLevel(): string {
		return Level.DEBUG;
	}

}

export default DebugLevelStrategyImpl;
