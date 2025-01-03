import LevelStrategy from 'log/strategy/LevelStrategy';
import { Appender } from 'log/appender/Appender';

class TraceLevelStrategyImpl implements LevelStrategy {

	public trace(name: string, appender: Appender, payload: any, error: Error): void {
		appender.trace(name, payload, error);
	}

	public ifTrace(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
		appender.trace(name, payloadFn(), error);
	}

	public debug(name: string, appender: Appender, payload: any, error: Error): void {
		appender.debug(name, payload, error);
	}

	public ifDebug(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
		appender.debug(name, payloadFn(), error);
	}

	public info(name: string, appender: Appender, payload: any, error: Error): void {
		appender.info(name, payload, error);
	}

	public ifInfo(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
		appender.info(name, payloadFn(), error);
	}

	public warn(name: string, appender: Appender, payload: any, error: Error): void {
		appender.warn(name, payload, error);
	}

	public ifWarn(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
		appender.warn(name, payloadFn(), error);
	}

	public error(name: string, appender: Appender, payload: any, error: Error): void {
		appender.error(name, payload, error);
	}

	public ifError(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
		appender.error(name, payloadFn(), error);
	}

	public fatal(name: string, appender: Appender, payload: any, error: Error): void {
		appender.fatal(name, payload, error);
	}

	public ifFatal(name: string, appender: Appender, payloadFn: () => any, error: Error): void {
		appender.fatal(name, payloadFn(), error);
	}

	public isTrace(): boolean {
		return true;
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
		return "TRACE";
	}

}

export default TraceLevelStrategyImpl;
