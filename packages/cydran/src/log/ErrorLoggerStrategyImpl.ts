import LoggerStrategy from 'log/LoggerStrategy';
import { requireNotNull } from 'util/Utils';
import { OutputStrategy } from 'log/OutputStrategy';

class ErrorLoggerStrategyImpl implements LoggerStrategy {

	private name: string;

	private outputStrategy: OutputStrategy;

	public constructor(name: string, outputStrategy: OutputStrategy) {
		this.name = requireNotNull(name, "name");
		this.outputStrategy = requireNotNull(outputStrategy, "outputStrategy");
	}

	public trace(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifTrace(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public debug(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifDebug(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public info(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifInfo(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public warn(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifWarn(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public error(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifError(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public fatal(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifFatal(name: string, outputStrategy: OutputStrategy, payloadFn: () => any, error: Error): void {
		throw new Error('Method not implemented.');
	}

	public isTrace(): boolean {
		throw new Error('Method not implemented.');
	}

	public isDebug(): boolean {
		throw new Error('Method not implemented.');
	}

	public isInfo(): boolean {
		throw new Error('Method not implemented.');
	}

	public isWarn(): boolean {
		throw new Error('Method not implemented.');
	}

	public isError(): boolean {
		throw new Error('Method not implemented.');
	}

	public isFatal(): boolean {
		throw new Error('Method not implemented.');
	}

	public getLevel(): string {
		throw new Error('Method not implemented.');
	}

}

export default ErrorLoggerStrategyImpl;
