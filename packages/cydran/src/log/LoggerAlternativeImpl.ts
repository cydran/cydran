import Type from "interface/Type";
import Level from "log/Level";
import Logger from "log/Logger";
import { OutputStrategy } from "log/appender/OutputStrategy";
import AdvancedMap from "pattern/AdvancedMap";
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { Properties } from "properties/Property";
import { isDefined, requireNotNull } from "util/Utils";
import TraceLoggerStrategyImpl from "log/strategy/TraceLoggerStrategyImpl";
import DebugLoggerStrategyImpl from 'log/strategy/DebugLoggerStrategyImpl';
import InfoLoggerStrategyImpl from 'log/strategy/InfoLoggerStrategyImpl';
import WarnLoggerStrategyImpl from 'log/strategy/WarnLoggerStrategyImpl';
import ErrorLoggerStrategyImpl from 'log/strategy/ErrorLoggerStrategyImpl';
import FatalLoggerStrategyImpl from 'log/strategy/FatalLoggerStrategyImpl';
import DisabledLoggerStrategyImpl from 'log/strategy/DisabledLoggerStrategyImpl';
import { Context } from "context/Context";
import LoggerStrategy from 'log/strategy/LoggerStrategy';
import ConsoleOutputStrategy from "log/appender/ConsoleOutputStrategy";

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

	private key: string;

	private label: string;

	private properties: Properties;

	private outputStrategy: OutputStrategy;

	private strategy: LoggerStrategy;

	constructor(context: Context, key: string, label: string) {
		this.key = requireNotNull(key, "key");
		this.label = label;
		requireNotNull(context, "context");
		this.properties = context.getProperties();
		const contextNameSegment = context.isRoot() ? "" : "." + context.getFullName()
		const propertyPrefix: string = LOGGER_NAME_PREFIX + contextNameSegment + "." + this.key + ".";
		const preferredPropertyName: string = propertyPrefix + "level";
		this.properties.addFallbackObserver(this, this.onLevelChange, preferredPropertyName, "cydran.logging");

		// TODO - Inject this and not just a specific implementation
		this.outputStrategy = new ConsoleOutputStrategy();
		this.onLevelChange(preferredPropertyName, this.properties.getWithFallback(preferredPropertyName) as string);
	}

	public getKey(): string {
		return this.key;
	}

	public getLabel(): string {
		return this.label;
	}

	public trace(payload: any, error?: Error): void {
		this.strategy.trace(this.label, this.outputStrategy, payload, error);
	}

	public ifTrace(payloadFn: () => any, error?: Error): void {
		this.strategy.ifTrace(this.label, this.outputStrategy, payloadFn, error);
	}

	public debug(payload: any, error?: Error): void {
		this.strategy.debug(this.label, this.outputStrategy, payload, error);
	}

	public ifDebug(payloadFn: () => any, error?: Error): void {
		this.strategy.ifDebug(this.label, this.outputStrategy, payloadFn, error);
	}

	public info(payload: any, error?: Error): void {
		this.strategy.info(this.label, this.outputStrategy, payload, error);
	}

	public ifInfo(payloadFn: () => any, error?: Error): void {
		this.strategy.ifInfo(this.label, this.outputStrategy, payloadFn, error);
	}

	public warn(payload: any, error?: Error): void {
		this.strategy.warn(this.label, this.outputStrategy, payload, error);
	}

	public ifWarn(payloadFn: () => any, error?: Error): void {
		this.strategy.ifWarn(this.label, this.outputStrategy, payloadFn, error);
	}

	public error(payload: any, error?: Error): void {
		this.strategy.error(this.label, this.outputStrategy, payload, error);
	}

	public ifError(payloadFn: () => any, error?: Error): void {
		this.strategy.ifError(this.label, this.outputStrategy, payloadFn, error);
	}

	public fatal(payload: any, error?: Error): void {
		this.strategy.fatal(this.label, this.outputStrategy, payload, error);
	}

	public ifFatal(payloadFn: () => any, error?: Error): void {
		this.strategy.ifFatal(this.label, this.outputStrategy, payloadFn, error);
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
		
		this.outputStrategy.info("Level Changed: " + value, null);

		const level: string = value.toUpperCase();

		if (STRATEGIES.has(level)) {
			const classInstance: Type<LoggerStrategy> = STRATEGIES.get(level);
			this.strategy = new classInstance(this.outputStrategy);
		}
	}

}

export default LoggerAlternativeImpl;
