import Level from "log/Level";
import Logger from "log/Logger";
import OutputStrategy from "log/OutputStrategy";
import { Properties } from "properties/Property";
import { requireNotNull } from "util/Utils";

class LoggerAlternativeImpl implements Logger {

	private name: string;

	private properties: Properties;

	private outputStrategy: OutputStrategy;

	constructor(name: string, properties: Properties) {
		this.name = requireNotNull(name, "name");
		this.properties = requireNotNull(properties, "properties");
		this.properties.addPropertyObserver("cydran.logging.level", (value: any) => this.onLevelChange(value));
		this.onLevelChange(this.properties.get("cydran.logging.level"));
	}

	public getName(): string {
		return this.name;
	}

	public trace(payload: any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public ifTrace(payloadFn: () => any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public debug(payload: any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public ifDebug(payloadFn: () => any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public info(payload: any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public ifInfo(payloadFn: () => any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public warn(payload: any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public ifWarn(payloadFn: () => any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public error(payload: any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public ifError(payloadFn: () => any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public fatal(payload: any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public ifFatal(payloadFn: () => any, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public ifLog(payloadFn: () => any, level: Level, error?: Error): void {
		throw new Error("Method not implemented.");
	}

	public isTrace(): boolean {
		throw new Error("Method not implemented.");
	}

	public isDebug(): boolean {
		throw new Error("Method not implemented.");
	}

	public isInfo(): boolean {
		throw new Error("Method not implemented.");
	}

	public isWarn(): boolean {
		throw new Error("Method not implemented.");
	}

	public isError(): boolean {
		throw new Error("Method not implemented.");
	}

	public isFatal(): boolean {
		throw new Error("Method not implemented.");
	}

	public isDisabled(): boolean {
		throw new Error("Method not implemented.");
	}

	public getLevel(): Level {
		throw new Error("Method not implemented.");
	}

	public setLevel(level: Level): void {
		throw new Error("Method not implemented.");
	}

	private onLevelChange(value: any): void {
		// TODO - Implement
	}

}

export default LoggerAlternativeImpl;
