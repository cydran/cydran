import { Appender } from "log/appender/Appender";
import Level from "log/Level";
import { AbstractLogStrategy } from "log/strategy/AbstractLogStrategy";

class WarnLoggerStrategyImpl extends AbstractLogStrategy {

	public getLevel(): Level {
		return Level.WARN;
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

	public trace(logName: string, pender: Appender, payload: any, ...params: any): void {
		// intentional no-op
	}

	public debug(logName: string, pender: Appender, payload: any, ...params: any): void {
		// intentional no-op
	}

	public info(logName: string, pender: Appender, payload: any, ...params: any): void {
		// intentional no-op
	}
}

export default WarnLoggerStrategyImpl;
