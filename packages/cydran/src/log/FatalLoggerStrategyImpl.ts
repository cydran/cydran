import LoggerStrategy from 'log/LoggerStrategy';
import { OutputStrategy } from 'log/OutputStrategy';

class FatalLoggerStrategyImpl implements LoggerStrategy {

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

	public info(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifInfo(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		// Intentionally do nothing
	}

	public warn(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifWarn(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		// Intentionally do nothing
	}

	public error(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		// Intentionally do nothing
	}

	public ifError(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		// Intentionally do nothing
	}

	public fatal(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		outputStrategy.fatal(name, payload, error);
	}

	public ifFatal(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		outputStrategy.fatal(name, payloadFn(), error);
	}

	public getLevel(): string {
		return "FATAL";
	}

}

export default FatalLoggerStrategyImpl;
