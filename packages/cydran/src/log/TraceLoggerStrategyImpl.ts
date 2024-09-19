import LoggerStrategy from 'log/LoggerStrategy';
import { OutputStrategy } from 'log/OutputStrategy';

class TraceLoggerStrategyImpl implements LoggerStrategy {

	public trace(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		outputStrategy.trace(name, payload, error);
	}

	public ifTrace(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		outputStrategy.trace(name, payloadFn(), error);
	}

	public debug(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		outputStrategy.debug(name, payload, error);
	}

	public ifDebug(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		outputStrategy.debug(name, payloadFn(), error);
	}

	public info(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		outputStrategy.info(name, payload, error);
	}

	public ifInfo(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		outputStrategy.info(name, payloadFn(), error);
	}

	public warn(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		outputStrategy.warn(name, payload, error);
	}

	public ifWarn(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		outputStrategy.warn(name, payloadFn(), error);
	}

	public error(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		outputStrategy.error(name, payload, error);
	}

	public ifError(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		outputStrategy.error(name, payloadFn(), error);
	}

	public fatal(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		outputStrategy.fatal(name, payload, error);
	}

	public ifFatal(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		outputStrategy.fatal(name, payloadFn(), error);
	}

	public getLevel(): string {
		return Level.TRACE;
	}

}

export default TraceLoggerStrategyImpl;
