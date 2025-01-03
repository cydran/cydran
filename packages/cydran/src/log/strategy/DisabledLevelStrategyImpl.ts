import { Appender } from 'log/appender/Appender';
import Level from 'log/Level';
import { AbstractLevelStrategy } from 'log/strategy/AbstractLevelStrategy';

class DisabledLevelStrategyImpl extends AbstractLevelStrategy {

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

	public getLevel(): string {
		return Level.DISABLED;
	}

}

export default DisabledLevelStrategyImpl;
