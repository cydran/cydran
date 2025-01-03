import LevelStrategy from 'log/strategy/LevelStrategy';
import { Appender } from 'log/appender/Appender';

class DisabledLevelStrategyImpl implements LevelStrategy {

	public trace(name: string, appender: Appender, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifTrace(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
		// Intentionally do nothing
	}

	public debug(name: string, appender: Appender, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifDebug(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
		// Intentionally do nothing
	}

	public info(name: string, appender: Appender, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifInfo(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
		// Intentionally do nothing
	}

	public warn(name: string, appender: Appender, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifWarn(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
		// Intentionally do nothing
	}

	public error(name: string, appender: Appender, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifError(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
		// Intentionally do nothing
	}

	public fatal(name: string, appender: Appender, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifFatal(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
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
		return "DISABLED";
	}

}

export default DisabledLevelStrategyImpl;
