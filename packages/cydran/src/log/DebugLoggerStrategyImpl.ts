import AbstractLoggerStrategy from 'log/AbstractLoggerStrategy';
import LoggerStrategy from 'log/LoggerStrategy';
import Level from 'log/Level';
import { OutputStrategy } from 'log/OutputStrategy';

class DebugLoggerStrategyImpl extends AbstractLoggerStrategy implements LoggerStrategy {

	public trace(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifTrace(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		// Intentionally do nothing
	}

	public getLevel(): string {
		return Level.DEBUG;
	}

}

export default DebugLoggerStrategyImpl;
