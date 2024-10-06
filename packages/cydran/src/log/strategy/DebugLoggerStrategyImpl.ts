import { Appender } from "log/appender/Appender";
import Level from "log/Level";
import { AbstractLogStrategy } from "log/strategy/AbstractLogStrategy";

class DebugLoggerStrategyImpl extends AbstractLogStrategy {

	public getLevel(): Level {
		return Level.DEBUG;
	}

	public ifTrace(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		// intentional no-op
	}

	public trace(logName: string, pender: Appender, payload: string, ...params: any): void {
		// intentional no-op
	}
}

export default DebugLoggerStrategyImpl;
