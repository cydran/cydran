import Level from "log/Level";
import { OutputStrategy } from "log/OutputStrategy";
import { Properties } from "properties/Property";

abstract class AbstractLoggerStrategy {
	
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

	public ifInfo(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		outputStrategy.error(name, payload, error);
	}

	public warn(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		outputStrategy.warn(name, payload, error);
	}

	public ifWarn(name: string, outputStrategy: OutputStrategy, payload: any, error: Error): void {
		outputStrategy.warn(name, payload, error);
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
		return this.checkIsAgainstCurrent(Level.TRACE);
	}

	public isDebug(): boolean {
		return this.checkIsAgainstCurrent(Level.DEBUG);
	}

	public isInfo(): boolean {
		return this.checkIsAgainstCurrent(Level.INFO);
	}

	public isWarn(): boolean {
		return this.checkIsAgainstCurrent(Level.WARN);
	}

	public isError(): boolean {
		return this.checkIsAgainstCurrent(Level.ERROR);
	}

	public isFatal(): boolean {
		return this.checkIsAgainstCurrent(Level.FATAL);
	}

	private checkIsAgainstCurrent(level: Level): boolean {
		const currIdx: number = Object.keys(Level).indexOf(this.getLevel());
		const chkIdx: number = Object.keys(Level).indexOf(level);
		return chkIdx <= currIdx;
	}

	abstract getLevel(): string;
}

export default AbstractLoggerStrategy;