import Level from 'log/Level';
import { Appender } from 'log/appender/Appender';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class FatalLevelStrategyImpl extends AbstractLevelStrategy {

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

	public warn(logLabel: string, appender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifWarn(logLabel: string, appender: Appender, primaryMsgFn: () => any, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public error(logLabel: string, appender: Appender, msgBase: string, moreArgs: any[]): void {
		// Intentionally do nothing
	}

	public ifError(logLabel: string, appender: Appender, primaryMsgFn: () => any, moreArgs: any[]): void {
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
