import Logger from 'log/Logger';
import { requireNotNull } from 'util/Utils';
import { OutputStrategy } from 'log/OutputStrategy';

class ErrorLoggerImpl implements Logger {

	private name: string;

	private outputStrategy: OutputStrategy;

	public constructor(name: string, outputStrategy: OutputStrategy) {
		this.name = requireNotNull(name, "name");
		this.outputStrategy = requireNotNull(outputStrategy, "outputStrategy");
	}

	public getName(): string {
		return this.name;
	}

	public trace(payload: any, error?: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifTrace(payloadFn: () => any, error?: Error): void {
		throw new Error('Method not implemented.');
	}

	public debug(payload: any, error?: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifDebug(payloadFn: () => any, error?: Error): void {
		throw new Error('Method not implemented.');
	}

	public info(payload: any, error?: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifInfo(payloadFn: () => any, error?: Error): void {
		throw new Error('Method not implemented.');
	}

	public warn(payload: any, error?: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifWarn(payloadFn: () => any, error?: Error): void {
		throw new Error('Method not implemented.');
	}

	public error(payload: any, error?: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifError(payloadFn: () => any, error?: Error): void {
		throw new Error('Method not implemented.');
	}

	public fatal(payload: any, error?: Error): void {
		throw new Error('Method not implemented.');
	}

	public ifFatal(payloadFn: () => any, error?: Error): void {
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

export default ErrorLoggerImpl;
