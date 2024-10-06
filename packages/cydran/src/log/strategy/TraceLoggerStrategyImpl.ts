import Level from "log/Level";
import { AbstractLogStrategy } from "log/strategy/AbstractLogStrategy";

class TraceLoggerStrategyImpl extends AbstractLogStrategy {
	
	public getLevel(): Level {
		return Level.TRACE;
	}
	
}

export default TraceLoggerStrategyImpl;
