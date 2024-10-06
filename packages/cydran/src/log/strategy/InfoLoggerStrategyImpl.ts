import { Appender } from "log/appender/Appender";
import Level from "log/Level";
import { AbstractLogStrategy } from "log/strategy/AbstractLogStrategy";

class InfoLoggerStrategyImpl extends AbstractLogStrategy {

	public getName(): string {
		return "InfoLoggerStrategy"
	}

	public getLevel(): Level {
		return Level.INFO;
	}

	public ifTrace(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		// intentional no-op
	}

	public ifDebug(logName: string, pender: Appender, payloadFn: () => any, ...params: any): void {
		// intentional no-op
	}

	public trace(logName: string, pender: Appender, payload: string, ...params: any): void {
		// intentional no-op
	}

	public debug(logName: string, pender: Appender, payload: string, ...params: any): void {
		// intentional no-op
	}
}

export default InfoLoggerStrategyImpl;
