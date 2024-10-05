import LoggerStrategy from 'log/LoggerStrategy';
import { OutputStrategy } from 'log/strategy/OutputStrategy';

class WarnLoggerStrategyImpl implements LoggerStrategy {

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

	public isTrace(): boolean {
		return false;
	}

	public isDebug(): boolean {
		return false;
	}

	public isInfo(): boolean {
		return false;
	}

	public isWarn(): boolean {
		return true;
	}

	public isError(): boolean {
		return true;
	}

	public isFatal(): boolean {
		return true;
	}

	public getLevel(): string {
		return "WARN";
	}

}

export default WarnLoggerStrategyImpl;
