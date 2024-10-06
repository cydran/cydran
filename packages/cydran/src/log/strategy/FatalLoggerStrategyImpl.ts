import { Appender } from "log/appender/Appender";
import Level from "log/Level";
import { AbstractLogStrategy } from "log/strategy/AbstractLogStrategy";

class FatalLoggerStrategyImpl extends AbstractLogStrategy {

	public getLevel(): Level {
		return Level.FATAL;
	}

	public ifTrace(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		// intentional no-op
	}

	public ifDebug(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		// intentional no-op
	}

	public ifInfo(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		// intentional no-op
	}

	public ifWarn(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		// intentional no-op
	}

	public ifError(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		// intentional no-op
	}

	public trace(logName: string, pender: Appender, payload: string, ...params: any): void {
		// intentional no-op
	}

	public debug(logName: string, pender: Appender, payload: string, ...params: any): void {
		// intentional no-op
	}

	public info(logName: string, pender: Appender, payload: string, ...params: any): void {
		// intentional no-op
	}

	public warn(logName: string, pender: Appender, payload: string, ...params: any): void {
		// intentional no-op
	}

	public error(logName: string, pender: Appender, payload: string, ...params: any): void {
		// intentional no-op
	}
}

export default FatalLoggerStrategyImpl;
