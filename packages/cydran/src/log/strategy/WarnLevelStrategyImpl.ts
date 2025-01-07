import Level from 'log/Level';
import { Appender } from 'log/appender/Appender';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class WarnLevelStrategyImpl extends AbstractLevelStrategy {

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

	public getLevel(): string {
		return Level.WARN;
	}

}

export default WarnLevelStrategyImpl;
