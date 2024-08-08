import LoggerStrategy from 'log/LoggerStrategy';
import { OutputStrategy } from 'log/OutputStrategy';

class TraceLoggerStrategyImpl implements LoggerStrategy {

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

export default TraceLoggerStrategyImpl;
