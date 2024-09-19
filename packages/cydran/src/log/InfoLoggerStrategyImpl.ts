import AbstractLoggerStrategy from 'log/AbstractLoggerStrategy';
import LoggerStrategy from 'log/LoggerStrategy';
import Level from 'log/Level';
import { OutputStrategy } from 'log/OutputStrategy';

class InfoLoggerStrategyImpl extends AbstractLoggerStrategy implements LoggerStrategy {

	public trace(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifTrace(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		// Intentionally do nothing
	}

	public debug(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifDebug(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		// Intentionally do nothing
	}

	public getLevel(): string {
		return Level.INFO;
	}

}

export default InfoLoggerStrategyImpl;
