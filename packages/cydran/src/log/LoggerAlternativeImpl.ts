import Type from "interface/Type";
import Level from "log/Level";
import Logger from "log/Logger";
import { OutputStrategy } from "log/OutputStrategy";
import AdvancedMap from "pattern/AdvancedMap";
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { Properties } from "properties/Property";
import { isDefined, requireNotNull } from "util/Utils";
import TraceLoggerStrategyImpl from "log/TraceLoggerStrategyImpl";
import DebugLoggerStrategyImpl from 'log/DebugLoggerStrategyImpl';
import InfoLoggerStrategyImpl from 'log/InfoLoggerStrategyImpl';
import WarnLoggerStrategyImpl from 'log/WarnLoggerStrategyImpl';
import ErrorLoggerStrategyImpl from 'log/ErrorLoggerStrategyImpl';
import FatalLoggerStrategyImpl from 'log/FatalLoggerStrategyImpl';
import DisabledLoggerStrategyImpl from 'log/DisabledLoggerStrategyImpl';
import { Context } from "context/Context";
import LoggerStrategy from 'log/LoggerStrategy';
import ConsoleOutputStrategy from "log/ConsoleOutputStrategy";
import { IdGenerator } from "util/IdGenerator";

const STRATEGIES: AdvancedMap<Type<LoggerStrategy>> = new AdvancedMapImpl<Type<LoggerStrategy>>();
STRATEGIES.put(Level.TRACE.toUpperCase(), TraceLoggerStrategyImpl);
STRATEGIES.put(Level.DEBUG.toUpperCase(), DebugLoggerStrategyImpl);
STRATEGIES.put(Level.INFO.toUpperCase(), InfoLoggerStrategyImpl);
STRATEGIES.put(Level.WARN.toUpperCase(), WarnLoggerStrategyImpl);
STRATEGIES.put(Level.ERROR.toUpperCase(), ErrorLoggerStrategyImpl);
STRATEGIES.put(Level.FATAL.toUpperCase(), FatalLoggerStrategyImpl);
STRATEGIES.put(Level.DISABLED.toUpperCase(), DisabledLoggerStrategyImpl);

const LOGGER_NAME_PREFIX = "cydran.logging";

class LoggerAlternativeImpl implements Logger {

	private id: string;

	private name: string;

	private properties: Properties;

	private appender: OutputStrategy;

	private strategy: LoggerStrategy;

	constructor(name: string, context: Context, id: string = IdGenerator.generate()) {
		this.name = requireNotNull(name, "name");
		this.id = id;
		requireNotNull(context, "context");
		this.properties = context.getProperties();
		const contextNameSegment = context.isRoot() ? "" : "." + context.getFullName()
		const loggerName: string = LOGGER_NAME_PREFIX
		const propertyPrefix: string = LOGGER_NAME_PREFIX + contextNameSegment + "." + this.name + ".";
		const preferredPropertyName: string = propertyPrefix + "level";
		this.properties.addFallbackObserver(this, this.onLevelChange, preferredPropertyName, "cydran.logging");

		// TODO - Inject this and not just a specific implementation
		this.appender = new ConsoleOutputStrategy();
		this.onLevelChange(preferredPropertyName, this.properties.getWithFallback(preferredPropertyName) as string);
	}

	public getName(): string {
		return this.name;
	}

	public trace(payload: any, error?: Error): void {
		this.strategy.trace(this.name, this.appender, payload, error);
	}

	public ifTrace(payloadFn: () => any, error?: Error): void {
		this.strategy.ifTrace(this.name, this.appender, payloadFn, error);
	}

	public debug(payload: any, error?: Error): void {
		this.strategy.debug(this.name, this.appender, payload, error);
	}

	public ifDebug(payloadFn: () => any, error?: Error): void {
		this.strategy.ifDebug(this.name, this.appender, payloadFn, error);
	}

	public info(payload: any, error?: Error): void {
		this.strategy.info(this.name, this.appender, payload, error);
	}

	public ifInfo(payloadFn: () => any, error?: Error): void {
		this.strategy.ifInfo(this.name, this.appender, payloadFn, error);
	}

	public warn(payload: any, error?: Error): void {
		this.strategy.warn(this.name, this.appender, payload, error);
	}

	public ifWarn(payloadFn: () => any, error?: Error): void {
		this.strategy.ifWarn(this.name, this.appender, payloadFn, error);
	}

	public error(payload: any, error?: Error): void {
		this.strategy.error(this.name, this.appender, payload, error);
	}

	public ifError(payloadFn: () => any, error?: Error): void {
		this.strategy.ifError(this.name, this.appender, payloadFn, error);
	}

	public fatal(payload: any, error?: Error): void {
		this.strategy.fatal(this.name, this.appender, payload, error);
	}

	public ifFatal(payloadFn: () => any, error?: Error): void {
		this.strategy.ifFatal(this.name, this.appender, payloadFn, error);
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

	public getLevel(): string {
		return this.strategy.getLevel();
	}

	private onLevelChange(key: string, value: string): void {
		if (!isDefined(value)) {
			return;
		}
		const level: string = value.toUpperCase();
		this.appender.info(`LoggerAlternative[${ this.id } name=${ this.name }]:`, `level change to ${ level }`);

		if (STRATEGIES.has(level)) {
			const classInstance: Type<LoggerStrategy> = STRATEGIES.get(level);
			this.strategy = new classInstance(this.appender);
		}
	}

}

export default LoggerAlternativeImpl;
