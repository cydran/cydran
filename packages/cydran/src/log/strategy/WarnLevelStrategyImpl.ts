import Level from 'log/Level';
import { Appender } from 'log/appender/Appender';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class WarnLevelStrategyImpl extends AbstractLevelStrategy {

	public trace(logLabel: string, appender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifTrace(logLabel: string, appender: Appender, primaryMsgFn: () => any, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public debug(logLabel: string, appender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifDebug(logLabel: string, appender: Appender, primaryMsgFn: () => any, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public info(logLabel: string, appender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifInfo(logLabel: string, appender: Appender, primaryMsgFn: () => any, moreArgs: any[]): void {
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
		return true;
	}

	public isError(): boolean {
		return true;
	}

	public isFatal(): boolean {
		return true;
	}

	public getLevel(): string {
		return Level.WARN;
	}

}

export default WarnLevelStrategyImpl;
