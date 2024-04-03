import Logger from 'log/Logger';
import { OutputStrategy } from 'log/OutputStrategy';
import { requireNotNull } from 'util/Utils';

class WarnLoggerImpl implements Logger {

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
		// Intentionally do nothing
	}

	public ifTrace(payloadFn: () => any, error?: Error): void {
		// Intentionally do nothing
	}

	public debug(payload: any, error?: Error): void {
		// Intentionally do nothing
	}

	public ifDebug(payloadFn: () => any, error?: Error): void {
		// Intentionally do nothing
	}

	public info(payload: any, error?: Error): void {
		// Intentionally do nothing
	}

	public ifInfo(payloadFn: () => any, error?: Error): void {
		// Intentionally do nothing
	}

	public warn(payload: any, error?: Error): void {
		this.outputStrategy.warn(this.name, payload, error);
	}

	public ifWarn(payloadFn: () => any, error?: Error): void {
		this.outputStrategy.warn(this.name, payloadFn(), error);
	}

	public error(payload: any, error?: Error): void {
		this.outputStrategy.error(this.name, payload, error);
	}

	public ifError(payloadFn: () => any, error?: Error): void {
		this.outputStrategy.error(this.name, payloadFn(), error);
	}

	public fatal(payload: any, error?: Error): void {
		this.outputStrategy.fatal(this.name, payload, error);
	}

	public ifFatal(payloadFn: () => any, error?: Error): void {
		this.outputStrategy.fatal(this.name, payloadFn(), error);
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

export default WarnLoggerImpl;
