import Type from "interface/Type";
import Level from "log/Level";
import Logger from "log/Logger";
import { OutputStrategy } from "log/OutputStrategy";
import AdvancedMap from "pattern/AdvancedMap";
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { Properties } from "properties/Property";
import { isDefined, requireNotNull } from "util/Utils";
import TraceLoggerImpl from "log/TraceLoggerImpl";
import DebugLoggerImpl from 'log/DebugLoggerImpl';
import InfoLoggerImpl from 'log/InfoLoggerImpl';
import WarnLoggerImpl from 'log/WarnLoggerImpl';
import ErrorLoggerImpl from 'log/ErrorLoggerImpl';
import FatalLoggerImpl from 'log/FatalLoggerImpl';
import DisabledLoggerImpl from 'log/DisabledLoggerImpl';

const STRATEGIES: AdvancedMap<Type<Logger>> = new AdvancedMapImpl<Type<Logger>>();
STRATEGIES.put(Level.TRACE.toUpperCase(), TraceLoggerImpl);
STRATEGIES.put(Level.DEBUG.toUpperCase(), DebugLoggerImpl);
STRATEGIES.put(Level.INFO.toUpperCase(), InfoLoggerImpl);
STRATEGIES.put(Level.WARN.toUpperCase(), WarnLoggerImpl);
STRATEGIES.put(Level.ERROR.toUpperCase(), ErrorLoggerImpl);
STRATEGIES.put(Level.FATAL.toUpperCase(), FatalLoggerImpl);
STRATEGIES.put(Level.DISABLED.toUpperCase(), DisabledLoggerImpl);

class LoggerAlternativeImpl implements Logger {

	private name: string;

	private properties: Properties;

	private outputStrategy: OutputStrategy;

	private strategy: Logger;

	constructor(name: string, properties: Properties) {
		this.name = requireNotNull(name, "name");
		this.properties = requireNotNull(properties, "properties");
		this.properties.addPropertyObserver("cydran.logging.level", (value: any) => this.onLevelChange(value));
		this.onLevelChange(this.properties.get("cydran.logging.level") as string);
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
		this.strategy.error(payload, error);
	}

	public ifError(payloadFn: () => any, error?: Error): void {
		this.strategy.ifError(payloadFn, error);
	}

	public fatal(payload: any, error?: Error): void {
		this.strategy.fatal(payload, error);
	}

	public ifFatal(payloadFn: () => any, error?: Error): void {
		this.strategy.ifFatal(payloadFn, error);
	}

	public isTrace(): boolean {
		return this.strategy.isTrace();
	}

	public isDebug(): boolean {
		return this.strategy.isDebug();
	}

	public isInfo(): boolean {
		return this.strategy.isInfo();
	}

	public isWarn(): boolean {
		return this.strategy.isWarn();
	}

	public isError(): boolean {
		return this.strategy.isError();
	}

	public isFatal(): boolean {
		return this.strategy.isFatal();
	}

	public isDisabled(): boolean {
		return this.strategy.isDisabled();
	}

	public getLevel(): string {
		return this.strategy.getLevel();
	}

	private onLevelChange(value: string): void {
		if (!isDefined(value)) {
			return;
		}

		const key: string = value.toUpperCase();

		if (STRATEGIES.has(key)) {
			const classInstance: Type<Logger> = STRATEGIES.get(key);
			this.strategy = new classInstance();
		}
	}

}

export default LoggerAlternativeImpl;
