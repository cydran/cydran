import AbstractLoggerStrategy from 'log/AbstractLoggerStrategy';
import LoggerStrategy from 'log/LoggerStrategy';
import Level from 'log/Level';
class TraceLoggerStrategyImpl extends AbstractLoggerStrategy implements LoggerStrategy {

	public getLevel(): string {
		return Level.TRACE;
	}

}

export default TraceLoggerStrategyImpl;
