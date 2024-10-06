import Type from "interface/Type";
import Level from "log/Level";
import Logger from "log/Logger";
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
import ConsoleAppender from "log/appender/ConsoleAppender";
import { IdGenerator } from "util/IdGenerator";
import { Appender } from "./appender/Appender";

const STRATEGIES: AdvancedMap<Type<LoggerStrategy>> = new AdvancedMapImpl<Type<LoggerStrategy>>();
STRATEGIES.put(Level.TRACE, TraceLoggerStrategyImpl);
STRATEGIES.put(Level.DEBUG, DebugLoggerStrategyImpl);
STRATEGIES.put(Level.INFO, InfoLoggerStrategyImpl);
STRATEGIES.put(Level.WARN, WarnLoggerStrategyImpl);
STRATEGIES.put(Level.ERROR, ErrorLoggerStrategyImpl);
STRATEGIES.put(Level.FATAL, FatalLoggerStrategyImpl);
STRATEGIES.put(Level.DISABLED, DisabledLoggerStrategyImpl);

const LOGGER_NAME_PREFIX = "cydran.logging";

class LoggerAlternativeImpl implements Logger {

	private id: string;

	private name: string;

	private properties: Properties;

	private appender: Appender;

	private strategy: LoggerStrategy;

	constructor(name: string, context: Context, id: string = IdGenerator.generate()) {
		this.name = requireNotNull(name, "name");
		this.id = id;
		requireNotNull(context, "context");
		this.properties = context.getProperties();
		const contextNameSegment = `${ context.isRoot() ? "" : "." }${ context.getFullName() }`
		const propertyPrefix: string = `${ LOGGER_NAME_PREFIX }${ contextNameSegment }.${ this.name }`;
		const preferredPropertyName: string = `${ propertyPrefix }.level`;
		this.properties.addFallbackObserver(this, this.onLevelChange, preferredPropertyName, LOGGER_NAME_PREFIX);

		// TODO - Inject this and not just a specific implementation
		this.appender = new ConsoleAppender(IdGenerator.generate());
		this.onLevelChange(preferredPropertyName, this.properties.getWithFallback(preferredPropertyName) as string);
	}

	public ifTrace(payloadFn: () => any, ...param: any): void {
		this.strategy.ifTrace(this.name, this.appender, payloadFn, param);
	}

	public ifDebug(payloadFn: () => any, ...param: any): void {
		this.strategy.ifDebug(this.name, this.appender, payloadFn, param);
	}

	public ifInfo(payloadFn: () => any, ...param: any): void {
		this.strategy.ifInfo(this.name, this.appender, payloadFn, param);
	}

	public ifWarn(payloadFn: () => any, ...param: any): void {
		this.strategy.ifWarn(this.name, this.appender, payloadFn, param);
	}

	public ifError(payloadFn: () => any, ...param: any): void {
		this.strategy.ifError(this.name, this.appender, payloadFn, param);
	}

	public ifFatal(payloadFn: () => any, ...param: any): void {
		this.strategy.ifFatal(this.name, this.appender, payloadFn, param);
	}
	
	public trace(payload: any, ...params: any): void {
		this.strategy.trace(this.name, this.appender, payload, params);
	}

	public debug(payload: any, ...params: any): void {
		this.strategy.debug(this.name, this.appender, payload, params);
	}

	public info(payload: any, ...params: any): void {
		this.strategy.info(this.name, this.appender, payload, params);
	}
	
	public warn(payload: any, ...params: any): void {
		this.strategy.warn(this.name, this.appender, payload, params);
	}

	public error(payload: any, ...params: any): void {
		this.strategy.error(this.name, this.appender, payload, params);
	}

	public fatal(payload: any, ...params: any): void {
		this.strategy.fatal(this.name, this.appender, payload, params);
	}

	public getName(): string {
		return this.name;
	}

	public getLevel(): Level {
		return this.strategy.getLevel();
	}
	
	public getId(): string {
		return this.id;
	}

	public log(level: Level, payload: any, ...params: any): void {
		if (this.willMeet(level)) {
			this.appender.log(level, payload, params);
		}
	}

	public isTrace(): boolean {
		return this.willMeet(Level.TRACE);
	}

	public isDebug(): boolean {
		return this.willMeet(Level.DEBUG);
	}

	public isInfo(): boolean {
		return this.willMeet(Level.INFO);
	}

	public isWarn(): boolean {
		return this.willMeet(Level.WARN);
	}

	public isError(): boolean {
		return this.willMeet(Level.ERROR);
	}

	public isFatal(): boolean {
		return this.willMeet(Level.FATAL);
	}

	private willMeet(chkdLvl: Level): boolean  {
		return chkdLvl >= this.getLevel();
	}

	private onLevelChange(key: string, value: string): void {
		const level: string = value.trim().toUpperCase();

		if (!isDefined(level)) {
			this.appender.warn(`LoggerAlternative[${ this.id } name=${ this.name }]:`, `attempted level change to ${ level }`);
			return;
		}

		if (STRATEGIES.has(level)) {
			const classInstance: Type<LoggerStrategy> = STRATEGIES.get(level);
			this.strategy = new classInstance(this.appender);
			this.appender.debug(`LoggerAlternative[${ this.id } name=${ this.name }]:`, `level change to ${ level }`);
		}
	}

}

export default LoggerAlternativeImpl;
