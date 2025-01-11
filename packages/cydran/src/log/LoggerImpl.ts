import Type from "interface/Type";
import Level from "log/Level";
import Logger from "log/Logger";
import { Appender } from "log/appender/Appender";
import AdvancedMap from "pattern/AdvancedMap";
import AdvancedMapImpl from "pattern/AdvancedMapImpl";
import { Properties } from "properties/Property";
import { isDefined, requireNotNull } from "util/Utils";
import TraceLevelStrategyImpl from "log/strategy/TraceLevelStrategyImpl";
import DebugLevelStrategyImpl from 'log/strategy/DebugLevelStrategyImpl';
import InfoLevelStrategyImpl from 'log/strategy/InfoLevelStrategyImpl';
import WarnLevelStrategyImpl from 'log/strategy/WarnLevelStrategyImpl';
import ErrorLevelStrategyImpl from 'log/strategy/ErrorLevelStrategyImpl';
import FatalLevelStrategyImpl from 'log/strategy/FatalLevelStrategyImpl';
import DisabledLevelStrategyImpl from 'log/strategy/DisabledLevelStrategyImpl';
import { Context } from "context/Context";
import { LevelStrategy } from 'log/strategy/LevelStrategy';

const STRATEGIES: AdvancedMap<Type<LevelStrategy>> = new AdvancedMapImpl<Type<LevelStrategy>>();
STRATEGIES.put(Level.TRACE.toUpperCase(), TraceLevelStrategyImpl);
STRATEGIES.put(Level.DEBUG.toUpperCase(), DebugLevelStrategyImpl);
STRATEGIES.put(Level.INFO.toUpperCase(), InfoLevelStrategyImpl);
STRATEGIES.put(Level.WARN.toUpperCase(), WarnLevelStrategyImpl);
STRATEGIES.put(Level.ERROR.toUpperCase(), ErrorLevelStrategyImpl);
STRATEGIES.put(Level.FATAL.toUpperCase(), FatalLevelStrategyImpl);
STRATEGIES.put(Level.DISABLED.toUpperCase(), DisabledLevelStrategyImpl);

const LOGGER_NAME_PREFIX = "cydran.logging";

class LoggerImpl implements Logger {

	private key: string;

	private label: string;

	private properties: Properties;

	private appender: Appender;

	private strategy: LevelStrategy;

	constructor(context: Context, appender: Appender, key: string, label: string) {
		this.appender = requireNotNull(appender, "appender");
		this.key = requireNotNull(key, "key");
		this.label = label ?? this.key;
		requireNotNull(context, "context");
		this.properties = context.getProperties();
		const contextNameSegment = context.isRoot() ? "" : "." + context.getFullName()
		const propertyPrefix: string = LOGGER_NAME_PREFIX + contextNameSegment + "." + this.key + ".";
		const preferredPropertyName: string = propertyPrefix + "level";
		this.properties.addFallbackObserver(this, this.onLevelChange, preferredPropertyName, "cydran.logging");
		this.onLevelChange(preferredPropertyName, this.properties.getWithFallback(preferredPropertyName) as string);
	}

	public getKey(): string {
		return this.key;
	}

	public getLabel(): string {
		return this.label;
	}

	public trace(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.trace(this.label, this.appender, primaryMsg, moreArgs);
	}

	public ifTrace(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifTrace(this.label, this.appender, primaryMsgFn, moreArgs);
	}

	public debug(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.debug(this.label, this.appender, primaryMsg, moreArgs);
	}

	public ifDebug(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifDebug(this.label, this.appender, primaryMsgFn, moreArgs);
	}

	public info(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.info(this.label, this.appender, primaryMsg, moreArgs);
	}

	public ifInfo(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifInfo(this.label, this.appender, primaryMsgFn, moreArgs);
	}

	public warn(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.warn(this.label, this.appender, primaryMsg, moreArgs);
	}

	public ifWarn(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifWarn(this.label, this.appender, primaryMsgFn, moreArgs);
	}

	public error(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.error(this.label, this.appender, primaryMsg, moreArgs);
	}

	public ifError(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifError(this.label, this.appender, primaryMsgFn, moreArgs);
	}

	public fatal(primaryMsg: string, ...moreArgs: any): void {
		this.strategy.fatal(this.label, this.appender, primaryMsg, moreArgs);
	}

	public ifFatal(primaryMsgFn: () => any, ...moreArgs: any[]): void {
		this.strategy.ifFatal(this.label, this.appender, primaryMsgFn, moreArgs);
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
		if (STRATEGIES.has(level)) {
			const classInstance: Type<LevelStrategy> = STRATEGIES.get(level);
			this.strategy = new classInstance(this.appender);
			this.ifDebug(() => `level set to: ${ level }`);
		} else {
			this.ifDebug(() => `unknown level: ${ level }`);
		}
	}

}

export default LoggerImpl;
